import { get } from 'lodash';

const getRequestProcessingAction = path => `@@REQUEST_IN_PROGRESS/${path}`;
const getResponseAction = path => `@@RESPONSE/${path}`;
const getRequestErrorAction = path => `@@REQUEST_ERROR/${path}`;
const clearAction = path => `@@CLEAR/${path}`;

const initialState = {
    isFetched: false,
    loading: false,
    error: null,
    data: null
};

export function createDataStore(path, single = false) {
    const requestErrorAction = getRequestErrorAction(path);
    const requestProcessingAction = getRequestProcessingAction(path);
    const responseAction = getResponseAction(path);
    const clearStoreAction = clearAction(path);

    const reducer = (state = initialState, action) => {
        switch (action.type) {
        case requestProcessingAction:
            return { ...state, loading: true, error: null };
        case responseAction:
            if (action.payload !== undefined) {
                return {
                    loading: false,
                    data: action.payload,
                    isFetched: true,
                    error: null
                };
            }
            return state;
        case requestErrorAction:
            return {
                ...state,
                loading: false,
                isFetched: true,
                error: action.payload
            };
        case clearStoreAction:
            return {
                ...initialState,
                loading: state.loading
            };
        default:
            return state;
        }
    };

    const requestActionCreator = () => ({ type: requestProcessingAction });
    const errorActionCreator = error => ({ type: requestErrorAction, payload: error });
    const responseActionCreator = data => ({ type: responseAction, payload: data });

    return {
        actionCreators: [
            requestActionCreator,
            errorActionCreator,
            responseActionCreator
        ],
        clearStoreAction: () => ({ type: clearStoreAction }),
        reducer,
        selectors: {
            data: (state) => {
                const data = get(state, `${path}.data`);
                if (!data) {
                    return data;
                }

                if (single) {
                    return data[0] || data;
                }
                return data;
            },
            error: state => get(state, `${path}.error`),
            loading: state => get(state, `${path}.loading`)
        }
    };
}
