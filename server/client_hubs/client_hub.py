# -*- coding: utf-8 -*-
from wshubsapi.hub import Hub


class UPythonUtilsHub(Hub):
    def is_upython_connected(self, id):
        try:
            self.clients.get_client(id)
            return True
        except KeyError:
            return False

    def get_upython_client_ids(self):
        clients = self.clients.get_clients(lambda client: client.ID.startswith('upython'))
        return list(map(lambda client: client.ID, clients))
