import React, { Component } from 'react';
import {connect} from 'react-redux';
import {
    StackNavigator,
    SwitchNavigator,
    DrawerNavigator
} from 'react-navigation';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

import LandingScreen from './authorized/HomeScreen';
import ProfileScreen from './authorized/ProfileScreen';
import SignInScreen from './notAuthorized/SignInScreen';
import LoadingScreen from './LoadingScreen';
import {unauthorizedAppState} from '../security/appState';
import {mainColor} from '../design/colors';
import icons from '../design/icons';
import SideMenu from './SideMenu';
import MenuButton from '../components/MenuButton';
import HeaderLeft from '../components/HeaderLeft';
import styles from '../design/styles';
import MessagesScreen from './authorized/MessagesScreen';
import MapScreen from './authorized/Map/MapScreen';

const MainStack = StackNavigator({
    Home: {
        screen: LandingScreen,
        navigationOptions: ({navigation}) => ({
            title: 'Домашняя',
            headerLeft: (
                <HeaderLeft>
                    <MenuButton navigation={navigation} />
                </HeaderLeft>
            ),
            headerTitleStyle: styles.headerStyle,
            headerStyle: styles.fill
        })
    }
});

const MapStack = StackNavigator({
    Map: {
        screen: MapScreen,
        navigationOptions: ({navigation}) => ({
            title: 'Карта',
            headerLeft: (
                <HeaderLeft>
                    <MenuButton navigation={navigation} />
                </HeaderLeft>
            ),
            headerTitleStyle: styles.headerStyle,
            headerStyle: styles.fill
        })
    }
});

const ProfileStack = StackNavigator({
    Profile: {
        screen: ProfileScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Профиль',
            headerLeft: (
                <HeaderLeft>
                    <MenuButton navigation={navigation} />
                </HeaderLeft>
            ),
            headerTitleStyle: styles.headerStyle,
            headerStyle: styles.fill
        })
    }
});

const MessageStack = StackNavigator({
    List: {
        screen: MessagesScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Сообщения',
            headerLeft: (
                <HeaderLeft>
                    <MenuButton navigation={navigation} />
                </HeaderLeft>
            ),
            headerTitleStyle: styles.headerStyle,
            headerStyle: styles.fill
        })
    }
}, {
    initialRouteName: 'List'
});

const AppStack = DrawerNavigator({
    Home: {
        screen: MainStack,
        navigationOptions: {
            title: 'Стартовая',
            drawerIcon: <Icon name="home" color={mainColor} size={icons.size.small} />
        }
    },
    Profile: {
        screen: ProfileStack,
        navigationOptions: {
            title: 'Профиль',
            drawerIcon: <Icon name="person" color={mainColor} size={icons.size.small} />
        }
    },
    Messages: {
        screen: MessageStack,
        navigationOptions: {
            title: 'Сообщения',
            drawerIcon: <Icon name="drafts" color={mainColor} size={icons.size.small} />
        }
    },
    Map: {
        screen: MapStack,
        navigationOptions: {
            title: 'Карта',
            drawerIcon: <Icon name="map" color={mainColor} size={icons.size.small} />
        }
    }
}, {
    initialRouteName: 'Home',
    contentComponent: SideMenu
});

class App extends Component {
    static getDerivedStateFromProps({ appState, navigation }) {
        if (appState === unauthorizedAppState) {
            navigation.navigate('Auth');
        }

        return null;
    }

    render() {
        return <AppStack />;
    }
}

const ConnectedApp = connect(
    state => ({
        appState: state.appState
    })
)(App);

export const AuthStack = StackNavigator({
    Main: {
        screen: SignInScreen
    }
});

export const RootStack = SwitchNavigator(
    {
        AuthLoading: LoadingScreen,
        App: ConnectedApp,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading'
    }
);
