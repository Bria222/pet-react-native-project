import React from 'react';
import { TextInput } from 'react-native';

export default function Input({ input, meta, innerRef, ...rest }) {
    const {
        value,
        onChange,
        onFocus,
        onBlur
    } = input;
    return (
        <TextInput
            {...rest}
            ref={innerRef}
            onFocus={onFocus}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
        />
    );
}
