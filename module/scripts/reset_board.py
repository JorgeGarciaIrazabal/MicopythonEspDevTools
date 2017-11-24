import os
import subprocess

port = '/dev/ttyUSB0'
baudrate = '115200'
firmware = os.path.join(os.pardir, "firmware", "esp8266-20171101-v1.9.3.bin")

if not os.path.exists(firmware):
    raise Exception("Firmware not found")

esptool = 'esptool.py'

subprocess.call([esptool, "--port", port, "erase_flash"])
# normal
# subprocess.call([python, esptool,  "--port", port, "--baud", baudrate, "write_flash", "--flash_size=8m", "0", firmware])
# mcu
subprocess.call(
    [esptool, "--port", port, "--baud", baudrate, "write_flash", "--flash_size=detect", "-fm", "dio", "0", firmware])
