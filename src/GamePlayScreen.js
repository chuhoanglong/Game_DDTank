import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert,
    ImageBackground,
    Dimensions,
    Modal,
    FlatList
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import Tank from './Components/Tank';
import Constants from './Constants';
import GameLoop from './System/GameLoop';
import RNGamePad from 'react-native-game-pad';
import Bullet from './Components/Bullet';
import Enemy from './Components/Enemy';
import Sound from 'react-native-sound';
import Score from './Components/Score';
import AsyncStore from '@react-native-async-storage/async-storage';
const width = Constants.MAX_WIDTH;
const height = Constants.MAX_HEIGHT;
const scaleEnemyAndBullet = Constants.ENEMY_SIZE / Constants.BULLET_SIZE;
const scaleTankAndBullet = Constants.GRID_SIZE / Constants.BULLET_SIZE;
export default class App extends Component {
    constructor(props) {
        super(props);
        this.refGameEngine = null;
        this.state = {
            running: true,
            visible: false
        };
        this.sound = null;
        this.entities = this.setUpEntities();
        this.socket = this.props.navigation.state.params.socket;
        this.index = 0;
    }


    componentDidMount() {
        // this.playSound();
        this.socket = this.props.navigation.state.params.socket;
        this.socket?.on('response_controller', e => {
            switch (e.type) {
                // điều khiển tank 1
                case 'up':
                    this.refGameEngine.dispatch({ type: 'move-up' });
                    break;
                case 'down':
                    this.refGameEngine.dispatch({ type: 'move-down' });
                    break;
                case 'left':
                    this.refGameEngine.dispatch({ type: 'move-left' });
                    break;
                case 'right':
                    this.refGameEngine.dispatch({ type: 'move-right' });
                    break;
                case 'end':
                    this.refGameEngine.dispatch({ type: 'move-end' });
                    break;
                case 'bullet-shoot':
                    this.refGameEngine.dispatch({ type: 'bullet-shoot' });
                    break;
                case 'bullet-shoot1':
                    this.refGameEngine.dispatch({ type: 'bullet-shoot1' });
                    break;

                // điều khiển tank 2
                case 'move-up':
                    this.refGameEngine.dispatch({ type: 'move-up-tank1' });
                    break;
                case 'move-down':
                    this.refGameEngine.dispatch({ type: 'move-down-tank1' });
                    break;
                case 'move-left':
                    this.refGameEngine.dispatch({ type: 'move-left-tank1' });
                    break;
                case 'move-right':
                    this.refGameEngine.dispatch({ type: 'move-right-tank1' });
                    break;
                case 'move-end':
                    this.refGameEngine.dispatch({ type: 'move-end-tank1' });
                    break;
                case 'bullet-shoot-enemy':
                    this.refGameEngine.dispatch({ type: 'bullet-shoot-enemy' });
                    break;
                case 'bullet-shoot-enemy1':
                    this.refGameEngine.dispatch({ type: 'bullet-shoot-enemy1' });
                    break;

                case 'end-game': {
                    this.sound?.pause();
                    this.setState({ running: false });
                    this.refModalEndGame.changeState(e);
                    // Alert.alert('Game Over', null, [
                    //     {
                    //         text: 'Chơi lại',
                    //         onPress: async () => {
                    //             // this.playSound();
                    //             await this.setState({ running: true });
                    //             this.refGameEngine.dispatch({ type: 'gamestart' });
                    //         }
                    //     }
                    // ]);
                }
                    break;
                default:
                    break;
            }
        })
    }

    setUpEntities = () => {

        let engine = Matter.Engine.create({ enableSleeping: false });
        let world = engine.world;

        const positionTank = {
            x: Constants.MAX_WIDTH / Constants.GRID_SIZE,
            y: Constants.MAX_HEIGHT / Constants.GRID_SIZE / 3
        };
        const sizeTank = {
            width: Constants.GRID_SIZE,
            height: Constants.GRID_SIZE,
        }
        let tank = Matter.Bodies.rectangle(
            positionTank.x,
            positionTank.y,
            sizeTank.width,
            sizeTank.height,
            { isStatic: false }
        );

        const positionEnemy = {
            x: Constants.MAX_WIDTH / Constants.ENEMY_SIZE / 1.1,
            y: Constants.MAX_HEIGHT / Constants.ENEMY_SIZE / 2
        };
        const sizeEnemy = {
            width: Constants.ENEMY_SIZE,
            height: Constants.ENEMY_SIZE,
        }
        let enemy = Matter.Bodies.rectangle(
            positionEnemy.x,
            positionEnemy.y,
            sizeEnemy.width,
            sizeEnemy.height,
            { isStatic: false }
        );
        Matter.World.add(world, [tank]);

        return {
            physics: { engine, world },
            Tank: {
                body: tank,
                position: positionTank, // vi tri ban dau cua bird
                size: Constants.GRID_SIZE, // kich thuoc cua bird
                color: 'red', // mau cua bird
                speed: Constants.SPEED, // toc do bird di chuyen.
                rotate: 90,
                isLiving: true,
                updateFrequency: 10,// tan so cap nhat
                nextMove: 10,// khoang cach di chuyen khi nhan button di chuyen
                renderer: <Tank />,// ve con bird
            },
            Bullet: {
                position: {
                    x: positionTank.x * scaleTankAndBullet,
                    y: positionTank.y * scaleTankAndBullet
                },
                size: Constants.BULLET_SIZE,
                speed: 0.6, // toc do Bullet di chuyen.
                display: false,
                renderer: <Bullet />, // ve con Bullet
            },
            Bullet1: {
                position: {
                    x: positionTank.x * scaleTankAndBullet,
                    y: positionTank.y * scaleTankAndBullet
                },
                size: Constants.BULLET_SIZE,
                speed: 1, // toc do Bullet di chuyen.
                display: false,
                renderer: <Bullet />,// ve con Bullet
            },
            Enemy: {
                body: enemy,
                position: positionEnemy,
                size: Constants.ENEMY_SIZE,
                speed: Constants.SPEED,
                isLiving: true,
                rotate: 270,
                socket: this.props.navigation.state.params.socket,
                renderer: <Enemy />
            },
            BulletEnemy: {
                position: {
                    x: positionEnemy.x * scaleEnemyAndBullet,
                    y: positionEnemy.y * scaleEnemyAndBullet,
                },
                size: Constants.BULLET_SIZE,
                speed: 1, // toc do Bullet di chuyen.
                display: false,
                renderer: <Bullet />,// ve con Bullet
            },
            BulletEnemy1: {
                position: {
                    x: positionEnemy.x * scaleEnemyAndBullet,
                    y: positionEnemy.y * scaleEnemyAndBullet,
                },
                size: Constants.BULLET_SIZE,
                speed: 1, // toc do Bullet di chuyen.
                display: false,
                renderer: <Bullet />,// ve con Bullet
            },
            Controller: {
                renderer: () => <RNGamePad
                    onButtonBPress={this.onPressB}
                    onButtonAPress={this.onPressA}
                    onDirUp={this.onDirUp}
                    onDirDown={this.onDirDown}
                    onDirLeft={this.onDirLeft}
                    onDirRight={this.onDirRight}
                    onEnd={this.onEnd}
                    dualJoystick={false}
                    buttonAColor='rgba(0,255,78,0.5)'
                    buttonBColor='rgba(3,169,244,0.5)'
                    options={{
                        size: 300,
                        color: "rgba(255,255,255,0.5)",
                    }}
                />
            },
            children: {
                renderer: () => <ImageBackground
                    source={require('./assets/background.jpg')}
                    style={styles.styBackground} >
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#fff',
                            alignSelf: 'flex-end',
                            padding: 3
                        }}
                        onPress={() => {
                            this.refModalPause.changeState();
                            this.onPause();
                        }}
                    >
                        <Text> | | </Text>
                    </TouchableOpacity>
                </ImageBackground>
            }
        }
    }

    playSound = async () => {
        let soundFile = require('./assets/background_game.mp3');

        this.sound = new Sound(soundFile, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
                return;
            }

            this.sound.play((success) => {
                if (success) {
                    console.log('successfully finished playing');
                } else {
                    console.log('playback failed due to audio decoding errors');
                }
            });
        });
    };

    componentWillUnmount() {
        this.sound?.pause();
        this.socket?.on('disconnect', function () { });
        this.onPause();
    }

    onEvent = async e => {
        if (e.type == 'end-game' && this.index == 0) {
            this.index = 1;
            this.socket.emit('event', { type: 'end-game', data: e.data });
        }
    }

    onDirUp = () => {
        const { running } = this.state;
        if (!running) {
            this.setState({ running: true });
        }
        // this.refGameEngine.dispatch({ type: 'move-up' });
        this.socket.emit('event', { type: 'move-up', id: this.socket.id });
    }

    onDirDown = () => {
        const { running } = this.state;
        if (!running) {
            this.setState({ running: true });
        }
        // this.refGameEngine.dispatch({ type: 'move-down' });
        this.socket.emit('event', { type: 'move-down', id: this.socket.id });
    }

    onDirLeft = () => {
        const { running } = this.state;
        if (!running) {
            this.setState({ running: true });
        }
        // this.refGameEngine.dispatch({ type: 'move-left' });
        this.socket.emit('event', { type: 'move-left', id: this.socket.id });
    }

    onDirRight = () => {
        const { running } = this.state;
        if (!running) {
            this.setState({ running: true });
        }
        // this.refGameEngine.dispatch({ type: 'move-right' });
        this.socket.emit('event', { type: 'move-right', id: this.socket.id });
    }

    onPressA = () => {
        // this.refGameEngine.dispatch({ type: 'bullet-shoot' });
        this.socket.emit('event', { type: 'bullet-shoot', id: this.socket.id });
        Constants.playSound('bullet');
    }

    onPressB = () => {
        // this.refGameEngine.dispatch({ type: 'bullet-shoot1' });
        this.socket.emit('event', { type: 'bullet-shoot1', id: this.socket.id });
        Constants.playSound('bullet1');
    }

    onEnd = () => {
        // this.refGameEngine.dispatch({ type: 'end' });
        this.socket.emit('event', { type: 'end', id: this.socket.id });
    }

    onResumed = () => {
        this.setState({ running: true });
    }

    onPause = () => {
        this.setState({ running: false });
    }

    onExit = () => {
        this.refModalEndGame.close();
        this.props.navigation.navigate('MenuScreen');
    }

    render() {
        const { running } = this.state;
        return (
            <View style={styles.contain}>
                <StatusBar hidden />
                <SafeAreaView style={{ flex: 1 }}>
                    <GameEngine
                        ref={ref => this.refGameEngine = ref}
                        style={{
                            width: Constants.MAX_WIDTH,
                            height: Constants.MAX_HEIGHT,
                            flex: null,
                            backgroundColor: '#fff'
                        }}
                        entities={this.entities}
                        systems={[GameLoop]}
                        onEvent={this.onEvent}
                        running={running}
                    />
                    <ModalPause
                        ref={ref => this.refModalPause = ref}
                        onResumed={this.onResumed}
                        {...this.props}
                    />
                    <ModalEndGame
                        ref={ref => this.refModalEndGame = ref}
                        onExit={this.onExit}
                    />
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    contain: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center'
    },
    styBtn: {
        width: 50,
        height: 50,
        backgroundColor: 'blue',
    },
    styBackground: {
        width,
        height,
        zIndex: -2,
        position: 'absolute',
        top: 0,
        left: 0
    }
});

class ModalPause extends Component {

    state = {
        visible: false,
        showHight: false,
        scores: []
    }

    changeState = () => {
        const { visible } = this.state;
        if (!visible) {
            this.props.onResumed();
        }
        this.setState({ visible: !visible });
    }

    showHightScore = async () => {
        let scores = await AsyncStore.getItem('score_tank');
        scores = JSON.parse(scores);
        this.setState({ scores });
        this.setState({ showHight: true });
    }

    handlerBack = () => {
        this.props.navigation.navigate('MenuScreen');
    }

    render() {
        const { visible, showHight, scores } = this.state;
        return (
            <Modal
                transparent={true}
                visible={visible}
                supportedOrientations={['portrait', 'landscape']}
            >
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                    {
                        showHight ?
                            <View
                                style={{
                                    backgroundColor: '#fff',
                                    minWidth: 300,
                                    minHeight: 200,
                                    alignItems: 'center',
                                    padding: 20,
                                    borderRadius: 10
                                }}
                            >
                                <FlatList
                                    data={scores}
                                    renderItem={({ item }) => (
                                        <Text
                                            style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}
                                        >{item}</Text>
                                    )}
                                    keyExtractor={(item, index) => index.toString()}
                                />

                                <TouchableOpacity
                                    onPress={() => this.setState({ showHight: false })}
                                >
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Quay lại</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={{
                                backgroundColor: '#fff',
                                minWidth: 300,
                                minHeight: 200,
                                alignItems: 'center',
                                padding: 20,
                                borderRadius: 10
                            }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.changeState();
                                    }}
                                >
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Tiếp tục</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.showHightScore}
                                >
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Điểm cao</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.handlerBack}
                                >
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Thoát</Text>
                                </TouchableOpacity>
                            </View>
                    }
                </View>
            </Modal>
        );
    }
}

class ModalEndGame extends Component {

    state = {
        visible: false,
        data: {}
    }

    changeState = (e) => {
        if (!e) {
            this.setState({ visible: true });
            return;
        }
        this.setState({ visible: true, data: e.data });
    }

    close = () => {
        this.setState({ visible: false });
    }

    render() {
        const { visible, data } = this.state;
        return (
            visible ?
                <View style={{
                    width, height,
                    backgroundColor: 'rgba(0,0,0,.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    top: 0,
                    left: 0
                }
                } >
                    <View>
                        <Text style={{
                            color: '#FFF',
                            fontSize: 24,
                            fontWeight: 'bold',
                            marginVertical: 10
                        }}>{data?.top1}</Text>
                        <Text style={{
                            color: '#FFF',
                            fontSize: 20,
                            fontWeight: 'bold',
                            marginVertical: 10
                        }}>{data?.top2}</Text>
                        <TouchableOpacity
                            style={{
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingHorizontal: 20,
                                paddingVertical: 10,
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderColor: '#FFF',
                                marginTop: 20
                            }}
                            onPress={this.props.onExit}
                        >
                            <Text style={{ color: '#FFF', fontSize: 20 }}>Thoát</Text>
                        </TouchableOpacity>
                    </View>
                </View >
                :
                null
        );
    }
}