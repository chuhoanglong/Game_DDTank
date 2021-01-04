import React, { Component } from 'react';
import { View, Image } from 'react-native';

export default class Bullet extends Component {
    render() {
        const x = this.props.position.x;
        const y = this.props.position.y;
        const size = this.props.size;
        return (
            <Image
                style={{
                    position: 'absolute',
                    top: y * size + 5,
                    left: x * size + 5,
                    width: size,
                    height: size,
                    zIndex: -1,
                }}
                source={require('../assets/bullet.png')}
                resizeMode={'contain'}
            />
        );
    }
}