import React, { Component } from 'react';
import { Image } from 'react-native';

export default class Enemy extends Component {

    render() {
        const { x, y } = this.props.body.position;
        const {
            size,
            rotate = 0,
            isLiving,
        } = this.props;
        return (
            isLiving ?
                <Image
                    source={require('../assets/enemy.png')}
                    style={{
                        position: 'absolute',
                        left: x * size,
                        top: y * size,
                        width: size,
                        height: size,
                        alignItems: 'center',
                        transform: [{ rotate: rotate + 'deg' }]
                    }}
                    resizeMode={'contain'}
                />
                :
                <Image
                    source={require('../assets/explosive.gif')}
                    resizeMode={'contain'}
                    style={{
                        position: 'absolute',
                        top: y * size,
                        left: x * size,
                        width: size,
                        height: size,
                    }} />
        );
    }
}