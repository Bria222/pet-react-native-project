import {StyleSheet} from 'react-native';
import { Platform } from 'react-native';

import {inactiveColor} from './colors';

export default StyleSheet.create({
    fill: {
        flex: 1
    },
    raw: {
        flexDirection: 'row'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signIn: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
        paddingRight: 50,
        paddingLeft: 50
    },
    signOutButton: {
        height: 200
    },
    list: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'flex-start'
    },
    listItem: {
        margin: 10,
        paddingLeft: 10,
        borderBottomWidth: 0.5,
        borderColor: inactiveColor,
        height: 50
    },
    headerStyle: {
        flex: 1,
        paddingLeft: 10,
        paddingRight: 10
    },
    bar: {
        marginTop: 28,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    listTitle: {
        backgroundColor: 'transparent',
        color: 'white',
        fontSize: 18,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold'
    },
    dividerView: {
        height: 0.5,
        backgroundColor: inactiveColor
    },
    panel: {
        flex: 1,
        justifyContent: 'flex-start',
        zIndex: 50,
        marginBottom: 10,
        elevation: 2, // SHADOW ONLY FOR ANDROID,
        backgroundColor: Platform.OS === 'ios' ? '#F7F7F7' : '#FFF'
    },
    panelContainer: {
        backgroundColor: inactiveColor,
        padding: 10,
        zIndex: 1
    },
    panelHeader: {
        height: 40,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    panelTitle: {
        flex: 1,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    panelContent: {
        paddingTop: 10,
        paddingBottom: 10
    },
    block: {
        paddingLeft: 10,
        paddingRight: 10
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'stretch'
    }
});
