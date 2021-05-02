import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {connect} from 'react-redux';

import styles from '../../design/styles';
import {requestProfile} from '../../redux/stores/profileStore';
import {mainColor} from '../../design/colors';

class HomeScreen extends Component {
    static propTypes = {
        getProfile: PropTypes.func.isRequired
    };

    constructor({ getProfile }) {
        super();
        getProfile();
    }

    render() {
        return (
            <View style={styles.container}>
                <Icon name="accessibility" size={30} color={mainColor} />
                <Text>THIS IS LANDING!!!!</Text>
            </View>
        );
    }
}

export default connect(null, dispatch => ({
    getProfile: () => dispatch(requestProfile())
}))(HomeScreen);
