import gc

import machine
import network
from machine import Pin, UART

import constants
from hubs_api import HubsAPI
from module import Module

try:
    import time_ as time
except:
    import time

press_time = 0
sta_if = None
uart = UART(0, 9600)


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


def read_serial():
    return uart.read()


def set_component_value(name, value):
    u_module.get_component_by_name(name).value(value)
    return True


def save_config():
    u_module.save_config()
    return True


while True:
    # todo, no need to connect all the time
    if connect():
        try:
            api = HubsAPI('ws://{0}:{1}'.format(constants.SERVER_IP, constants.SERVER_PORT) + '/upython')
            print("connected to server")
            api.ModuleHub.client.get_all_components = u_module.get_module_info
            api.ModuleHub.client.change_component_mode = u_module.change_component_mode
            api.ModuleHub.client.change_component_name = u_module.change_component_name
            api.ModuleHub.client.set_component_value = set_component_value
            api.ModuleHub.client.save_config = u_module.save_config
            api.ModuleHub.client.read_serial = read_serial

            api.ws_client.listen_loop()
            del api
        except:
            print('unable to connect to server')

    print("disconnected, trying again in 5 seconds")
    time.sleep(5)
    gc.collect()

