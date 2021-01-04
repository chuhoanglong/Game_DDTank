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
import Physics from './System/Physics';
import RNGamePad from 'react-native-game-pad';
import Bullet from './Components/Bullet';
import Enemy from './Components/Enemy';
import Sound from 'react-native-sound';
import Score from './Components/Score';
import AsyncStore from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');

export default class App extends Component {

    constructor(props) {
        super(props);
        this.boardSize = Constants.GRID_SIZE * Constants.CELL_SIZE;
        this.refGameEngine = null;
        this.state = {
            running: true,
            visible: false
        };
        this.sound = null;
        this.entities = this.setUpEntities();
    }


    componentDidMount() {
        // console.log('Constants.MAX_HEIGHT', Constants.MAX_HEIGHT);
        // console.log('Constants.MAX_WIDTH', Constants.MAX_WIDTH);
        // this.playSound();
    }

    setUpEntities = () => {

        let engine = Matter.Engine.create({ enableSleeping: false });
        let world = engine.world;

        const positionTank = {
            x: Constants.MAX_WIDTH / Constants.GRID_SIZE / 2,
            y: Constants.MAX_HEIGHT / Constants.GRID_SIZE / 2
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
        Matter.World.add(world, [tank]);

        return {
            physics: { engine, world },
            Tank: {
                body: tank,
                position: positionTank, // vi tri ban dau cua bird
                size: Constants.GRID_SIZE, // kich thuoc cua bird
                color: 'red', // mau cua bird
                speed: 0.09, // toc do bird di chuyen.
                rotate: 0,
                isLiving: true,
                updateFrequency: 10,// tan so cap nhat
                nextMove: 10,// khoang cach di chuyen khi nhan button di chuyen
                renderer: <Tank />,// ve con bird
            },
            Bullet: {
                position: {
                    x: Constants.MAX_WIDTH / Constants.BULLET_SIZE / 2,
                    y: Constants.MAX_HEIGHT / Constants.BULLET_SIZE / 2
                },
                size: Constants.BULLET_SIZE,
                speed: 0.6, // toc do Bullet di chuyen.
                renderer: <Bullet />, // ve con Bullet
            },
            Bullet1: {
                position: {
                    x: Constants.MAX_WIDTH / Constants.BULLET_SIZE / 2,
                    y: Constants.MAX_HEIGHT / Constants.BULLET_SIZE / 2
                },
                size: Constants.BULLET_SIZE,
                speed: 1, // toc do Bullet di chuyen.
                renderer: <Bullet />,// ve con Bullet
            },
            Enemy: {
                position: {
                    x: Constants.randomEnemy(1, Constants.MAX_WIDTH / Constants.ENEMY_SIZE - 1),
                    y: Constants.randomEnemy(1, Constants.MAX_HEIGHT / Constants.ENEMY_SIZE - 1),
                },
                size: Constants.ENEMY_SIZE,
                speed: 0.3,
                isLiving: true,
                rotate: Constants.randomRotate(),
                renderer: <Enemy />
            },
            // Enemy1: {
            //     position: {
            //         x: Constants.randomEnemy(0, Constants.MAX_WIDTH / Constants.ENEMY_SIZE),
            //         y: Constants.randomEnemy(0, Constants.MAX_HEIGHT / Constants.ENEMY_SIZE),
            //     },
            //     size: Constants.ENEMY_SIZE,
            //     color: Constants.randomColor(),
            //     speed: 0.3,
            //     radius: Constants.randomEnemy(0, Constants.ENEMY_SIZE),
            //     isLiving: true,
            //     renderer: <Enemy />
            // },
            // Enemy2: {
            //     position: {
            //         x: Constants.randomEnemy(0, Constants.MAX_WIDTH / Constants.ENEMY_SIZE),
            //         y: Constants.randomEnemy(0, Constants.MAX_HEIGHT / Constants.ENEMY_SIZE),
            //     },
            //     size: Constants.ENEMY_SIZE,
            //     color: Constants.randomColor(),
            //     speed: 0.3,
            //     radius: Constants.randomEnemy(0, Constants.ENEMY_SIZE),
            //     isLiving: true,
            //     renderer: <Enemy />
            // },
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
            Score: {
                score: 0,
                renderer: <Score />
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
    }

    onEvent = async e => {
        if (e.type == 'game-over') {
            Alert.alert('Game Over', null, [
                {
                    text: 'Chơi lại',
                    // onPress: this.playSound
                }
            ]);
            let score_save = await AsyncStore.getItem('score_tank');
            if (score_save) {
                score_save = JSON.parse(score_save);
                score_save.push(e.data.score);
                score_save = score_save.filter(function (item, pos, self) {
                    return self.indexOf(item) == pos;
                });
                score_save.sort((a, b) => b - a);
            } else {
                score_save = [e.data.score];
            }
            AsyncStore.setItem('score_tank', JSON.stringify(score_save));
            this.sound?.pause();
            this.setState({ running: false });
        }
    }

    onDirUp = () => {
        const { running } = this.state;
        if (!running) {
            this.setState({ running: true });
        }
        this.refGameEngine.dispatch({ type: 'move-up' });
    }

    onDirDown = () => {
        const { running } = this.state;
        if (!running) {
            this.setState({ running: true });
        }
        this.refGameEngine.dispatch({ type: 'move-down' });
    }

    onDirLeft = () => {
        const { running } = this.state;
        if (!running) {
            this.setState({ running: true });
        }
        this.refGameEngine.dispatch({ type: 'move-left' });
    }

    onDirRight = () => {
        const { running } = this.state;
        if (!running) {
            this.setState({ running: true });
        }
        this.refGameEngine.dispatch({ type: 'move-right' });
    }

    onPressA = () => {
        this.refGameEngine.dispatch({ type: 'bullet-shoot' });
        Constants.playSound('bullet');
    }

    onPressB = () => {
        this.refGameEngine.dispatch({ type: 'bullet-shoot1' });
        Constants.playSound('bullet1');
    }

    onEnd = () => {
        this.refGameEngine.dispatch({ type: 'end' });
    }

    onResumed = () => {
        this.setState({ running: true });
    }

    onPause = () => {
        this.setState({ running: false });
    }

    render() {
        const { running, visible } = this.state;
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
                                <TouchableOpacity>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Thoát</Text>
                                </TouchableOpacity>
                            </View>
                    }
                </View>
            </Modal>
        );
    }
}