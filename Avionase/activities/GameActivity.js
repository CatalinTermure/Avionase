import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Pusher from 'pusher-js/react-native';
import { styles } from '../components/StyleSheets';

class GameActivity extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        player: this.props.navigation.getParam('player', ""),
        opponent: this.props.navigation.getParam('opponent', ""),
    }

    pusher = new Pusher('869f8cb32dadff3b16ab', {
        cluster: 'eu',
        forceTLS: true
    }); gameChannel;

    componentDidMount() {
        this.gameChannel = pusher.subscribe('game-channel');
        this.gameChannel.bind('move-event', (data) => {
            if(data.target == this.state.player) {
                //
            }
        });
    }

    componentWillUnmount() {
        this.gameChannel.unbind();
    }

    render() {
        return (
            <View> <Text> Your opponent is {this.props.navigation.getParam('opponent', "")} </Text> </View>
        );
    }
}

export { GameActivity };