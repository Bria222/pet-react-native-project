import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {Text} from 'react-native';
import Touchable from 'react-native-platform-touchable';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

import Panel from '../../components/Panel';
import icons from '../../design/icons';
import {mainColor} from '../../design/colors';

export default class Message extends PureComponent {
    static propTypes = {
        id: PropTypes.number.isRequired,
        title: PropTypes.string.isRequired,
        text: PropTypes.string,
        selected: PropTypes.bool,
        read: PropTypes.bool,

        separators: PropTypes.object.isRequired,
        onDelete: PropTypes.func.isRequired,
        onPressItem: PropTypes.func.isRequired
    };

    constructor() {
        super();

        this._handleHeaderPress = this._handleHeaderPress.bind(this);
        this._handleDeletePress = this._handleDeletePress.bind(this);
        this._withTouch = this._withTouch.bind(this);
    }

    _handleHeaderPress() {
        const {
            onPressItem,
            id
        } = this.props;

        onPressItem(id);
    }

    _handleDeletePress() {
        const {
            onDelete,
            id
        } = this.props;

        onDelete(id);
    }

    _withTouch(header) {
        const { separators } = this.props;

        return (
            <Touchable
                onPress={this._handleHeaderPress}
                onShowUnderlay={separators.highlight}
                onHideUnderlay={separators.unhighlight}
            >
                {header}
            </Touchable>
        );
    }

    renderDeleteTouchable() {
        return (
            <Touchable onPress={this._handleDeletePress}>
                <Icon
                    name="close"
                    size={icons.size.small}
                    color={mainColor}
                />
            </Touchable>
        );
    }

    render() {
        const {
            title,
            text,
            selected
        } = this.props;

        return (
            <Panel
                title={title}
                headerTouch={this._withTouch}
                mode="spoiler"
                visible={selected}
                suffix={this.props.selected ? this.renderDeleteTouchable() : null}
                onStateChange={this._handleHeaderPress}
            >
                <Text>{text}</Text>
            </Panel>
        );
    }
}
