import HubsApi from './hubsApi';
import store from '../store/store';

class Api {
    api;

    constructor() {
        this.api = new HubsApi();
        this.api.connect('ws://127.0.0.1:8888/', 1000).then(function () {
            store.connected = true;
        }, function (error) {
            console.error(error);
        });
        this.api.onOpen = () => {
            store.connected = true;
            this.api.UtilsAPIHub.server.setId('webClient');
        };

        this.api.onClose = () => {
            store.connected = false;
        };
    }
}

export default (new Api()).api;