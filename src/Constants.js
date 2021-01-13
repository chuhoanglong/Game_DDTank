import { Dimensions } from 'react-native';
import Sound from 'react-native-sound';

const width = 667;
const height = 375
const GRID_SIZE = 50;
const SPEED = 0.05;
const BULLET_SIZE = 40;
const randomEnemy = (max, min) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const randomColor = () => {
    const index = Math.floor(Math.random() * 26 / 5);
    const colors = ['rgb(3,169,244)', 'rgb(0,255,78)', 'red', 'blue', 'black', 'yellow'];
    return colors[index];
}

const randomRotate = () => {
    const index = Math.floor(Math.random() * 13 / 4);
    const colors = ['0deg', '90deg', '180deg', '270deg'];
    return colors[index];
}

const playSound = async (type) => {
    let soundFile = null;
    switch (type) {
        case 'bullet1':
            soundFile = require('./assets/enemy-gun-2.mp3');
            break;
        case 'bullet':
            soundFile = require('./assets/flame-gun.mp3');
            break;
        case 'explosion':
            soundFile = require('./assets/base-explosion.mp3');
            break;
        case 'enemy':
            soundFile = require('./assets/enemy-gun-2.mp3');
            break;
        default:
            soundFile = null;
            break;
    }

    var sound = new Sound(soundFile, (error) => {
        if (error) {
            console.log('failed to load the sound', error);
            return;
        }

        sound.play((success) => {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
            }
        });
    });
};

export default constants = {
    MAX_WIDTH: width,
    MAX_HEIGHT: height,
    GRID_SIZE,
    BULLET_SIZE,
    ENEMY_SIZE: GRID_SIZE,
    SPEED,
    randomRotate,
    randomEnemy,
    randomColor,
    playSound,
}