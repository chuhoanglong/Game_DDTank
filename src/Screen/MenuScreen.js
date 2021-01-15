import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    BackHandler,
    Alert,
    StatusBar
} from "react-native";

export default class MenuScreen extends Component {

    componentDidMount() {
        this.backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            this.exitApp
        );
    }


    exitApp = () => {
        Alert.alert("Hold on!", "Are you sure you want to go back?", [
            {
                text: "Cancel",
                onPress: () => null,
                style: "cancel"
            },
            { text: "YES", onPress: () => BackHandler.exitApp() }
        ]);
        return true;
    };

    handlerStart = () => {
        this.props.navigation.navigate('GamePlayScreen', { socket: null });
    }

    handlerFindRoom = () => {
        this.props.navigation.navigate('RoomScreen');
    }

    componentWillUnmount() {
        this.backHandler.remove();
    }

    render() {
        return (
            <View style={styles.contain}>
                <StatusBar hidden translucent={true} />
                <Text style={styles.styTitle}>DDTank</Text>
                <View style={{ height: 50 }} />
                <View>
                    {/* <TouchableOpacity
                        style={styles.styWrapBtn}
                        onPress={this.handlerStart}
                    >
                        <Text>Bắt đầu</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        style={styles.styWrapBtn}
                        onPress={this.handlerFindRoom}
                    >
                        <Text>Tìm phòng nhanh</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.styWrapBtn}>
                        <Text>Tạo phòng</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity
                        style={styles.styWrapBtn}
                        onPress={this.exitApp}
                    >
                        <Text>Thoát</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 50,
        position: 'absolute',
        top: 40,
    },
    styWrapBtn: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        width: 200,
    }
})