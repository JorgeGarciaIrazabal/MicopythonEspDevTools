import json
import os

import machine
from machine import Pin


class Component:
    def __init__(self, name, pin, mode):
        self.pin_num = pin
        self.mode = mode
        self.name = name

    def value(self, *args):
        pass

    def get_info_json(self):
        return dict(pin=self.pin_num, mode=self.mode, value=self.value(), name=self.name)


class DigitalComponent(Component):
    def __init__(self, name, pin, mode):
        super().__init__(name, pin, mode)
        self.pin = machine.Pin(pin, mode)

    def value(self, *args):
        return self.pin.value(*args)


class AnalogInComponent(Component):
    def __init__(self, name, pin, mode):
        super().__init__(name, pin, mode)
        self.pin = machine.ADC(pin)

    def value(self):
        return self.pin.read()


class AnalogOutComponent(Component):
    def __init__(self, name, pin, mode):
        super().__init__(name, pin, mode)
        self.pin = machine.Pin(pin)
        self.pwm = machine.PWM(self.pin)
        self.pwm.freq(500)
        self.pwm.duty(0)

    def value(self, duty=None):
        if duty is not None:
            return self.pwm.duty(duty)
        return self.pwm.duty()


def construct_component(name, pin, mode):
    if mode == 0 or mode == 1:  # digital_in, digital_out
        return DigitalComponent(name, pin, mode)
    elif mode == 2:  # analog_in
        return AnalogInComponent(name, pin, mode)
    elif mode == 3:  # analog_out
        return AnalogOutComponent(name, pin, mode)


class Module:
    def __init__(self, id_):
        self.config_path = 'config.json'
        self.id = id_
        self.components = dict()
        self.type = None

    def get_component_by_name(self, name) -> Component:
        return self.components[name]

    def setup(self):
        if self.config_path in os.listdir():
            with open(self.config_path) as f:
                config = json.loads(f.read())
                for component in config:
                    self.components[component['name']] = construct_component(component['name'],
                                                                             component['pin'],
                                                                             component['mode'])
        else:
            invalid_pins = [1, 2, 3, 9]
            for i in range(20):
                if i in invalid_pins:
                    continue
                try:
                    name = "Pin " + str(i)
                    self.components[name] = DigitalComponent(name, i, Pin.OUT)
                except Exception:
                    pass

    def get_module_info(self):
        return [component.get_info_json() for component in self.components.values()]

    def change_component_mode(self, name, mode):
        component = self.components[name]
        self.components[name] = construct_component(name, component.pin_num, mode)

    def change_component_name(self, old_name, new_name):
        if new_name in self.components:
            return False

        component = self.components.pop(old_name)
        component.name = new_name
        self.components[new_name] = component
        return True

    def save_config(self):
        with open(self.config_path, 'w') as f:
            f.write(json.dumps(self.get_module_info()))
