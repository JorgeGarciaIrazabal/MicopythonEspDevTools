# -*- coding: utf-8 -*-
from wshubsapi.hub import Hub


class DevToolsHub(Hub):
    def send_to_all(self, name, _sender, message="hello"):  # _sender is an automatically passed argument
        other_clients = self.clients.get_other_clients(_sender)
        if len(other_clients) > 0:
            other_clients.print_message(name, message)
        return len(other_clients)

    def _define_client_functions(self):
        """
        This function will tell the client possible client functions to be called from sever
        It is just to inform, it is not mandatory but recommended
        """
        return dict(
            echo=lambda msg: None,
            get_all_pins=lambda: None,
            set_pin=lambda pin, mode: None,
            set_pin_value=lambda pin, value: None,
        )
