import { get, set } from 'lodash';

const filterActionType = 'FILTER';

/**
 * @param path
 * @return {{actionCreator: function, selector: function}}
 */
export const createFilter = path => ({
    actionCreator: value => ({
        type: filterActionType,
        payload: value,
        meta: { path }
    }),
    selector: state => get(state, `filters.${path}`, undefined)
});

export const reducer = (state = {}, action) => {
    if (action.type !== filterActionType) {
        return state;
    }

    const { payload, meta: { path } } = action;

    const newState = { ...state };

    const [view] = path.split('.');

    newState[view] = {
        ...state[view]
    };

    set(newState, path, payload);

    return newState;
};
