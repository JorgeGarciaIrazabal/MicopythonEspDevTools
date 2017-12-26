# -*- coding: utf-8 -*-
from wshubsapi.hub import Hub


class ModuleHub(Hub):
    def _define_client_functions(self):
        """
        this dictionary define the public client function that we can call from the server or the client-breach
        It is just to inform, it is not mandatory but recommended
        """
        return dict(
            get_all_components=lambda: None,
            change_component_mode=lambda name, mode: None,
            change_component_name=lambda old_name, new_name: None,
            set_component_value=lambda name, value: None,
            get_component_value=lambda name: None,
            save_config=lambda: None,
            read_serial=lambda: None,
        )
