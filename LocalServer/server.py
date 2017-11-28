import json
import logging.config
from concurrent.futures import ThreadPoolExecutor

from tornado import web, ioloop
from wshubsapi.connection_handlers.tornado_handler import ConnectionHandler
from wshubsapi.hubs_inspector import HubsInspector

logging.config.dictConfig(json.load(open('logging.json')))
log = logging.getLogger(__name__)


class MyConnectionHandler(ConnectionHandler):
    executor = ThreadPoolExecutor()

    def open(self, name=None):
        client_id = name
        if client_id in self.comm_environment.all_connected_clients:
            self.comm_environment.all_connected_clients.pop(client_id)
            try:
                self.close()
            except Exception:
                pass
        self.comm_environment.on_opened(self._connected_client, client_id)

        log.debug("open new connection with ID: {} ".format(client_id))

    def on_message(self, message):
        self.executor.submit(super().on_message, message)


if __name__ == '__main__':
    app = web.Application([
        (r'/(.*)', MyConnectionHandler),
    ])
    HubsInspector.include_hubs_in("**/*_hub.py")  # use glob path patterns
    HubsInspector.inspect_implemented_hubs()
    HubsInspector.construct_js_file("webclient/src/services/hubsApi.js")
    log.debug("starting...")
    app.listen(8888)

    ioloop.IOLoop.instance().start()
