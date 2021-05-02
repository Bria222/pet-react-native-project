import { concat } from 'lodash';
import {batchActions} from 'redux-batched-actions';

import {createRequestThunk} from '../thunks/createRequestThunk';
import {createDataStore} from './createDataStore';
import {messageCountReached} from './canFetchMore';
import Logger from '../../utils/logger';

export const messagesStore = createDataStore('messages');

const LIMIT = 20;

const [
    loadingActionCreator,
    errorActionCreator,
    successActionCreator
] = messagesStore.actionCreators;

const requestMessages = createRequestThunk({
    actionCreators: [
        loadingActionCreator,
        errorActionCreator,
        (messages = [], { offset }, getState) => {
            const actions = [];

            Logger.debug('MESSAGES', messages);

            if (messages.length < LIMIT) {
                actions.push(messageCountReached.actionCreator({ canFetchMore: false }));
            }

            if (offset === 0) {
                actions.push(successActionCreator(messages));
            } else {
                const currentArray = messagesStore.selectors.data(getState()) || [];
                if (messages.length !== 0) {
                    const action = successActionCreator(currentArray.concat(messages));
                    Logger.debug('action', action);
                    actions.push(action);
                } else {
                    actions.push(successActionCreator(currentArray));
                }
            }

            Logger.debug('actions', actions);
            return batchActions(actions);
        }
    ]
} , '/');

const deleteMessage = createRequestThunk({
    actionCreators: [
        null,
        null,
        (response, request, getState) => {
            const messages = messagesStore.selectors.data(getState()) || [];

            return requestMessages({
                offset: 0,
                limit: messages.length,
                empAction: 'UNC_LIST'
            });
        }
    ]
}, '/');

export function fetchMessagesThunk(dispatch, getState) {
    const messages = messagesStore.selectors.data(getState()) || [];

    return dispatch(requestMessages({
        offset: messages.length,
        limit: LIMIT,
        empAction: 'UNC_LIST'
    }));
}

export function createDeleteMessageThunk(id) {
    return function deleteMessageThunk(dispatch) {
        return dispatch(deleteMessage({
            message_id: id,
            empAction: 'UNC_DELETE'
        }));
    };
}
