import HubsApi from './hubsApi';

class Api {
    /** @type HubsApi*/
    api;
    _isConnected = false;

    constructor() {
        this.api = new HubsApi();

        this.api.connect('ws://127.0.0.1:8888/', 3000).then(function () {
        }, function (error) {
            console.error(error);
        });

        this.api.onOpen = () => {
            this.api.UtilsAPIHub.server.setId('webClient');
            this._isConnected = true;
        };

        this.api.onClose = () => {
            this._isConnected = false;
        };

        this.api.isConnected = this.isConnected;
    }

    get isConnected() {
        return this._isConnected;
    }
}

/** @type HubsApi*/
const api = (new Api()).api;
/** @type HubsApi*/
export default api;