import {handle} from '../../utils/async';
import {removeCredentials} from '../../security/user';
import {signingOutAction, signOutAction} from '../actions/appState';

export default async function signOutThunk(dispatch) {
    dispatch(signingOutAction);
    const [error] = await handle(removeCredentials());
    dispatch(signOutAction);
    if (error) {
        throw error;
    }

    return true;
}
