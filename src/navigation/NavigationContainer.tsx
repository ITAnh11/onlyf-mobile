// navigation/NavigationContainer.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Route from "./Route";
import { navigationRef } from "./NavigationService";
import * as Linking from 'expo-linking';
import FCM from "../services/fcm";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const linking = {
  prefixes: ['onlyf-mobile://', API_URL],
  config: {
    screens: {
      Splash: '/payment/success',
      Payment: '/payment/cancel',
      Home: '/share/post',
      Friend: '/invite',
    },
  },
};


const AppNavigator = () => { 
  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onReady={() => {
        if (navigationRef.current) {
          FCM.setNavigation(navigationRef.current);
          FCM.handlePendingNotificationIfAny(); 
        }
      }}
    >
      <Route />
    </NavigationContainer>
    
  );
};

export default AppNavigator;
