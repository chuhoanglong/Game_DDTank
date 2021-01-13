import React, { Component } from 'react';
import { View, Image } from 'react-native';

export default class Bullet extends Component {
    render() {
        const x = this.props.position.x;
        const y = this.props.position.y;
        const size = this.props.size;
        const display = this.props.display;
        return (
            <Image
                style={{
                    position: 'absolute',
                    top: y * size,
                    left: x * size,
                    width: size,
                    height: size,
                    zIndex: -1,
                    display: display ? null : 'none'
                }}
                source={require('../assets/bullet.png')}
                resizeMode={'contain'}
            />
        );
    }
}