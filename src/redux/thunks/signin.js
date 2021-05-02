import {createRequestThunk} from './createRequestThunk';
import {setCredentials} from '../../security/user';

const thunk = createRequestThunk({}, '/');

export const signInThunkCreator = (login, password) => thunk({
    auth: {
        login,
        password
    },
    empAction: 'login'
});

export const signInThunkCreatorWithResetingCredentials = (login, password) =>
    async function signInByCredentialsThunk(dispatch, getState) {
        await dispatch(signInThunkCreator(login, password));

        const session = getState().session;

        if (session) {
            await setCredentials(login, password);
        }
    };
