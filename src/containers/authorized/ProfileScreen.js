import React from 'react';
import { Text, ScrollView, View, Animated } from 'react-native';
import {map, times} from 'lodash';
import {connect} from 'react-redux';
import Touchable from 'react-native-platform-touchable';

import profileStore from '../../redux/stores/profileStore';
import styles from '../../design/styles';
import {getLoc} from '../../design/localization';
import Loading from '../../components/Loading';
import { Dimensions } from 'react-native';

const displayParams = [
    'id',
    'msisdn',
    'email',
    'surname',
    'name',
    'patronymic',
    'snils',
    'birthdate',
    'msisdnConfirmed',
    'emailConfirmed',
    'createTime',
    'ssoId'
];

const viewStyle = { flex: 1 };

function ProfileScreen({ loading, data }) {
    if (loading || !data) {
        return <Loading />;
    }
    const screenHeight = Dimensions.get('window').height;

    return (
        <View style={styles.fill}>
            <ScrollView style={styles.fill}>
                {map(displayParams, key => (
                    <Touchable key={key}>
                        <View style={styles.listItem}>
                            <Text style={styles.title}>{getLoc(key, 'profile')}</Text>
                            <Text>{data[key]}</Text>
                        </View>
                    </Touchable>
                ))}
            </ScrollView>
        </View>
    );
}

export default connect(state => ({
    loading: profileStore.selectors.loading(state),
    data: profileStore.selectors.data(state)
}))(ProfileScreen);

