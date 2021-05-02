import AppSettings from 'react-native-android-native-app-settings';
import { DeviceEventEmitter } from 'react-native';
import {handle} from '../utils/async';
import Logger from '../utils/logger';

const SENDER_ID = 'sender_id';
const BACKEND_ENDPOINT = 'backend_url';
const EMP_TOKEN = 'service_token';

async function getSettings() {
    const [error, values] = await handle(Promise.all([
        AppSettings.getString(SENDER_ID),
        AppSettings.getString(BACKEND_ENDPOINT),
        AppSettings.getString(EMP_TOKEN)
    ]));

    if (error) {
        Logger.error(error);
        throw error;
    }

    const [
        gsmSenderId,
        backendEndpoint,
        empToken
    ] = values;

    Logger.debug('SENDER_ID', gsmSenderId);
    Logger.debug('BACKEND_URL', backendEndpoint);
    Logger.debug('SERVICE_TOKEN', empToken);

    return {
        gsmSenderId,
        backendEndpoint,
        empToken
    };
}

export default getSettings();

const backEndEndpointSubscribers = [];
const empTokenSubscribers = [];

export function subscribeEndPoint(callback) {
    backEndEndpointSubscribers.push(callback);
}

export function subscribeEmpToken(callback) {
    empTokenSubscribers.push(callback);
}

function listener({ key }) {
    Logger.debug('LISTENER', `key changed: ${key}`);
    switch (key) {
    case BACKEND_ENDPOINT:
        AppSettings
            .getString(BACKEND_ENDPOINT)
            .then(url => backEndEndpointSubscribers.forEach(callback => callback(url)));
        break;
    case EMP_TOKEN:
        AppSettings
            .getString(EMP_TOKEN)
            .then(url => backEndEndpointSubscribers.forEach(callback => callback(url)));
    default:
        break;
    }
}

export function listenSettings() {
    AppSettings.listenChanges();
    DeviceEventEmitter.addListener('preferencesChanged', listener);
}

export function unlistenSettings() {
    AppSettings.unlistenChanges();
    DeviceEventEmitter.removeListener('preferencesChanged', listener);
}
