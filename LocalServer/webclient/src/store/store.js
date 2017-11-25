import {observable} from 'mobx';
import Module from '../store/Module';

class AppStore {
    /** @type String*/
    @observable label = 'testing';
    /** @type boolean */
    @observable connected = false;

    /** @type Array<Module> */
    @observable modules = [];
}


const store = new AppStore();
export {AppStore};
export default store;
