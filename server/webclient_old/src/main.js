import React from 'react';
import ReactDOM from 'react-dom';
import store, {AppStore} from './store/store';
import {observer} from "mobx-react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import HomeApp from './components/HomeApp/HomeApp';
import PropTypes from 'prop-types';
import Api from './services/Api';

@observer
class App extends React.Component {
    static propTypes = {
        store: PropTypes.instanceOf(AppStore)
    };

    render() {
        // Displays "hello" text on top of a loaded 360 panorama image.
        // Text is 0.8 meters in size and is centered three meters in front of you.
        return (
            <div>
                <MuiThemeProvider>
                    <HomeApp store={store}>
                    </HomeApp>
                </MuiThemeProvider>
            </div>
        );
    }
}

ReactDOM.render(<App store={store}/>, document.getElementById('root'));