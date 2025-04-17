import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../Profile';
import EditName from '../ProfileComponents/EditName'; 
import CameraScreen from '../ProfileComponents/CameraScreen';
import EditUserName from '../ProfileComponents/EditUserName';
import LoggedDevices from '../ProfileComponents/LoggedDevices';

const Stack = createStackNavigator();

const ProfileNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="ProfileScreen">
      <Stack.Screen name="ProfileScreen" component={Profile} options={{ headerShown: false }} />
      <Stack.Screen name="EditName" component={EditName} options={{ headerShown: false }} />
      <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
      <Stack.Screen name="EditUserName" component={EditUserName} options={{ headerShown: false }} />
      <Stack.Screen name="LoggedDevices" component={LoggedDevices} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default ProfileNavigator;