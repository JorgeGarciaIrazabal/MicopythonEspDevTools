# -*- coding: utf-8 -*-
from wshubsapi.hub import Hub
from wshubsapi.hubs_inspector import HubsInspector


class ClientHug(Hub):
    def get_all_pins(self, _sender):
        dev_tool_hub = HubsInspector.get_hub_instance('DevToolsHub')
        other_client = dev_tool_hub.clients.get_client('upython')
        pins = other_client.get_all_pins().result()
        return pins

    def get_value(self, _sender, pin):
        dev_tool_hub = HubsInspector.get_hub_instance('DevToolsHub')
        other_client = dev_tool_hub.clients.get_client('upython')
        return other_client.pin_value(pin, None).result()

    def set_value(self, _sender, pin, value):
        dev_tool_hub = HubsInspector.get_hub_instance('DevToolsHub')
        other_client = dev_tool_hub.clients.get_client('upython')
        return other_client.pin_value(pin, value).result()

    def set_pin(self, pin, mode):
        dev_tool_hub = HubsInspector.get_hub_instance('DevToolsHub')
        other_client = dev_tool_hub.clients.get_client('upython')
        return other_client.set_pin(pin, mode).result()
