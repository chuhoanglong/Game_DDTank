import React, { Component } from 'react';
import { View, Image } from 'react-native';

export default class Tank extends Component {

    render() {
        const size = this.props.size;
        const x = this.props.body.position.x;
        const y = this.props.body.position.y;
        const rotate = this.props.rotate;
        const isLiving = this.props.isLiving;
        return (
            isLiving ? <Image
                source={require('../assets/tank.png')}
                resizeMode={'contain'}
                style={{
                    position: 'absolute',
                    left: x * size,
                    top: y * size,
                    width: size,
                    height: size,
                    alignItems: 'center',
                    transform: [{ rotate: rotate + 'deg' }]
                }
                }
            />
                :
                <Image
                    source={require('../assets/explosion.gif')}
                    resizeMode={'contain'}
                    style={{
                        position: 'absolute',
                        top: y * size,
                        left: x * size,
                        width: 80,
                        height: 80,
                    }} />
        );
    }
}