import {appStateActionType} from '../actions/appState';
import {authorizedAppState} from '../../security/appState';

export default function session(state = null, action) {
    if (action.type === appStateActionType &&
        action.payload === authorizedAppState) {
        return action.meta.session;
    }

    return state;
}
