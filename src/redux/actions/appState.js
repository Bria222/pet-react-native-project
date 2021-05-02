import {
    authorizedAppState,
    unauthorizedAppState,
    signOutAppState
} from '../../security/appState';

export const appStateActionType = 'APP_STATE';

export const signInActionCreator = session => ({
    type: appStateActionType,
    payload: authorizedAppState,
    meta: {
        session
    }
});

export const signOutAction = {
    type: appStateActionType,
    payload: unauthorizedAppState
};

export const signingOutAction = {
    type: appStateActionType,
    payload: signOutAppState
};
