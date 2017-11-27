import React from 'react';
import {observer} from "mobx-react";
import PropTypes from 'prop-types';
import HomeAppBar from './HomeAppBar';
import {AppStore} from '../../store/store';
import ModuleManager from "./ModuleManager";
import Module from "../../store/Module";

@observer
class HomeApp extends React.Component {
    /** @type AppStore */
    store;

    static propTypes = {
        store: PropTypes.instanceOf(AppStore)
    };


    constructor(props) {
        super();
        this.store = props.store;
        if(this.store.modules.length < 1) {
            this.store.modules.push(new Module('upython'));
        }
    }

    render() {
        return (
            <div>
                <HomeAppBar connected={this.props.store.connected}/>
                <ModuleManager
                    module={this.store.modules[0]}
                />
            </div>
        );
    }
}

export default HomeApp;