import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toggle from 'material-ui/Toggle';

import VerticalCentered from '../../stylers/VerticalCentered';

const HomeAppBar = (props) => {
    const toggle = (
        <VerticalCentered>
            <Toggle
                className={'connectedToggle'}
                toggled={props.connected}
                disabled={true}
                label={props.connected ? 'Connected' : 'Disconnected'}
            />
        </VerticalCentered>
    );

    return (<AppBar
        title="UPython"
        iconElementRight={toggle}
        showMenuIconButton={false}
    />)
};

export default HomeAppBar;