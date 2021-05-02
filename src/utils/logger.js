const LOG_PREFIX = 'APP_LOG-->>';

export default class Logger {
    static prefix = LOG_PREFIX;

    static debug(...args) {
        console.debug(Logger.prefix, ...args);
    }

    static warn(...args) {
        console.warn(Logger.prefix, ...args);
    }

    static error(...args) {
        console.error(Logger.prefix, ...args);
    }

    static info(...args) {
        console.info(Logger.prefix, ...args);
    }
}
