import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StatusBar, Modal, TextInput, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { styles } from '../components/StyleSheets.js';
import { TitleLogo } from '../components/TitleLogo.js';

class StartupActivity extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        headerStyle: {
            backgroundColor: '#03bdd5',
            height: 45,
        },
        title: '',
    }

    state = {
        loginModalVisible: false,
        registerModalVisible: false,
        loadingModalVisible: false,
        username: '',
        password: '',
    }

    async login() {
        this.setState({ loadingModalVisible: true });
        fetch('http://188.27.210.54:4000/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: this.state.username,
                password: this.state.password,
            }),
        }).then((response) => {
            this.setState({ loadingModalVisible: false });
            if (response.status == 404) {
                alert("Login credentials invalid");
            }
            else if(response.status == 403) {
                alert("User is already online");
            }
            else {
                let content = {};
                response.json().then(data => { 
                    content = data;
                    this.setState({ loginModalVisible: false });
                    this.props.navigation.navigate('MainMenu', { user: this.state.username, body: content });
                });
            }
        }).catch((error) => { alert(error); });
    }

    async register() {
        this.setState({ loadingModalVisible: true });
        fetch('http://188.27.210.54:4000/register', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user: this.state.username,
                password: this.state.password,
            }),
        }).then((response) => {
            this.setState({ loadingModalVisible: false });
            if (response.status == 403) {
                alert("Username taken");
            }
            else {
                this.setState({ registerModalVisible: false });
                fetch('http://188.27.210.54:4000/save', {
                    method: 'PUT',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    }
                });
            }
        }).catch((error) => { alert(error); });
    }

    render() {
        return (
            <View style={styles.container2}>
                <StatusBar hidden={false} barStyle="light-content" />
                <Modal animationType="slide"
                    transparent={true}
                    visible={this.state.loginModalVisible}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalView}>
                            <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                                <TouchableWithoutFeedback style={{width: '20%', paddingTop: '20%'}}>
                                    <Image source={require('../assets/CloseButton.png')} resizeMode="stretch" />
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                <Text style={{ flex: 1, marginHorizontal: 10, fontSize: 13 }}> Username: </Text>
                                <TextInput style={{ flex: 3, borderBottomColor: 'black', borderBottomWidth: 2, marginHorizontal: 20 }}
                                    onChangeText={(text) => { this.setState({ username: text }) }} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                <Text style={{ flex: 1, marginHorizontal: 20, fontSize: 13 }}> Password: </Text>
                                <TextInput style={{ flex: 3, borderBottomColor: 'black', borderBottomWidth: 2, marginHorizontal: 20 }}
                                    onChangeText={(text) => { this.setState({ password: text }) }} />
                            </View>
                            <TouchableOpacity style={styles.button} onPress={() => {
                                this.login(this.state.username, this.state.password).then(() => {
                                    this.setState({ loginModalVisible: false })
                                });
                            }}><Text style={{ color: 'white' }}>Login</Text></TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal animationType="slide"
                    transparent={true}
                    visible={this.state.registerModalVisible}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalView}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                <Text style={{ flex: 1, marginHorizontal: 10, fontSize: 13 }}> Username: </Text>
                                <TextInput style={{ flex: 3, borderBottomColor: 'black', borderBottomWidth: 2, marginHorizontal: 20 }}
                                    onChangeText={(text) => { this.setState({ username: text }) }} />
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                <Text style={{ flex: 1, marginHorizontal: 20, fontSize: 13 }}> Password: </Text>
                                <TextInput style={{ flex: 3, borderBottomColor: 'black', borderBottomWidth: 2, marginHorizontal: 20 }}
                                    onChangeText={(text) => { this.setState({ password: text }) }} />
                            </View>
                            <TouchableOpacity style={styles.button} onPress={() => {
                                this.register(this.state.username, this.state.password).then(() => {
                                    this.setState({ registerModalVisible: false })
                                });
                            }}><Text style={{ color: 'white' }}>Register</Text></TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal animationType="none"
                    transparent={true}
                    visible={this.state.loadingModalVisible}>
                    <View style={styles.modalContainer}>
                        <ActivityIndicator size="large" color="#0000ff" />
                    </View>
                </Modal>
                <TitleLogo style={{ flex: 1, alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }} />
                <View style={styles.container}>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        this.setState({ loginModalVisible: true, username: "", password: "" });
                    }}
                    ><Text style={{ fontSize: 40, color: 'white' }}> Login </Text></TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => {
                        this.setState({ registerModalVisible: true, username: "", password: "" });
                    }}
                    ><Text style={{ fontSize: 40, color: 'white' }}> Register </Text></TouchableOpacity>
                </View>
            </View>
        );
    }
}

export { StartupActivity };