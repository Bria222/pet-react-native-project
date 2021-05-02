import React, { Component } from 'react';
import {
    View,
    Text
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Touchable from 'react-native-platform-touchable';
import PropTypes from 'prop-types';

import Panel from '../../../components/Panel';
import icons from '../../../design/icons';
import {mainColor} from '../../../design/colors';
import styles from '../../../design/styles';
import {geoFeaturePropType} from '../../../types/geo';

export default class MarkerInfo extends Component {
    static propTypes = {
        onClose: PropTypes.func.isRequired,
        onMove: PropTypes.func.isRequired,
        marker: PropTypes.shape(geoFeaturePropType).isRequired
    };

    render() {
        const {
            marker: {
                properties: {
                    item: {
                        NAME: description,
                        SPEC: title
                    }
                }
            },
            onClose,
            onMove
        } = this.props;

        return (
            <View
                style={[{ height: 200 }, styles.block]}
            >
                <Panel
                    style={styles.fill}
                    title={title}
                    suffix={
                        [
                            <Touchable
                                key={0}
                                onPress={onMove}
                            >
                                <Icon
                                    name="my-location"
                                    size={icons.size.small}
                                    color={mainColor}
                                />
                            </Touchable>,
                            <Touchable
                                key={1}
                                onPress={onClose}
                            >
                                <Icon
                                    name="close"
                                    size={icons.size.small}
                                    color={mainColor}
                                />
                            </Touchable>
                        ]
                    }
                >
                    <Icon
                        name="local-activity"
                        size={icons.size.large}
                        color={mainColor}
                    />
                    <Text>{description}</Text>
                </Panel>
            </View>
        );
    }
}
