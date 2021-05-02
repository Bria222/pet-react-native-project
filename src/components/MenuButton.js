import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

import {navigationPropType} from '../types/navigation';
import icons from '../design/icons';
import {mainColor} from '../design/colors';

const baseStyle = {
    backgroundColor: 'transparent',
    width: icons.size.medium
};

export default class MenuButton extends Component {
    static propTypes = {
        navigation: PropTypes.shape(navigationPropType).isRequired,
        style: PropTypes.object
    };

    constructor() {
        super();

        this.handlePress = this.handlePress.bind(this);
    }

    handlePress() {
        this.props.navigation.navigate('DrawerOpen');
    }

    render() {
        const { style } = this.props;

        return (
            <Touchable
                style={[baseStyle, style]}
                onPress={this.handlePress}
            >
                <Icon
                    name="list"
                    size={icons.size.medium}
                    color={mainColor}
                />
            </Touchable>
        );
    }
}
