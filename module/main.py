import machine
from machine import Pin

import constants
from module import Module

try:
    import time_ as time
except:
    import time

press_time = 0

my_pins = {}


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
    import network
    start = time.ticks_ms()  # get millisecond counter
    sta_if = network.WLAN(network.STA_IF)
    sta_if.active(True)
    sta_if.connect(constants.ESSID, constants.PASSWORD)
    sta_if.isconnected()
    print("waiting wifi connection...")
    while not sta_if.isconnected():
        if time.ticks_ms() - start > 10000:
            raise Exception("unable to connect to wifi")

    if sta_if.isconnected():
        print("connected to wifi")
    else:
        print("unable to connected!!!!!")


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


start = time.ticks_ms()  # get millisecond counter
button = Pin(4, Pin.IN)
button.irq(trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING, handler=resetting)

connect()

# tim = Timer(0)
# tim.init(period=1000, mode=Timer.PERIODIC, callback=lambda t: print('3'))

from hubs_api import HubsAPI

api = HubsAPI('ws://{0}:{1}'.format(constants.SERVER_IP, constants.SERVER_PORT) + '/upython')

api.DevToolsHub.client.get_all_components = get_all_components
api.DevToolsHub.client.change_component_mode = change_component_mode
api.DevToolsHub.client.change_component_name = change_component_name
api.DevToolsHub.client.set_component_value = set_component_value
api.DevToolsHub.client.save_config = save_config


api.ws_client.listen_loop()
