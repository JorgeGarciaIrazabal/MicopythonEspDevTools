import json

_message_id = 0


class GenericClient(object):
    def __setattr__(self, key, value):
        return super(GenericClient, self).__setattr__(key, value)


class GenericServer(object):
    def __init__(self, hub):
        self.hub = hub

    @classmethod
    def _get_next_message_id(cls):
        global _message_id
        _message_id += 1
        return _message_id

    def _serialize_object(self, obj2ser):
        return json.dumps(obj2ser)

    def construct_message(self, args, function_name):
        id_ = self._get_next_message_id()
        body = {"hub": self.hub.name, "function": function_name, "args": args, "ID": id_}
        self.hub.ws_client.send(self._serialize_object(body))
        self.hub.ws_client.recv()


class GenericBridge(GenericServer):
    def __getattr__(self, function_name):
        def function_wrapper(*args_array):
            args = list()
            args.append(self.clients_ids)
            args.append(function_name)
            args.append(args_array)
            id_ = self._get_next_message_id()
            body = {"hub": self.hub.name, "function": "_client_to_clients_bridge", "args": args, "ID": id_}
            self.hub.ws_client.send(self._serialize_object(body))
            self.hub.ws_client.recv()

        return function_wrapper


def construct_api_client_class(client_class):
    if client_class is None:
        import ws_client
        client_class = ws_client

    class WSHubsAPIClient:
        def __init__(self, api, url):
            """
            :type api: HubsAPI
            """
            self.is_opened = False
            self.api = api
            self.client = client_class.connect(url)
            self.is_opened = True

        def received_message(self, m):
            print("MESSAGE RECEIVED: ", m)
            try:
                msg_obj = json.loads(m)
            except Exception as e:
                self.on_error(e)
                return
            if "reply" in msg_obj:
                return msg_obj["reply"]
            else:
                try:
                    client_function = getattr(getattr(self.api, (msg_obj["hub"])).client, msg_obj["function"])
                    reply_message = dict(ID=msg_obj["ID"])
                    try:
                        reply = client_function(*msg_obj["args"])
                        reply_message["reply"] = reply
                        reply_message["success"] = True
                    except Exception as e:
                        reply_message["reply"] = str(e)
                        reply_message["success"] = False
                    finally:
                        self.api.ws_client.send(self.api.serialize_object(reply_message))
                except Exception as e:
                    print('Error receiving message' + e)

        def on_error(self, exception):
            print("On error: " + exception)

        def send(self, m):
            self.client.send(m)

        def recv(self):
            try:
                message = self.client.recv()
                self.received_message(message)
            except Exception as e:
                print(e)

        def listen_loop(self):
            while self.is_opened:
                self.recv()

    return WSHubsAPIClient


class HubsAPI(object):
    def __init__(self, url, client_class=None):
        api_client_class = construct_api_client_class(client_class)
        self.ws_client = api_client_class(self, url)
        self.DevToolsHub = self.DevToolsHubClass(self.ws_client)

    def serialize_object(self, obj2ser):
        return json.dumps(obj2ser)

    class DevToolsHubClass(object):
        def __init__(self, ws_client):
            self.name = "DebToolsHub"
            self.ws_client = ws_client
            self.client = self.ClientClass()

        class ClientClass(GenericClient):
            def __init__(self):
                pass

            def echo(self, msg):
                pass

            def get_all_pins(self, ):
                pass

            def set_pin(self, pin, mode):
                pass

            def set_pin_value(self, pin, value):
                pass