import React, { Component } from 'react';
import { AsyncStorage, Button, View } from 'react-native';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Field, reduxForm } from 'redux-form';

import styles from '../../design/styles';
import Input from '../../components/Input';
import {signInThunkCreator, signInThunkCreatorWithResetingCredentials} from '../../redux/thunks/signin';
import { navigationPropType } from '../../types/navigation';
import { authorizedAppState } from '../../security/appState';
import {appHeaderOptions} from '../../design/misc';

class SignIn extends Component {
    static propTypes = {
        submit: PropTypes.func.isRequired,
        pristine: PropTypes.bool.isRequired,
        submitting: PropTypes.bool.isRequired
    };

    render() {
        const { submit, pristine, submitting } = this.props;
        return (
            <View style={styles.signIn}>
                <Field
                    name="login"
                    component={Input}
                    placeholder="Enter login"
                />
                <Field
                    name="password"
                    component={Input}
                    secureTextEntry
                    placeholder="Enter password"
                />
                <Button
                    disabled={pristine}
                    title={submitting ? 'Loading...' : 'Sign in!'}
                    onPress={submit}
                />
            </View>
        );
    }
}

const SignInForm = reduxForm({
    form: 'signIn'
})(SignIn);

export class SignInScreen extends Component {
    static navigationOptions = {
        title: 'Please sign in',
        ...appHeaderOptions
    };

    static propTypes = {
        signIn: PropTypes.func.isRequired,
        appState: PropTypes.string.isRequired,
        navigation: PropTypes.shape(navigationPropType).isRequired
    };

    static getDerivedStateFromProps({ navigation, appState }) {
        if (appState === authorizedAppState) {
            navigation.navigate('App');
        }

        return null;
    }

    render() {
        return <SignInForm onSubmit={this.props.signIn} />;
    }
}

export default connect(
    state => ({
        appState: state.appState
    }),
    dispatch => ({
        signIn: ({login, password}) => dispatch(signInThunkCreatorWithResetingCredentials(login, password))
}))(SignInScreen);

