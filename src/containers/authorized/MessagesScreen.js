import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Text, View, FlatList, LayoutAnimation} from 'react-native';
import {connect} from 'react-redux';

import styles from '../../design/styles';
import {
    createDeleteMessageThunk,
    fetchMessagesThunk,
    messagesStore
} from '../../redux/stores/messagesStore';
import {messageCountReached} from '../../redux/stores/canFetchMore';
import Message from './Message';
import Loading from '../../components/Loading';

class MessagesScreen extends Component {
    static propTypes = {
        loading: PropTypes.bool.isRequired,
        messages: PropTypes.array,
        canFetchMore: PropTypes.bool,

        fetch: PropTypes.func.isRequired,
        delete: PropTypes.func.isRequired
    };

    static _keyExtractor = ({ message_id: id }) => id;

    state = {
        selected: new Map()
    };

    constructor({ fetch, canFetchMore:  filter }) {
        super();

        if (!filter) {
            fetch();
        }

        this._renderItem = this._renderItem.bind(this);
        this._onPressItem = this._onPressItem.bind(this);
    }

    shouldComponentUpdate({ loading, messages, canFetchMore }, { selected }) {
        return (
            selected !== this.state.selected ||
            loading !== this.props.loading ||
            messages !== this.props.messages ||
            canFetchMore !== this.props.canFetchMore
        );
    }

    _onPressItem(id) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);

        this.setState((state) => {
            const selected = new Map(state.selected);
            selected.set(id, !selected.get(id));
            return { selected };
        });
    }

    _renderItem({ item: { message_id: id, text, title, read = false }, separators }) {
        return (
            <Message
                separators={separators}
                id={id}
                text={text}
                read={read}
                title={title}
                selected={!!this.state.selected.get(id)}
                onPressItem={this._onPressItem}
                onDelete={this.props.delete}
            />
        );
    }

    render() {
        const {
            messages,
            loading
        } = this.props;

        return (
            <View style={[styles.fill, styles.panelContainer]}>
                <FlatList
                    data={messages || []}
                    extraData={this.state}
                    keyExtractor={MessagesScreen._keyExtractor}
                    renderItem={this._renderItem}
                />
                {
                    loading ? <Loading /> : null
                }
            </View>
        );
    }
}

export default connect(state => ({
    loading: messagesStore.selectors.loading(state),
    messages: messagesStore.selectors.data(state),
    canFetchMore: messageCountReached.selector(state)
}), dispatch => ({
    fetch: () => dispatch(fetchMessagesThunk),
    delete: id => dispatch(createDeleteMessageThunk(id))
}))(MessagesScreen);
