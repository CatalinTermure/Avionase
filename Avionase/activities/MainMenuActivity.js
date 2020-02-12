import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import Pusher from 'pusher-js/react-native';
import { styles } from '../components/StyleSheets';
import { TitleLogo } from '../components/TitleLogo';

class MainMenuActivity extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        online: this.props.navigation.getParam('body', { "online": [] }).online,
        friends: this.props.navigation.getParam('body', { "friends": [] }).friends,
        friendreq: this.props.navigation.getParam('body', { "req": [] }).req,
        user: this.props.navigation.getParam('user', ""),
        inQueue: false,
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#03bdd5',
            height: 45,
        },
        headerLeft: null,
        title: '',
    }

    pusher = new Pusher('869f8cb32dadff3b16ab', {
        cluster: 'eu',
        forceTLS: true
    }); mainChannel;

    async logout() {
        fetch("http://188.27.210.54:4000/logout", {
            method: "POST",
            body: JSON.stringify({
                "user": this.state.user
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(this.props.navigation.navigate('Startup')).catch((error) => alert(error));
    }

    async StartGame(other) {
        fetch("http://188.27.210.54:4000/gamestart", {
            method: "POST",
            body: JSON.stringify({
                "user1": this.state.user,
                "user2": other
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(() => this.props.navigation.navigate("Game", { user1: this.state.user, user2: other }));
    }

    async queueup() {
        fetch("http://188.27.210.54:4000/queue", {
            method: "POST",
            body: JSON.stringify({
                "user": this.state.user
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).catch((error) => alert(error));
    }

    componentWillMount() {
        this.setState({
            online: this.props.navigation.getParam('body', { "online": [] }).online,
            friends: this.props.navigation.getParam('body', { "friends": [] }).friends,
            friendreq: this.props.navigation.getParam('body', { "req": [] }).req,
            user: this.props.navigation.getParam('user', ""),
            inQueue: false,
        });
    }

    componentDidMount() {
        this.mainChannel = this.pusher.subscribe('main-channel');
        this.mainChannel.bind('online-event', (data) => {
            this.setState({ online: this.state.online.concat(data.user) });
        });
        this.mainChannel.bind('request-event', (data) => {
            if (data.target == this.state.user) {
                this.setState({ friendreq: this.state.friendreq.concat(data.user) });
            }
        });
        this.mainChannel.bind('accept-event', (data) => {
            if (data.target == this.state.user) {
                this.setState({ friends: this.state.friends.concat(data.user) });
            }
        });
        this.mainChannel.bind('start-event', (data) => {
            if ((data.user2 == this.state.user || data.user1 == this.state.user) && this.state.inQueue) {
                this.setState({ inQueue: false });
                if(data.user2 == this.state.user) {
                    this.props.navigation.navigate("Game", { player: data.user2, opponent: data.user1 });
                }
                else {
                    this.props.navigation.navigate("Game", { player: data.user1, opponent: data.user2 });
                }
            }
        });
    }

    componentWillUnmount() {
        this.mainChannel.unbind();
    }

    render() {
        return (
            <View style={styles.container2}>
                <Modal animationType={none}
                    transparent={true}
                    visible={this.state.inQueue}>
                    <View style={styles.modalContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text style={{ color: 'white' }}>Waiting for another player.</Text>
                    </View>
                </Modal>
                <TitleLogo style={{ flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }} />
                <View style={styles.container}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        this.setState({ inQueue: true });
                        this.queueup();
                    }}
                    ><Text style={{ fontSize: 40, color: 'white' }}> Quick Play </Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        this.logout();
                    }}
                    ><Text style={{ fontSize: 40, color: 'white' }}> Logout </Text></TouchableOpacity>
                </View>
            </View>
        );
    }
}

export { MainMenuActivity };