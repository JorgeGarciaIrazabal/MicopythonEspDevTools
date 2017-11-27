import {observable} from 'mobx';

const PIN_MODE_DIGITAL_IN = 0;
const PIN_MODE_DIGITAL_OUT = 1;
const PIN_MODE_ANALOG_IN = 2;
const PIN_MODE_ANALOG_OUT = 3;


class Component {
    constructor(name, pin, mode = 0, value = 0) {
        this.name = name;
        this.provisionalName = name;
        this.pin = pin;
        this.mode = mode;
        this.value = value;
    }
    /** @type string */
    @observable name;
    /** @type string */
    @observable provisionalName;
    /** @type Number */
    @observable pin;
    /** @type Number */
    @observable mode = 0;
    /** @type Number */
    @observable value = 0;
}

class Module {
    constructor(name) {
        this.name = name;
    }
    /** @type String*/
    @observable name;
    /** @type boolean */
    @observable connected = false;
    /** @type Array<Component> */
    @observable components = [];
}

export default Module;

export {PIN_MODE_DIGITAL_IN};
export {PIN_MODE_DIGITAL_OUT};
export {PIN_MODE_ANALOG_IN};
export {PIN_MODE_ANALOG_OUT};
export {Component};