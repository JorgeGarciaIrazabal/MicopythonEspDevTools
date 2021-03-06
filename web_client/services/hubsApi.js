'use strict';
/* jshint ignore:start */
/* ignore jslint start */

function __serialize(obj) {
    return JSON.stringify(__jsonize(obj));
}

function __jsonize(obj){
    if(obj instanceof Date){
        return {__date_time__: obj.getTime()}
    }
    else if(obj instanceof Array){
        obj.forEach(function (elem, i, list){
            list[i] = __jsonize(elem);
        });
    }
    else if(obj instanceof Object){
        for(var key in obj) {
            if(obj.hasOwnProperty(key)){
                obj[key] = __jsonize(obj[key]);
            }
        }
    }
    return obj;
}

function __unserialize(objStr) {
    return __unjsonizer(JSON.parse(objStr));
}

function __unjsonizer(obj) {
    if(obj instanceof Object && '__date_time__' in obj) {
        return new Date(obj.__date_time__);
    }
    else if(obj instanceof Array){
        obj.forEach(function (elem, i, list){
            list[i] = __unjsonizer(elem);
        });
    }
    else if(obj instanceof Object){
        for(var key in obj) {
            if(obj.hasOwnProperty(key)){
                obj[key] = __unjsonizer(obj[key]);
            }
        }
    }
    return obj;
}


function HubsAPI(serverTimeout, wsClientClass, PromiseClass) {

    var messageID = 0,
        promisesHandler = {},
        defaultRespondTimeout = serverTimeout || 5000,
        thisApi = this,
        messagesBeforeOpen = [],
        emptyFunction = function () {return function () {}}, //redefine any empty function as required
        onOpenTriggers = [];

    PromiseClass = PromiseClass || Promise;
    if (!PromiseClass.prototype.finally) {
        PromiseClass.prototype.finally = function (callback) {
            var p = this.constructor;
            return this.then(
                function (value) {
                    return p.resolve(callback()).then(function () {
                        return value;
                    });
                },
                function (reason) {
                    return p.resolve(callback()).then(function () {
                        throw reason;
                    });
                });
        };
    }

    if (!PromiseClass.prototype.setTimeout) {
        PromiseClass.prototype.setTimeout = function (timeout) {
            clearTimeout(this._timeoutID);
            setTimeout(timeoutError(this._reject), timeout);
            return this;
        };
    }

    function timeoutError(reject) {
        return function () {
            reject(new Error('timeout error'));
        };
    }

    function toCamelCase(str) {
        return str.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
    }

    this.clearTriggers = function () {
        messagesBeforeOpen = [];
        onOpenTriggers = [];
    };

    this.connect = function (url, reconnectTimeout) {
        return new PromiseClass(function (resolve, reject) {
            reconnectTimeout = reconnectTimeout || -1;
            function reconnect(error) {
                if (reconnectTimeout !== -1) {
                    window.setTimeout(function () {
                        thisApi.connect(url, reconnectTimeout);
                        thisApi.onReconnecting(error);
                    }, reconnectTimeout);
                }
            }

            try {
                thisApi.wsClient = wsClientClass === undefined ? new WebSocket(url) : new wsClientClass(url);
            } catch (error) {
                reconnect(error);
                return reject(error);
            }

            thisApi.wsClient.onopen = function () {
                resolve();
                thisApi.onOpen(thisApi);
                onOpenTriggers.forEach(function (trigger) {
                    trigger();
                });
                messagesBeforeOpen.forEach(function (message) {
                    thisApi.wsClient.send(message);
                });
            };

            thisApi.wsClient.onclose = function (error) {
                reject(error);
                thisApi.onClose(error);
                reconnect(error);
            };

            thisApi.wsClient.addOnOpenTrigger = function (trigger) {
                if (thisApi.wsClient.readyState === 0) {
                    onOpenTriggers.push(trigger);
                } else if (thisApi.wsClient.readyState === 1) {
                    trigger();
                } else {
                    throw new Error('web socket is closed');
                }
            };

            thisApi.wsClient.onmessage = function (ev) {
                try {
                    var promiseHandler,
                        msgObj = __unserialize(ev.data);
                    if (msgObj.hasOwnProperty('reply')) {
                        promiseHandler = promisesHandler[msgObj.ID];
                        msgObj.success ? promiseHandler.resolve(msgObj.reply) : promiseHandler.reject(msgObj.reply);
                    } else {
                        msgObj.function = toCamelCase(msgObj.function);
                        var executor = thisApi[msgObj.hub].client[msgObj.function];
                        if (executor !== undefined) {
                            var replyMessage = {ID: msgObj.ID};
                            try {
                                replyMessage.reply = executor.apply(executor, msgObj.args);
                                replyMessage.success = true;
                            } catch (e) {
                                replyMessage.success = false;
                                replyMessage.reply = e.toString();
                            } finally {
                                if (replyMessage.reply instanceof PromiseClass) {
                                    replyMessage.reply.then(function (result) {
                                        replyMessage.success = true;
                                        replyMessage.reply = result;
                                        thisApi.wsClient.send(__serialize(replyMessage));
                                    }, function (error) {
                                        replyMessage.success = false;
                                        replyMessage.reply = error;
                                        thisApi.wsClient.send(__serialize(replyMessage));
                                    });
                                } else {
                                    replyMessage.reply = replyMessage.reply === undefined ? null : replyMessage.reply;
                                    thisApi.wsClient.send(__serialize(replyMessage));
                                }
                            }
                        } else {
                            thisApi.onClientFunctionNotFound(msgObj.hub, msgObj.function, msgObj.args);
                        }
                    }
                } catch (err) {
                    thisApi.wsClient.onMessageError(err);
                }
            };

            thisApi.wsClient.onMessageError = function (error) {
                thisApi.onMessageError(error);
            };
        });
    };

    this.onClose = emptyFunction();
    this.onOpen = emptyFunction();
    this.onReconnecting = emptyFunction();
    this.onMessageError = emptyFunction();
    this.onClientFunctionNotFound = emptyFunction();

    this.defaultErrorHandler = null;

    var constructMessage = function (hubName, functionName, args) {
        if (thisApi.wsClient === undefined) {
            throw new Error('ws not connected');
        }
        var promise,
            timeoutID = null,
            _reject;
        promise = new PromiseClass(function (resolve, reject) {
            args = Array.prototype.slice.call(args);
            var id = messageID++,
                body = {'hub': hubName, 'function': functionName, 'args': args, 'ID': id};
            promisesHandler[id] = {};
            promisesHandler[id].resolve = resolve;
            promisesHandler[id].reject = reject;
            timeoutID = setTimeout(timeoutError(reject), defaultRespondTimeout);
            _reject = reject;

            if (thisApi.wsClient.readyState === WebSocket.CONNECTING) {
                messagesBeforeOpen.push(__serialize(body));
            } else if (thisApi.wsClient.readyState !== WebSocket.OPEN) {
                reject('webSocket not connected');
            } else {
                thisApi.wsClient.send(__serialize(body));
            }
        });
        promise._timeoutID = timeoutID;
        promise._reject = _reject;
        return promise;
    };
    
    this.ModuleHub = {};
    this.ModuleHub.server = {
        __HUB_NAME : 'ModuleHub',
        
        getSubscribedClientsIds : function (){
            
            return constructMessage('ModuleHub', 'get_subscribed_clients_ids', arguments);
        },

        subscribeToHub : function (){
            
            return constructMessage('ModuleHub', 'subscribe_to_hub', arguments);
        },

        unsubscribeFromHub : function (){
            
            return constructMessage('ModuleHub', 'unsubscribe_from_hub', arguments);
        }
    };
    this.ModuleHub.client = {
        __HUB_NAME : 'ModuleHub',
        
        changeComponentMode : emptyFunction(),

        changeComponentName : emptyFunction(),

        getAllComponents : emptyFunction(),

        getComponentValue : emptyFunction(),

        readSerial : emptyFunction(),

        saveConfig : emptyFunction(),

        setComponentValue : emptyFunction()
    };
    this.ModuleHub.getClients = function(clientsIds){
        return {
            clientsIds: clientsIds,
            call: function (functionName, functionArgs) {
                var bodyArgs = [this.clientsIds, functionName, functionArgs];
                return constructMessage('ModuleHub', '_client_to_clients_bridge', bodyArgs);
            },
            changeComponentMode : function (name, mode){
                
                var funcArgs = Array.prototype.slice.call(arguments);
                var bodyArgs = [this.clientsIds, 'change_component_mode', funcArgs];
                return constructMessage('ModuleHub', '_client_to_clients_bridge', bodyArgs);
            },

            changeComponentName : function (oldName, newName){
                
                var funcArgs = Array.prototype.slice.call(arguments);
                var bodyArgs = [this.clientsIds, 'change_component_name', funcArgs];
                return constructMessage('ModuleHub', '_client_to_clients_bridge', bodyArgs);
            },

            getAllComponents : function (){
                
                var funcArgs = Array.prototype.slice.call(arguments);
                var bodyArgs = [this.clientsIds, 'get_all_components', funcArgs];
                return constructMessage('ModuleHub', '_client_to_clients_bridge', bodyArgs);
            },

            getComponentValue : function (name){
                
                var funcArgs = Array.prototype.slice.call(arguments);
                var bodyArgs = [this.clientsIds, 'get_component_value', funcArgs];
                return constructMessage('ModuleHub', '_client_to_clients_bridge', bodyArgs);
            },

            readSerial : function (){
                
                var funcArgs = Array.prototype.slice.call(arguments);
                var bodyArgs = [this.clientsIds, 'read_serial', funcArgs];
                return constructMessage('ModuleHub', '_client_to_clients_bridge', bodyArgs);
            },

            saveConfig : function (){
                
                var funcArgs = Array.prototype.slice.call(arguments);
                var bodyArgs = [this.clientsIds, 'save_config', funcArgs];
                return constructMessage('ModuleHub', '_client_to_clients_bridge', bodyArgs);
            },

            setComponentValue : function (name, value){
                
                var funcArgs = Array.prototype.slice.call(arguments);
                var bodyArgs = [this.clientsIds, 'set_component_value', funcArgs];
                return constructMessage('ModuleHub', '_client_to_clients_bridge', bodyArgs);
            }
        }
    };
    this.UPythonUtilsHub = {};
    this.UPythonUtilsHub.server = {
        __HUB_NAME : 'UPythonUtilsHub',
        
        getSubscribedClientsIds : function (){
            
            return constructMessage('UPythonUtilsHub', 'get_subscribed_clients_ids', arguments);
        },

        getUpythonClientIds : function (){
            
            return constructMessage('UPythonUtilsHub', 'get_upython_client_ids', arguments);
        },

        isUpythonConnected : function (id){
            
            return constructMessage('UPythonUtilsHub', 'is_upython_connected', arguments);
        },

        subscribeToHub : function (){
            
            return constructMessage('UPythonUtilsHub', 'subscribe_to_hub', arguments);
        },

        unsubscribeFromHub : function (){
            
            return constructMessage('UPythonUtilsHub', 'unsubscribe_from_hub', arguments);
        }
    };
    this.UPythonUtilsHub.client = {
        __HUB_NAME : 'UPythonUtilsHub',
        
    };
    this.UPythonUtilsHub.getClients = function(clientsIds){
        return {
            clientsIds: clientsIds,
            call: function (functionName, functionArgs) {
                var bodyArgs = [this.clientsIds, functionName, functionArgs];
                return constructMessage('UPythonUtilsHub', '_client_to_clients_bridge', bodyArgs);
            },
        }
    };
    this.UtilsAPIHub = {};
    this.UtilsAPIHub.server = {
        __HUB_NAME : 'UtilsAPIHub',
        
        getHubsStructure : function (){
            
            return constructMessage('UtilsAPIHub', 'get_hubs_structure', arguments);
        },

        getId : function (){
            
            return constructMessage('UtilsAPIHub', 'get_id', arguments);
        },

        getSubscribedClientsIds : function (){
            
            return constructMessage('UtilsAPIHub', 'get_subscribed_clients_ids', arguments);
        },

        isClientConnected : function (clientId){
            
            return constructMessage('UtilsAPIHub', 'is_client_connected', arguments);
        },

        setId : function (clientId){
            
            return constructMessage('UtilsAPIHub', 'set_id', arguments);
        },

        subscribeToHub : function (){
            
            return constructMessage('UtilsAPIHub', 'subscribe_to_hub', arguments);
        },

        unsubscribeFromHub : function (){
            
            return constructMessage('UtilsAPIHub', 'unsubscribe_from_hub', arguments);
        }
    };
    this.UtilsAPIHub.client = {
        __HUB_NAME : 'UtilsAPIHub',
        
    };
    this.UtilsAPIHub.getClients = function(clientsIds){
        return {
            clientsIds: clientsIds,
            call: function (functionName, functionArgs) {
                var bodyArgs = [this.clientsIds, functionName, functionArgs];
                return constructMessage('UtilsAPIHub', '_client_to_clients_bridge', bodyArgs);
            },
        }
    };
}

try {
  if (module && module.exports) {
    module.exports = HubsAPI;
  }
} catch (e) {
}

/* jshint ignore:end */
/* ignore jslint end */
    