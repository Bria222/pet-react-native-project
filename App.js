import React from 'react';

import { RootStack } from './src/containers/navigation';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import { listenSettings, unlistenSettings } from './src/settings/index';

console.disableYellowBox = true;

export default class App extends React.Component {
    constructor() {
        super();

        listenSettings();
    }

    componentWillUnmount() {
        unlistenSettings();
    }

    render() {
        return (
            <Provider store={store}>
                <RootStack />
            </Provider>
        );
    }
}
