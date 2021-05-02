import React, { Component } from 'react';
import { reduxForm } from 'redux-form';

class Form extends Component {
    render() {
        return this.props.children;
    }

    componentWillUnmount() {
        this.props.submit();
    }
}

export default reduxForm()(Form);
