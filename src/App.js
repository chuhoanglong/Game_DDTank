import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Alert
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Bird from './Components/Bird';
import Constants from './Constants';
import GameLoop from './System/GameLoop';
import RNGamePad from 'react-native-game-pad';
import Bullet from './Components/Bullet';
import Enemy from './Components/Enemy';
import Sound from 'react-native-sound';

export default class App extends Component {

    constructor(props) {
        super(props);
        this.boardSize = Constants.GRID_SIZE * Constants.CELL_SIZE;
        this.refGameEngine = null;
        this.state = {
            running: true,
        };
        this.sound = null;
    }


    componentDidMount() {
        // console.log('Constants.MAX_HEIGHT', Constants.MAX_HEIGHT);
        // console.log('Constants.MAX_WIDTH', Constants.MAX_WIDTH);
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

    onEvent = e => {
        if (e.type == 'game-over') {
            Alert.alert('Game Over', null, [
                { text: 'Chơi lại', onPress: this.playSound }
            ]);
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
                        entities={{
                            Bird: {
                                position: {
                                    x: Constants.MAX_WIDTH / Constants.GRID_SIZE / 2,
                                    y: Constants.MAX_HEIGHT / Constants.GRID_SIZE / 2
                                }, // vi tri ban dau cua bird
                                size: Constants.GRID_SIZE, // kich thuoc cua bird
                                color: 'red', // mau cua bird
                                speed: 0.05, // toc do bird di chuyen.
                                rotate: '0deg',
                                updateFrequency: 10,// tan so cap nhat
                                nextMove: 10,// khoang cach di chuyen khi nhan button di chuyen
                                renderer: <Bird /> // ve con bird
                            },

                            Bullet: {
                                position: {
                                    x: Constants.MAX_WIDTH / Constants.BULLET_SIZE / 2,
                                    y: Constants.MAX_HEIGHT / Constants.BULLET_SIZE / 2
                                },
                                size: Constants.BULLET_SIZE,
                                color: 'rgb(0,255,78)', // mau cua Bullet
                                speed: 0.6, // toc do Bullet di chuyen.
                                renderer: <Bullet />, // ve con Bullet
                            },
                            Bullet1: {
                                position: {
                                    x: Constants.MAX_WIDTH / Constants.BULLET_SIZE / 2,
                                    y: Constants.MAX_HEIGHT / Constants.BULLET_SIZE / 2
                                },
                                size: Constants.BULLET_SIZE,
                                color: 'rgb(3,169,244)', // mau cua Bullet
                                speed: 1, // toc do Bullet di chuyen.
                                renderer: <Bullet />,// ve con Bullet
                            },
                            Enemy: {
                                position: {
                                    x: Constants.randomEnemy(0, Constants.MAX_WIDTH / Constants.ENEMY_SIZE),
                                    y: Constants.randomEnemy(0, Constants.MAX_HEIGHT / Constants.ENEMY_SIZE),
                                },
                                size: Constants.ENEMY_SIZE,
                                speed: 0.3,
                                isLiving: true,
                                rotate: Constants.randomEnemy(0, 360),
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
                                    dualJoystick={false}
                                    buttonAColor='rgba(0,255,78,0.5)'
                                    buttonBColor='rgba(3,169,244,0.5)'
                                    options={{
                                        size: 300,
                                        color: "rgba(0,0,0,0.2)",
                                    }}
                                />
                            }
                        }}
                        systems={[GameLoop]}
                        onEvent={this.onEvent}
                        running={running}
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
    }
})