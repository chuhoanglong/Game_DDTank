import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import socketIO from '../SocketIoConfig';
export default class RoomScreen extends Component {

    state = {
        status: 0,
        message: 'Loading...'
    }

    componentDidMount() {
        this.socket = socketIO();
        this.socket.on('statusRoom', event => {
            const { message, status } = event;
            this.setState({ status, message });
        });
    }

    handlerStart = () => {
        this.props.navigation.navigate('GamePlayScreen', { socket: this.socket });
    }

    handlerGoBack = () => {
        this.props.navigation.navigate('MenuScreen');
    }

    render() {
        const { status, message } = this.state;
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <StatusBar hidden translucent={true} />
                {
                    status ?
                        <>
                            <Text>{message}</Text>
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderRadius: 5,
                                    marginTop: 50
                                }}
                                onPress={this.handlerStart}
                            >
                                <Text>Bắt đầu chơi</Text>
                            </TouchableOpacity>
                        </>
                        :
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text>{message}</Text>
                            <TouchableOpacity
                                style={{
                                    borderWidth: 1,
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderRadius: 5,
                                    marginTop: 20
                                }}
                                onPress={this.handlerGoBack}
                            >
                                <Text>Quay lại</Text>
                            </TouchableOpacity>
                        </View>
                }

            </View>
        );
    }
}