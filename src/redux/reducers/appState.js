import { appStateActionType } from '../actions/appState';
import { unknownAppState } from '../../security/appState';

export default function appState(state = unknownAppState, action) {
    if (action.type === appStateActionType) {
        return action.payload;
    }

    return state;
}
