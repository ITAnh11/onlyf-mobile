import { View, Text } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<any>;
};

const Friend: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Text>Friend</Text>
    </View>
  )
}

export default Friend