import {
    createStore,
    combineReducers,
    applyMiddleware
} from 'redux';
import { enableBatching } from 'redux-batched-actions';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'remote-redux-devtools';

import { reducer as filterReducer } from './stores/filtersStore';
import appState from './reducers/appState';
import session from './reducers/session';
import profileStore from './stores/profileStore';
import {messagesStore} from './stores/messagesStore';
import mapDataStore from './stores/mapDataStore';

let middleware;

if (process.env.NODE_ENV === 'development') {
    middleware = composeWithDevTools({
        realtime: true,
        port: 8000
    })(applyMiddleware(thunk));
} else {
    middleware = applyMiddleware(thunk);
}

export default createStore(enableBatching(combineReducers({
    form: formReducer,
    appState,
    session,
    mapData: mapDataStore.reducer,
    profile: profileStore.reducer,
    messages: messagesStore.reducer,
    filters: filterReducer
})), middleware); //ENABLE DEV TOOLS
