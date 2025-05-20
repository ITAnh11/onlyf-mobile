// navigation/NavigationContainer.tsx
import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Route from "./Route";
import { navigationRef } from "./NavigationService";
import * as Linking from 'expo-linking';
import { AppState, AppStateStatus } from "react-native";
import TokenService from "../services/token.service";
import { times } from "lodash";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

const handleUrl = async (url: string | null) => {
  if (!url) return;

  const refreshToken = await TokenService.getRefreshToken();
  console.log("Refresh token:", refreshToken);

  if (!refreshToken) {
    console.log("No refresh token found. Cannot handle deep link.");
    navigationRef.resetRoot({
      index: 0,
      routes: [{ name: "Splash" }],
    });
    return;
  }

  const { hostname, path, queryParams } = Linking.parse(url);

  // Nếu cần, bật log để debug
  console.log("Handling deep link URL:", url);
  console.log("Parsed path:", path);
  console.log("Parsed query params:", queryParams);
  console.log("Parsed hostname:", hostname);

  switch (hostname) {
    case "share-post":
      navigationRef.navigate("Home", {...queryParams , _ts: Date.now()});
      break;
    case "payment/success":
      navigationRef.resetRoot({
        index: 0,
        routes: [{ name: "Splash", params: { ...queryParams } }],
      });
      break;
    case "invite":
      navigationRef.navigate("Friend", {...queryParams });
      break;
    default:
      console.log("Unknown hostname:", hostname);
  }
}

const AppNavigator = () => {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const checkInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleUrl(initialUrl);
    };

    checkInitialUrl();

    const linkingSubscription = Linking.addEventListener("url", (event) => {
      handleUrl(event.url);
    });

    const appStateSubscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        Linking.getInitialURL().then(handleUrl);
      }
      appState.current = nextAppState;
    });

    return () => {
      linkingSubscription.remove();
      appStateSubscription.remove();
    };
  }, []);

  return (
    <NavigationContainer 
    ref={navigationRef} 
    // linking={linking}
    >
      <Route />
    </NavigationContainer>
    
  );
};

export default AppNavigator;
