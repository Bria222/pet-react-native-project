import RNSecureKeyStore from 'react-native-secure-key-store';
import Logger from '../utils/logger';

const loginKey = 'login';
const passwordKey = 'password';

export async function getCredentials() {
    const [login, password] = await Promise.all([
        RNSecureKeyStore.get(loginKey),
        RNSecureKeyStore.get(passwordKey)
    ]);

    Logger.debug('get login', login);
    Logger.debug('get password', password);

    return { login, password };
}

export async function setCredentials(login, password) {
    await Promise.all([
        RNSecureKeyStore.set(loginKey, login || ''),
        RNSecureKeyStore.set(passwordKey, password || '')
    ]);

    Logger.debug('set login', login);
    Logger.debug('set password', password);
}

export async function removeCredentials() {
    await Promise.all([
        RNSecureKeyStore.remove(loginKey),
        RNSecureKeyStore.remove(passwordKey)
    ]);
}
