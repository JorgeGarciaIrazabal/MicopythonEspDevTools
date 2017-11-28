import machine
import network
from machine import Pin

import constants
from hubs_api import HubsAPI
from module import Module
import gc

try:
    import time_ as time
except:
    import time

press_time = 0
sta_if = None


def resetting(pin):
    global press_time
    if pin.value() == 1:
        diff = time.ticks_ms() - press_time
        if diff > 1000:
            machine.reset()
    else:
        press_time = time.ticks_ms()
        print('getting time', press_time)


def connect():
    global sta_if
    if sta_if is not None and sta_if.isconnected():
        return True
    start = time.ticks_ms()
    sta_if = network.WLAN(network.STA_IF)
    sta_if.active(True)
    sta_if.connect(constants.ESSID, constants.PASSWORD)
    print("waiting wifi connection...")
    while not sta_if.isconnected():
        if time.ticks_ms() - start > 10000:
            raise Exception("unable to connect to wifi")

    if sta_if.isconnected():
        print("connected to wifi")
        return True
    else:
        print("unable to connect!!!!!")
        return False


u_module = Module('upython')
u_module.setup()


def get_all_components():
    return u_module.get_module_info()


def change_component_mode(name, mode):
    u_module.change_component_mode(name, mode)
    return True


def change_component_name(old_name, new_name):
    return u_module.change_component_name(old_name, new_name)


def set_component_value(name, value):
    u_module.get_component_by_name(name).value(value)
    return True


def save_config():
    u_module.save_config()
    return True


button = Pin(4, Pin.IN)
button.irq(trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING, handler=resetting)

while True:
    # todo, no need to connect all the time
    if connect():
        try:
            api = HubsAPI('ws://{0}:{1}'.format(constants.SERVER_IP, constants.SERVER_PORT) + '/upython')
            print("connected to server")
            api.ModuleHub.client.get_all_components = get_all_components
            api.ModuleHub.client.change_component_mode = change_component_mode
            api.ModuleHub.client.change_component_name = change_component_name
            api.ModuleHub.client.set_component_value = set_component_value
            api.ModuleHub.client.save_config = save_config

            api.ws_client.listen_loop()
            del api
        except:
            print('unable to connect to server')

    print("disconnected, trying again in 5 seconds")
    time.sleep(5)
    gc.collect()

