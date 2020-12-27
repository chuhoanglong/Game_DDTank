import React, { Component } from 'react';
import { View, Image } from 'react-native';

export default class Bird extends Component {

    render() {
        const size = this.props.size;
        const x = this.props.position.x;
        const y = this.props.position.y;
        const rotate = this.props.rotate;
        return (
            <Image
                source={require('../assets/tank.png')}
                resizeMode={'contain'}
                style={{
                    position: 'absolute',
                    left: x * size,
                    top: y * size,
                    width: size,
                    height: size,
                    alignItems: 'center',
                    transform: [
                        {
                            rotate: rotate
                        }
                    ]
                }}
            />
        );
    }
}