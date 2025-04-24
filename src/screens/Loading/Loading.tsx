import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { connect } from 'socket.io-client';
import { connectSocket } from '../../utils/test';
import { NavigationProp, useNavigation } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<any>;
};

const Loading: React.FC<Props> = ({ navigation }) => {
    connectSocket();
    navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }], 
    });
    return (
        <View>
            <Text>Loading...</Text>
        </View>
    );
    }

export default Loading;
