import PropTypes from 'prop-types';

export const geoFeaturePropType = {
    id: PropTypes.number.isRequired,
    geometry: PropTypes.shape({
        type: PropTypes.string,
        coordinates: PropTypes.arrayOf(PropTypes.number).isRequired
    }),
    properties: PropTypes.shape({
        cluster: PropTypes.bool.isRequired,
        point_count: PropTypes.number.isRequired,
        item: PropTypes.object
    })
};
