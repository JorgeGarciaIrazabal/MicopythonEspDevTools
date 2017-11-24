from wshubsapi.hubs_inspector import HubsInspector

if __name__ == '__main__':
    HubsInspector.include_hubs_in("*_hub.py")  # use glob path patterns
    HubsInspector.inspect_implemented_hubs()
    HubsInspector.construct_python_file("module_api/hubs_api.py")
