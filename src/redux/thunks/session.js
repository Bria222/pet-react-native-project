import {
    getCredentials
} from '../../security/user';
import {handle} from '../../utils/async';
import {
    signOutAction
} from '../actions/appState';
import {signInThunkCreator} from './signin';
import Logger from '../../utils/logger';

export async function checkSessionThunk(dispatch) {
    Logger.debug('gettingCredentials');
    const [error, credentials] = await handle(getCredentials());

    Logger.debug(error);
    Logger.debug(credentials);

    if (!error &&
        credentials &&
        credentials.login &&
        credentials.password) {
        const { login, password } = credentials;
        Logger.info('trying sign in');
        dispatch(signInThunkCreator(login, password));
    } else {
        Logger.info('sign out');
        dispatch(signOutAction);
    }
}
