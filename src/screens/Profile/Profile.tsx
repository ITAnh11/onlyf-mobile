import { View, Text } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native';

type Props = {
  navigation: NavigationProp<any>;
};

const Profile: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Text>Profile</Text>
    </View>
  )
}

export default Profile