import os
import subprocess

os.chdir(os.pardir)

port = '/dev/ttyUSB0'

files = [
    f for f in [
        'main.py',
        'boot.py',
        'constants.py',
        'ws_client.py',
        'hubs_api.py',
        'ws_protocol.py'
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
