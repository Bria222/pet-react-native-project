import { AppRegistry, UIManager } from 'react-native';
import { PushNotificationIOS, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

import App from './App';
import Logger from './src/utils/logger';
import Device from './src/security/device';
import settings from './src/settings/index';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

AppRegistry.registerComponent('reactnativepetapp', () => App);

settings
    .then(({ gsmSenderId }) => (
        PushNotification.configure({
            onRegister: function onRegister({ token }) {
                Logger.info('TOKEN', token);
                Device.token = token;
            },
            onNotification: function onNotify(notification) {
                Logger.info('NOTIFICATION', notification);

                const {
                    msgTitle,
                    msgBody
                } = notification;

                PushNotification.localNotification({
                    title: msgTitle,
                    message: msgBody
                });

                if (Platform.OS === 'ios') {
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                } else {
                    notification.finish();
                }
            },
            senderID: gsmSenderId
        })
    ))
    .catch(error =>
        Logger.error('Can not initialize push notification service due to error', error));

