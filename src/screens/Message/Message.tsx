import { View, Text } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<any>;
};

const Message: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Text>Message</Text>
    </View>
  )
}

export default Message