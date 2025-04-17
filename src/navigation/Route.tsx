import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from '../screens/Splash';
import Home from '../screens/Home';
import Login from '../screens/Login';
import Welcome from '../screens/Welcome';
import Register from '../screens/Register';
import { createStackNavigator } from '@react-navigation/stack';
import Message from '../screens/Message';
import Friend from '../screens/Friend';
import ProfileNavigator from '../screens/Profile/ProfileNavigation/ProfileNavigationContainer';
import Activate from '../screens/Activate';
import ForgotPassword from '../screens/ForgotPassword';
import ConfirmOtp from '../screens/ConfirmOtp';
import ResetPassword from '../screens/ResetPassword/ResetPassword';

const Stack = createStackNavigator();

const Route = () => {
    return (
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} /> 
            <Stack.Screen name="Activate" component={Activate} /> 
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Message" component={Message} />
            <Stack.Screen name="Friend" component={Friend} />
            <Stack.Screen name="Profile" component={ProfileNavigator} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="ConfirmOtp" component={ConfirmOtp} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </Stack.Navigator>
    );
}

export default Route;