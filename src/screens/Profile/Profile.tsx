import { View, Text } from 'react-native'
import React from 'react'
import { NavigationProp } from '@react-navigation/native';
import { useState, useEffect} from 'react';
import ProfileService from '../../services/profile.service';

type Props = {
  navigation: NavigationProp<any>;
};


const Profile: React.FC<Props> = ({ navigation }) => {

const [name, setName] = useState<string | null>(null);

function getName()
{
  ProfileService.getName()
    .then((name) => {
      setName(name);
    })
    .catch((error) => {
      console.error("Error fetching name:", error);
    });
  console.log("Name:", name);
}
useEffect(() => {
  getName();
})

  return (
    
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{name}</Text>
    </View>
  )
}

export default Profile