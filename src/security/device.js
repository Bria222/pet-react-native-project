import { Platform, PermissionsAndroid } from 'react-native';
import { version } from '../../package.json';

const guid = 'ec8e0d95690aacd0c8f716d76741195b';

export default class Device {
    static token = null;

    static async extractDeviceSensitiveData() {
        return {
            object_id: Device.token,
            guid,
            app_version: version,
            user_agent: Platform.OS.toUpperCase()
        };
    }

    static async requestLocationPermissions() {
        if (Platform.OS === 'ios') {
            // explicitly allow request permissions on every platform
            return true;
        } else if (Platform.Version >= 23) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'React Native Pet App',
                    message: 'React Native Pet App needs access to your current location.'
                }
            );

            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }

        return false;
    }
}
