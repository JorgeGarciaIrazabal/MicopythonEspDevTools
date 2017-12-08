# -*- coding: utf-8 -*-
from wshubsapi.hub import Hub


class ModuleHub(Hub):
    def _define_client_functions(self):
        """
        This function will tell the client possible client functions to be called from sever
        It is just to inform, it is not mandatory but recommended
        """
        return dict(
            get_all_components=lambda: None,
            change_component_mode=lambda name, mode: None,
            change_component_name=lambda old_name, new_name: None,
            set_component_value=lambda name, value: None,
            save_config=lambda: None,
            read_serial=lambda: None,
        )
