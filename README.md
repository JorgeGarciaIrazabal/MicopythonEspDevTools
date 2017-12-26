# Manage ESP Modules
Tools to configure esp modules from web browser

This tool will be useful for making prove of concepts or to configure an ESP8266 module as a dummy client.



### Setup server

```
pip3 install -r requirements.txt
cd server
python3 server.py
```

### Setup module

#### Connection parameters
To let the ESP module know how to connect to your wifi and to your server, you need to set the constants in the `constants.py` file.

You can find a dummy example at `__contacts.py`

#### Reset board
We have to upload the mycropython firmware to the module.

```
cd modules/scripts
python3 reset_board.py
```

Running this command, you will upload a slightly different firmware from the official one as we remove unnecessary code and include the websocket client

#### Upload code

```
cd modules/scripts
python3 upload_files.py
```

### Web Client

```
cd web_client
npm run dev
```

![componentmanagement](https://user-images.githubusercontent.com/1591203/34347914-e86f97ea-e9d4-11e7-835a-ef716332e4dd.gif)
