import React, { Component } from 'react';
import { View } from 'react-native';

export default class Bullet extends Component {
    render() {
        const x = this.props.position.x;
        const y = this.props.position.y;
        const size = this.props.size;
        const color = this.props.color;
        return (
            <View
                style={{
                    position: 'absolute',
                    top: y * size + 10,
                    left: x * size + 10,
                    width: size,
                    height: size,
                    backgroundColor: color,
                    zIndex: -1,
                    borderRadius: size,
                }}
            />
        );
    }
}