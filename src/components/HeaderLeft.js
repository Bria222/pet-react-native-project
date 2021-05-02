import React from 'react';
import {View} from 'react-native';

const style = {
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: 100
};

export default function HeaderLeft({ children }) {
    return (
        <View style={style}>
            {children}
        </View>
    );
}
