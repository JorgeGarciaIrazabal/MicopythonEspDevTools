import React from 'react';
import {observer} from "mobx-react";
import PropTypes from 'prop-types';
import Module, {Component, PIN_MODE_ANALOG_OUT, PIN_MODE_DIGITAL_OUT} from "../../store/Module";
import {Divider, DropDownMenu, FlatButton, MenuItem, Slider, TextField, Toggle} from "material-ui";
import Api from '../../services/Api';
import debounce from 'debounce';
import {ContentSave, NavigationRefresh} from "material-ui/svg-icons/index";

@observer
class ModuleManager extends React.Component {
    /** @type Module */
    module;
    moduleApi;

    static propTypes = {
        module: PropTypes.instanceOf(Module)
    };

    constructor(props) {
        super();
        this.module = props.module;
        this.moduleApi = Api.DevToolsHub.getClients([this.module.name]);
        this.handleValueChange = debounce(this.handleValueChange, 300)
    }

    async componentDidMount() {
        return await this.refreshComponents();
    }

    async handleModeChange(component: Component, mode) {
        await this.moduleApi.changeComponentMode(component.name, mode);
        component.mode = mode;
    }

    async handleValueChange(component: Component, value) {
        if (component.mode === PIN_MODE_DIGITAL_OUT || component.mode === PIN_MODE_ANALOG_OUT) {
            await this.moduleApi.setComponentValue(component.name, value);
            component.value = value;
        }
    }

    async handleNameChange(component: Component) {
        await this.moduleApi.changeComponentName(component.name, component.provisionalName);
        component.name = component.provisionalName;
    }

    async refreshComponents() {
        this.module.components = [];
        const isConnected = await Api.UPythonUtilsHub.server.isUpythonConnected();
        console.log('Is Module connected', isConnected);
        this.module.connected = isConnected;
        if (isConnected) {
            const components = await this.moduleApi.getAllComponents();
            const uPythonComponents = components[this.module.name];
            uPythonComponents.map((component) => {
                this.module.components.push(new Component(component.name, component.pin, component.mode, component.value))
            });
            console.log(uPythonComponents);
        }
    }

    async saveConfig() {
        await this.moduleApi.saveConfig();
    }


    render() {
        return (
            <div className='ModuleManager'>
                <FlatButton
                    label="Refresh components"
                    labelPosition="before"
                    primary={true}
                    onClick={() => this.refreshComponents()}
                    icon={<NavigationRefresh />}
                />
                <FlatButton
                    label="Save config"
                    labelPosition="before"
                    primary={true}
                    onClick={() => this.saveConfig()}
                    icon={<ContentSave />}
                />
                {
                    this.module.components.map((component) => (
                        <div key={component.pin}>
                            <Divider/>
                            <div className={"ComponentContainer"}>
                                <div className={'ComponentLabel'}>
                                    {`PIN ${component.pin}`}
                                </div>
                                <TextField
                                    id={`pin${component.pin}`}
                                    value={component.provisionalName}
                                    onBlur={(event, name) => this.handleNameChange(component, name)}
                                    onChange={(event, value) => component.provisionalName = value}
                                    className={'ComponentName'}
                                />
                                <DropDownMenu
                                    value={component.mode}
                                    onChange={(event, index, mode) => this.handleModeChange(component, mode)}
                                    className={'ComponentMode'}
                                >
                                    <MenuItem value={0} primaryText="Digital IN"/>
                                    <MenuItem value={1} primaryText="Digital OUT"/>
                                    <MenuItem value={2} primaryText="Analog IN"/>
                                    <MenuItem value={3} primaryText="Analog OUT"/>
                                </DropDownMenu>
                                {component.mode <= 1 && (<Toggle
                                    toggled={!!component.value}
                                    label={''}
                                    onToggle={(event, value) => this.handleValueChange(component, value)}
                                    className={'ComponentDigitalValue'}
                                    style={{
                                        width: "initial",
                                    }}
                                />)}
                                {component.mode > 1 && (<Slider
                                    min={0}
                                    max={1024}
                                    step={1}
                                    value={component.value}
                                    onChange={(event, value) => this.handleValueChange(component, value)}
                                    className={'ComponentAnalogValue'}
                                    sliderStyle={{
                                        marginTop: 0,
                                        marginBottom: 0,
                                    }}
                                />)}
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    }
}

export default ModuleManager;