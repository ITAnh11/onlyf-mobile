import React from 'react';
import { Provider } from 'react-redux';
import PostStore from './src/screens/Home/Global/PostStore'; // Import PostStore
import AppNavigator from './src/navigation/NavigationContainer';
import { StyleSheet, Text, View, StatusBar, Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import NotificationApi from './src/networking/notification.api';

export default function App() {
  return (
    <Provider store={PostStore}>
      <AppNavigator />
    </Provider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});



