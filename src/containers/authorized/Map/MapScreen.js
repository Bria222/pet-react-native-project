import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {View, Dimensions, StyleSheet, Text} from 'react-native';
import { map, find, reduce } from 'lodash';
import {connect} from 'react-redux';
import createCluster from 'supercluster';
import geoViewport from '@mapbox/geo-viewport';

import mapDataStore, { requestData } from '../../../redux/stores/mapDataStore';
import Logger from '../../../utils/logger';
import Device from '../../../security/device';
import icons from '../../../design/icons';
import {mainColor} from '../../../design/colors';
import MarkerInfo from './MarkerInfo';
import styles from '../../../design/styles';
import {geoFeaturePropType} from '../../../types/geo';
import Cluster from './Cluster';

let markerIcon;

Icon.getImageSource('place', icons.size.medium, mainColor).then(source => markerIcon = source);

const minZoom = 1;
const maxZoom = 20;

const ANIMATION_DURATION = 500;

class MapScreen extends Component {
    static propTypes = {
        data: PropTypes.arrayOf(PropTypes.shape(geoFeaturePropType)),
        loading: PropTypes.bool.isRequired,
        requestData: PropTypes.func.isRequired
    };

    constructor({ requestData }) {
        super();

        requestData();

        const screen = Dimensions.get('window');
        const ASPECT_RATIO = screen.width / screen.height;
        const LATITUDE_DELTA = 0.0922;
        const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

        this.region = {
            latitude: 55.7494733,
            longitude: 37.3523255,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        };
        this.state = {
            data: [],
            selected: null
        };

        this.setMapRef = this.setMapRef.bind(this);
        this.getViewPortData = this.getViewPortData.bind(this);
        this.handleRegionChange = this.handleRegionChange.bind(this);
        this.handleClusterPress = this.handleClusterPress.bind(this);
        this.handleMarkerPress = this.handleMarkerPress.bind(this);
        this.handleMoveToMarker = this.handleMoveToMarker.bind(this);
        this.handleMarkerInfoClose = this.handleMarkerInfoClose.bind(this);
    }

    componentWillReceiveProps({ data }) {
        if (this.props.data !== data) {
            this.clusterize(data);
        }
    }

    componentDidMount() {
        if (this.props.data && this.props.data.length > 0) {
            this.clusterize(this.props.data);
        }

        Device
            .requestLocationPermissions()
            .then((granted) => {
                if (granted) {
                    Logger.debug('ACCESS TO USER POSITION GRANTED');
                    navigator.geolocation.getCurrentPosition(({
                        coords
                    }) => {
                        Logger.debug('COORDS', coords);
                        this.region = {
                            ...this.region,
                            ...coords
                        };
                        if (this.map) {
                            // Sometimes doesn't work just on did mount hook
                            requestAnimationFrame(() => this.map.animateToCoordinate(coords, ANIMATION_DURATION));
                            this.handleRegionChange(this.region);
                        }
                    }, Logger.error, { timeout: 5000 });
                }
            })
    }

    setMapRef(instance) {
        this.map = instance;
    }

    handleMarkerPress(event) {
        Logger.debug('MARKER PRESED');
        const { id: selectedId, coordinate } = event.nativeEvent;
        const selected = find(this.props.data, ({
            id
        }) => id.toString() === selectedId);

        if (selected) {
            Logger.debug('SELECTED SETTED');

            this.setState({
                selected
            });

            if (this.map) {
                this.map.animateToCoordinate(coordinate, ANIMATION_DURATION);
            }
        }
    }

    handleClusterPress({
        geometry: {
           coordinates
        },
        properties: {
           cluster_id: id
        }
    }) {
        if (this.map) {
            const children = this.cluster.getChildren(id);

            const {
                westLong,
                southLat,
                eastLong,
                northLat
            } = reduce(children, ({
                westLong,
                southLat,
                eastLong,
                northLat
            }, {
                geometry: {
                    coordinates: [longitude, latitude]
                }
            }) => ({
                westLong: Math.max(longitude, westLong),
                southLat: Math.min(latitude, southLat),
                eastLong: Math.min(longitude, eastLong),
                northLat: Math.max(latitude, northLat)
            }), {
                westLong: 0,
                eastLong: 1000,
                southLat: 1000,
                northLat: 0
            });

            this.map.fitToCoordinates(
                [{
                    latitude: northLat,
                    longitude: eastLong
                }, {
                    latitude: northLat,
                    longitude: westLong
                }, {
                    latitude: southLat,
                    longitude: westLong
                }, {
                    latitude: southLat,
                    longitude: eastLong
                }]);

        }
    }

    handleRegionChange(region) {
        if (this.props.data && this.props.data.length > 0) {
            this.region = region;
            this.getViewPortData(region);
        }
    }

    getViewPortData(region) {
        const lngD = region.longitudeDelta < 0 ? region.longitudeDelta + 360 : region.longitudeDelta;
        const bounds = [
            region.longitude - lngD, // westLng - min lng
            region.latitude - region.latitudeDelta, // southLat - min lat
            region.longitude + lngD, // eastLng - max lng
            region.latitude + region.latitudeDelta // northLat - max lat
        ];

        const { width, height } = Dimensions.get('window');
        const viewport = geoViewport.viewport(bounds, [width, height], minZoom, maxZoom);
        this.setState({
            data: this.cluster.getClusters(bounds, viewport.zoom)
        });
    }

    handleMarkerInfoClose() {
        this.setState({ selected: null });
    }

    handleMoveToMarker() {
        if (this.map) {
            const {
                geometry: {
                    coordinates: [longitude, latitude]
                }
            } = this.state.selected;
            this.map.animateToCoordinate({ longitude, latitude }, ANIMATION_DURATION);
        }
    }

    clusterize(data) {
        if (!this.cluster) {
            const { width } = Dimensions.get('window');
            this.cluster = createCluster({
                radius: width * 0.1,
                maxZoom,
                minZoom,
                extent: 512
            });
        }

        this.cluster.load(data);

        this.getViewPortData(this.region);
    }

    renderCluster(geoFeature) {
        const {
            properties: {
                cluster_id: id
            }
        } = geoFeature;
        const key = `cluster-${id}`;
        return (
            <Cluster
                key={key}
                cluster={geoFeature}
                onPress={this.handleClusterPress}
            />
        );
    }

    renderMarker({
        id,
        geometry: {
            coordinates: [longitude, latitude]
        },
        properties: {
            item: {
                NAME: description,
                SPEC: title
            }
        }
    }) {
        return (
            <Marker
                key={id.toString()}
                stopPropagation
                identifier={id.toString()}
                image={markerIcon}
                title={title}
                description={description}
                coordinate={{
                    longitude,
                    latitude
                }}
                onPress={this.handleMarkerPress}
            />
        );
    }

    render() {
        const {
            data,
            selected
        } = this.state;

        return (
            <View style={styles.map}>
                <MapView
                    minZoomLevel={minZoom}
                    maxZoomLevel={maxZoom}
                    ref={this.setMapRef}
                    showsUserLocation
                    initialRegion={this.region}
                    followsUserLocation
                    moveOnMarkerPress={false}
                    onRegionChangeComplete={this.handleRegionChange}
                    style={StyleSheet.absoluteFillObject}
                >
                    {map(data, (geoFeature) => {
                        const { properties: { cluster } } = geoFeature;
                        return cluster ? this.renderCluster(geoFeature) : this.renderMarker(geoFeature);
                    })}
                </MapView>
                {
                    selected
                    ? (
                      <MarkerInfo
                          marker={selected}
                          onMove={this.handleMoveToMarker}
                          onClose={this.handleMarkerInfoClose}
                      />
                    ) : null
                }
            </View>
        );
    }
}

export default connect(state => ({
    data: mapDataStore.selectors.data(state),
    loading: mapDataStore.selectors.loading(state)
}), dispatch => ({
    requestData: () => dispatch(requestData())
}))(MapScreen);
