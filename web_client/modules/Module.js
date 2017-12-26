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
    name;
    /** @type string */
    provisionalName;
    /** @type Number */
    pin;
    /** @type Number */
    mode = 0;
    /** @type Number */
    value = 0;

    isInput() {
        return [
            PIN_MODE_DIGITAL_IN,
            PIN_MODE_ANALOG_IN,
        ].indexOf(this.mode) !== -1;
    }

    isOutput() {
        return [
            PIN_MODE_DIGITAL_OUT,
            PIN_MODE_ANALOG_OUT,
        ].indexOf(this.mode) !== -1;
    }
}

class Module {
    constructor(name) {
        this.name = name;
    }

    /** @type String*/
    name;
    /** @type boolean */
    connected = false;
    /** @type Array<Component> */
    components = [];
}

export default Module;

export {PIN_MODE_DIGITAL_IN};
export {PIN_MODE_DIGITAL_OUT};
export {PIN_MODE_ANALOG_IN};
export {PIN_MODE_ANALOG_OUT};
export {Component};