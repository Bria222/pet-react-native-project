import Device from '../security/device';
import { handle } from '../utils/async';
import Logger from '../utils/logger';
import settings, {
    subscribeEndPoint,
    subscribeEmpToken
} from '../settings/index';

let endpoint, token;

settings
    .then(({ backendEndpoint,  empToken }) => {
        endpoint = backendEndpoint;
        token = empToken;
    }).then(() => {
        subscribeEmpToken(newToken => token = newToken);
        subscribeEndPoint(newEndpoint => endpoint = newEndpoint);
    });

const requestSecondsTimeOut = 15;

async function setRequestCapacity(session, headers, body) {
    const resultHeaders = {
        ...headers,
        'Content-Type': 'application/json',
        Accept: 'application/json'
    };

    let error, deviceInfo;

    [error, deviceInfo = {}] = await handle(Device.extractDeviceSensitiveData());

    if (!token) {
        throw { errorCode: 500, errorMessage: 'token not found' };
    }

    const resultBody = {
        ...body,
        token,
        device_info: deviceInfo
    };

    if (session) {
        resultBody.auth = { session_id: session };
    }

    return {
        body: resultBody,
        headers: resultHeaders
    };
}

function timeout(promise) {
    return new Promise((resolve, reject) => {
        const timeOutId = setTimeout(() => {
            const error = { errorMessage: 'Connection timeout', errorCode: 500 };
            reject(error);
        }, requestSecondsTimeOut * 1000);
        promise
            .then((data) => {
                clearTimeout(timeOutId);
                resolve(data);
            }).catch((err) => {
            Logger.error(err);
            clearTimeout(timeOutId);
            const error = { errorCode: 500, errorMessage: 'No connection with server' };
            reject(error);
        });
    });
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 299) {
        return;
    }

    const error = { errorMessage: response.statusText, errorCode: response.status };
    throw error;
}

function parseResponse({ errorCode, errorMessage, result, session_id: session } = {}) {
    if (errorCode !== 0) {
        const error = isNaN(parseInt(errorCode, 10))
            ? { errorCode: 500, errorMessage: 'Unknown error code' }
            : { errorCode, errorMessage };
        throw error;
    }

    return { result, session };
}

export default class ApiUtils {
    static session = null;

    static async request(method, url, data, headers = {}) {
        const requestContent = await setRequestCapacity(ApiUtils.session, headers, data);

        Logger.debug(requestContent);

        const { body, headers: requestHeaders } = requestContent;

        if (!endpoint) {
            throw { errorCode: 500, errorMessage: 'endpoint not exists' };
        }

        Logger.debug('request');
        Logger.debug(`endpoint: ${endpoint + url}`);
        Logger.debug(`body: ${JSON.stringify(body)}`);
        const response = await timeout(fetch(endpoint + url, {
            method,
            body: JSON.stringify(body),
            headers: requestHeaders
        }));

        checkStatus(response);

        const responseJson = await response.json();

        Logger.debug('responseJson:', responseJson);

        return parseResponse(responseJson);
    }

    static post = (...args) => ApiUtils.request('POST', ...args);

    constructor() {
        throw new Error('can not execute static class');
    }
}
