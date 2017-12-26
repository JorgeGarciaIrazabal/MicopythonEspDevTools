import os
import subprocess

import sys

current_dir = os.path.dirname(os.path.realpath(__file__))
par_dir = os.path.abspath(os.path.join(current_dir, os.pardir))
sys.path.append(par_dir)

import constants

os.chdir(par_dir)

port = constants.SERIAL_PORT

files = [
    f for f in [
        'main.py',
        'constants.py',
        'module.py',
        'hubs_api.py',
    ]
]

files = list(filter(lambda x: "__" not in x, files))

for f in files:
    if not os.path.exists(f):
        raise Exception("File " + f + " does not exists")

print('Uplaoding...')
for f in files:
    subprocess.call(['ampy', '--port', port, 'put', f])
    print("Uploaded: " + f)

print('FINISHED!!')
