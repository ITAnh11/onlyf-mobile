import React, { useEffect, useRef } from "react";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import Route from "./Route";
import { navigationRef } from "./NavigationService";
import * as Linking from 'expo-linking';
import TokenService from "../services/token.service";
import apiClient from "../networking/apiclient";

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
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url) {
      const isAuthenticated = await checkLogin();
      if (!isAuthenticated) {
        return 'onlyf-mobile://Splash'; 
      }
    }
    return url;
  },
  subscribe(listener: any) {
    const onReceiveURL = async ({ url }: { url: string }) => {
      const isAuthenticated = await checkLogin();
      if (!isAuthenticated) {
        listener('onlyf-mobile://Splash'); 
        return;
      }
      listener(url);
    };

    const subscription = Linking.addEventListener('url', onReceiveURL);
    return () => subscription.remove();
  }
};

const checkLogin = async () => {
  const token = await TokenService.getRefreshToken();
  if (!token) {
    return false;
  }
  const response = await apiClient.get(`${API_URL}/auth/is-logged-in`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.data;
  return data.isLoggedIn;
};

const AppNavigator = () => { 
  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <Route />
    </NavigationContainer>
  );
};

export default AppNavigator;
