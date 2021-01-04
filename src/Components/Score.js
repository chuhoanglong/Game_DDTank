import React, { Component } from 'react';
import { View, Text, } from 'react-native';

export default class Score extends Component {

    render() {
        const { score } = this.props;
        return (
            <View style={{ position: 'absolute', left: '50%' }}>
                <Text style={{ fontSize: 20, color: '#fff', marginTop: 10, fontWeight: 'bold' }}>{score}</Text>
            </View>
        )
    }

}