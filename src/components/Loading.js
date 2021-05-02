import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { times } from 'lodash';

import styles from '../design/styles';

const maxTicks = 5;
const period = 500;

function getText(second) {
    return `Loading.${times(second, () => '.').join('')}`;
}

export default class Loading extends Component {
    state = {
        tick: 0
    };

    componentDidMount() {
        this.interval = setInterval(() => {
            this.setState(({ tick }) => {
                return {
                    tick: tick === maxTicks ? 0 : (tick + 1)
                };
            });
        }, period);
    }

    shouldComponentUpdate(props, { tick }) {
        return tick !== this.state.tick;
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <Text>{getText(this.state.tick)}</Text>
            </View>
        );
    }
}
