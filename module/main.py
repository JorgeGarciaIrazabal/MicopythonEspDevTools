import machine
from machine import Pin

import constants

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


def get_all_pins():
    pins = []
    invalid_pins = [0, 1, 2, 3, 4, 9]
    for i in range(20):
        if i in invalid_pins:
            continue
        try:
            pin = Pin(i, Pin.OUT)
            pins.append(i)
            my_pins[i] = pin
        except Exception:
            pass
    return pins


def set_pin(pin, mode):
    my_pins[pin] = machine.Pin(pin, mode)
    return True


def pin_value(pin, value):
    if value is None:
        return my_pins[pin].value()
    return my_pins[pin].value(value)


start = time.ticks_ms()  # get millisecond counter
button = Pin(4, Pin.IN)
button.irq(trigger=Pin.IRQ_RISING | Pin.IRQ_FALLING, handler=resetting)

connect()

# tim = Timer(0)
# tim.init(period=1000, mode=Timer.PERIODIC, callback=lambda t: print('3'))

from hubs_api import HubsAPI

api = HubsAPI('ws://{0}:{1}'.format(constants.SERVER_IP, constants.SERVER_PORT) + '/upython')

api.DevToolsHub.client.echo = lambda msg: msg + ' From Micropython'
api.DevToolsHub.client.get_all_pins = get_all_pins
api.DevToolsHub.client.set_pin = set_pin
api.DevToolsHub.client.pin_value = pin_value

api.ws_client.listen_loop()
