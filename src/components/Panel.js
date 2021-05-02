import React from 'react';
import PropTypes from 'prop-types';
import {Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

import styles from '../design/styles';
import {mainColor} from '../design/colors';
import icons from '../design/icons';

export default function Panel({
    mode,
    visible,
    children,
    style,
    suffixStyle,
    contentStyle,
    suffix,
    headerTouch,
    title
}) {
    if (mode === 'none') {
        return (
            <View style={styles.panel}>
                <View style={[styles.panelHeader, styles.block]}>
                    <Text style={[styles.fill, styles.panelTitle]}>{title}</Text>
                    {
                        suffix
                            ? (
                                <View style={[styles.fill, styles.raw, { justifyContent: 'flex-end' }, suffixStyle]}>
                                    {suffix}
                                </View>
                            )
                            : null
                    }
                </View>
                <View style={[styles.dividerView, styles.block]} />
                <View style={[styles.fill, styles.panelContent, styles.block, contentStyle]}>
                    {children}
                </View>
            </View>
        );
    }

    const header = (
        <View style={[styles.panelHeader, styles.block]}>
            <Text style={styles.panelTitle}>{title}</Text>
            {
                suffix
                    ? (
                        <View style={[styles.fill, styles.raw, { justifyContent: 'flex-end' }, suffixStyle]}>
                            {suffix}
                        </View>
                    )
                    : null
            }
            <Icon
                name={visible ? 'expand-less' : 'expand-more'}
                color={mainColor}
                size={icons.size.small}
            />
        </View>
    );

    return (
        <View style={[styles.panel, visible ? null : { maxHeight: 50 }]}>
            {headerTouch(header)}
            {
                visible
                    ? (
                        [
                            <View key={0} style={[styles.dividerView, styles.block]} />,
                            <View key={1} style={[styles.fill, styles.panelContent, styles.block, contentStyle]}>
                                {children}
                            </View>
                        ]
                    )
                    : null
            }
        </View>
    );
}

Panel.propTypes = {
    mode: PropTypes.oneOf([
        'none',
        'spoiler'
    ]),
    visible: PropTypes.bool,
    children: PropTypes.node,
    style: PropTypes.object,
    suffix: PropTypes.node,
    title: PropTypes.string.isRequired,
    contentStyle: PropTypes.object,
    suffixStyle: PropTypes.object,
    onStateChange: PropTypes.func
};

Panel.defaultProps = {
    mode: 'none',
    visible: false
};
