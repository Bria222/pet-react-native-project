import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ScrollView, Text, View, Linking } from 'react-native';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

import styles from '../design/styles';
import {signOutAppState} from '../security/appState';
import icons from '../design/icons';
import { mainColor } from '../design/colors';
import signout from '../redux/thunks/signout';
import Logger from '../utils/logger';

const settingsRoute = 'settings';
const signOutRoute = 'signOut';

const extraMenuItems = [
    { key: settingsRoute, route: settingsRoute },
    { key: signOutRoute, route: signOutRoute }
];

const renderIcon = ({ route: { route } }) => {
    let iconName;
    switch (route) {
    case signOutRoute:
        iconName = 'exit-to-app';
        break;
    case settingsRoute:
        iconName = 'settings';
        break;
    default:
        break;
    }

    return (
        <Icon
            name={iconName}
            size={icons.size.small}
            color={mainColor}
        />
    );
};

const getLabel = ({ route: { route } }) => {
    Logger.debug('route', route);

    switch (route) {
        case signOutRoute:
            return 'Сменить пользователя';
        case settingsRoute:
            return 'Настройки';
        default:
            return '';
    }
};

const labelContainerStyle = {
    top: 0,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
};

const bottomGroupContainerStyle = {
    flex: 1,
    justifyContent: 'flex-end'
};

class SideMenu extends Component {
    static propTypes = {
        signOut: PropTypes.func.isRequired,
        signingOut: PropTypes.bool.isRequired,
        items: PropTypes.arrayOf(PropTypes.shape({
            key: PropTypes.string,
            routeName: PropTypes.string
        })).isRequired
    };

    constructor() {
        super();

        this._handleExtraItemPress = this._handleExtraItemPress.bind(this);
    }

    _handleExtraItemPress({ route: { route } }) {
        Logger.debug('route', route);

        switch (route) {
            case signOutRoute: {
                this.props.signOut();
                break;
            }
            case settingsRoute: {
                Linking
                    .openURL('petapp://settings/')
                    .catch(Logger.error);
                break;
            }
            default:
                break;
        }
    }

    render() {
        const {
            signOut,
            signingOut,
            ...rest
        } = this.props;

        return (
            <SafeAreaView style={styles.fill} forceInset={{ top: 'always', horizontal: 'never' }}>
                <View style={labelContainerStyle}>
                    <Icon name="local-parking" size={icons.size.large} color={mainColor} />
                    <Text>ЕМП</Text>
                </View>
                <ScrollView style={styles.fill}>
                    <DrawerItems {...rest} />
                </ScrollView>
                <ScrollView style={styles.fill} contentContainerStyle={bottomGroupContainerStyle}>
                    <View style={[styles.dividerView, { margin: 10 }]} />
                    <DrawerItems
                        {...rest}
                        items={extraMenuItems}
                        onItemPress={this._handleExtraItemPress}
                        renderIcon={renderIcon}
                        getLabel={getLabel}
                    />
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default connect(state => ({
    signingOut: state.appState === signOutAppState
}), dispatch => ({
    signOut: () => dispatch(signout)
}))(SideMenu);
