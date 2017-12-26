import os
import subprocess
import sys

current_dir = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.abspath(os.path.join(current_dir, os.pardir)))

import constants

os.chdir(current_dir)

port = constants.SERIAL_PORT
baudrate = constants.SERIAL_BAUDRARE

firmware = os.path.join(os.pardir, "firmware", "firmware-combined.bin")

if not os.path.exists(firmware):
    raise Exception("Firmware not found")

esptool = 'esptool.py'

subprocess.call([esptool, "--port", port, "erase_flash"])
# normal
# subprocess.call([python, esptool,  "--port", port, "--baud", baudrate, "write_flash", "--flash_size=8m", "0", firmware])
# mcu
subprocess.call(
    [esptool, "--port", port, "--baud", baudrate, "write_flash", "--flash_size=detect", "-fm", "dio", "0", firmware])
