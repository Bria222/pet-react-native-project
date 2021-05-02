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

export default class BackButton extends Component {
    static propTypes = {
        navigation: PropTypes.shape(navigationPropType).isRequired,
        style: PropTypes.object
    };

    constructor() {
        super();

        this.handlePress = this.handlePress.bind(this);
    }

    handlePress() {
        this.props.navigation.goBack();
    }

    render() {
        const { style } = this.props;

        return (
            <Touchable
                style={[baseStyle]}
                onPress={this.handlePress}
            >
                <Icon
                    name="reply"
                    size={icons.size.medium}
                    color={mainColor}
                />
            </Touchable>
        );
    }
}
