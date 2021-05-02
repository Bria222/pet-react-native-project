import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { times } from 'lodash';
import {connect} from 'react-redux';

import {checkSessionThunk} from '../redux/thunks/session';
import {navigationPropType} from '../types/navigation';
import {authorizedAppState, unauthorizedAppState} from '../security/appState';
import Logger from '../utils/logger';
import Loading from '../components/Loading';
import settings from '../settings/index';

export class LoadingScreen extends Component {
    static propTypes = {
        checkAppState: PropTypes.func.isRequired,
        appState: PropTypes.string.isRequired,
        navigation: PropTypes.shape(navigationPropType).isRequired
    };

    static getDerivedStateFromProps({ navigation, appState }) {
        if (appState === authorizedAppState) {
            navigation.navigate('App');
        } else if (appState === unauthorizedAppState) {
            navigation.navigate('Auth');
        }

        return null;
    }

    constructor({ checkAppState }) {
        super();
        Logger.info('checking session');

        settings
            .then(checkAppState);
    }

    render() {
        return <Loading />;
    }
}

export default connect(
    state => ({
        appState: state.appState
    }),
    dispatch => ({
        checkAppState: () => dispatch(checkSessionThunk)
    })
)(LoadingScreen);
