import React, { Component } from 'react';
import { View, Image } from 'react-native';

export default class Enemy extends Component {

    render() {
        const { x, y } = this.props.position;
        const {
            size,
            rotate,
            isLiving,
        } = this.props;
        return (
            isLiving ?
                <Image
                    source={require('../assets/enemy.png')}
                    style={{
                        position: 'absolute',
                        top: y * size,
                        left: x * size,
                        width: size,
                        height: size,
                        transform: [{ rotate: `${rotate}deg` }]
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