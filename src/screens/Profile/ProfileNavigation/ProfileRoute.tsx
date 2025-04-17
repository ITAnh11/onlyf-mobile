import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../Profile';
import EditName from '../ProfileComponents/EditName'; 
import CameraScreen from '../ProfileComponents/CameraScreen';
import EditUserName from '../ProfileComponents/EditUserName';
import LoggedDevices from '../ProfileComponents/LoggedDevices';
import ChangePassword from '../ProfileComponents/ChangePassword';

const Stack = createStackNavigator();

const ProfileRoute = () => {
    return (
        <Stack.Navigator initialRouteName="Profile" screenOptions={{ headerShown: false }}>           
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="EditName" component={EditName} />
            <Stack.Screen name="CameraScreen" component={CameraScreen} />
            <Stack.Screen name="EditUserName" component={EditUserName} />
            <Stack.Screen name="LoggedDevices" component={LoggedDevices} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
        </Stack.Navigator>
    );
}

export default ProfileRoute;