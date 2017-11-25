# -*- coding: utf-8 -*-
from wshubsapi.hub import Hub


class UPythonUtilsHub(Hub):
    def is_upython_connected(self):
        try:
            self.clients.get_client('upython')
            return True
        except KeyError:
            return False
