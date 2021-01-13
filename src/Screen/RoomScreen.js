import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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

    render() {
        const { status, message } = this.state;
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
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
                        <Text>{message}</Text>
                }

            </View>
        );
    }
}