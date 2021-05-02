import {createRequestThunk} from '../thunks/createRequestThunk';
import {createDataStore} from './createDataStore';

const profileStore = createDataStore('profile', true);

export default profileStore;

export const requestProfile = createRequestThunk({
    actionCreators: profileStore.actionCreators
} , '/json/v1.0/citizens/profile/get');
