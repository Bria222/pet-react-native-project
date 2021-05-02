import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Text
} from 'react-native';
import { Marker } from 'react-native-maps';
import {mainColor} from '../../../design/colors';
import {geoFeaturePropType} from '../../../types/geo';

const outerRadius = 36;
const borderRadius = 2;

const Style = {
    width: outerRadius,
    height: outerRadius,
    borderRadius: outerRadius / 2,
    backgroundColor: '#fff',
    borderWidth: borderRadius,
    borderColor: mainColor,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
};

export default class Cluster extends Component {
    static propTypes = {
        cluster: PropTypes.shape(geoFeaturePropType).isRequired,
        onPress: PropTypes.func.isRequired
    };

    constructor() {
        super();

        this.handlePress = this.handlePress.bind(this);
    }

    handlePress() {
        this.props.onPress(this.props.cluster);
    }

    render() {
        const {
            id,
            cluster: {
                geometry: {
                    coordinates: [longitude, latitude]
                },
                properties: {
                    point_count: markersCount
                }
            }
        } = this.props;

        let format;
        let factor = 1000;
        let multiplier = markersCount / factor;

        while (multiplier < 1) {
            factor /= 10;
            multiplier = markersCount / factor;
        }

        if (factor < 100) {
            format = markersCount;
        } else {
            const factorCount = Math.floor(multiplier);
            if (factor === 1000) {
                format = `${factorCount}k`;
            } else {
                format = `${factorCount * factor}+`;
            }
        }

        return (
            <Marker
                identifier={`cluster-${id}`}
                coordinate={{
                    longitude,
                    latitude
                }}
                onPress={this.handlePress}
            >
                <View style={Style}>
                    <Text>{format}</Text>
                </View>
            </Marker>
        );
    }
}
