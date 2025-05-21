import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Route from "./Route";
import { navigationRef } from "./NavigationService";
import * as Linking from 'expo-linking';
import { AppState, AppStateStatus } from "react-native";
import TokenService from "../services/token.service";

const AppNavigator = () => {
  const [isNavReady, setIsNavReady] = useState(false);
  const [handledInitialUrl, setHandledInitialUrl] = useState(false);
  const appState = useRef<string>(AppState.currentState); // 👈 fix type

  const handleUrl = async (url: string | null, isInitial = false) => {
    if (!url || !navigationRef.isReady()) return;

    const refreshToken = await TokenService.getRefreshToken();
    if (!refreshToken) {
      navigationRef.resetRoot({
        index: 0,
        routes: [{ name: "Splash" }],
      });
      return;
    }

    const { hostname, queryParams } = Linking.parse(url);

    console.log("Parsed URL:", { hostname, queryParams });
    console.log("AppState:", appState.current);
    console.log("Handled Initial URL:", handledInitialUrl);

    switch (hostname) {
      case "share-post":
        navigationRef.navigate("Home", { ...queryParams, _ts: Date.now() });
        break;
      case "payment/success":
        navigationRef.resetRoot({
          index: 0,
          routes: [{ name: "Splash", params: { ...queryParams } }],
        });
        break;
      case "invite":
        navigationRef.navigate("Friend", { ...queryParams });
        break;
    }

    if (isInitial) {
      setHandledInitialUrl(true);
    }
  };

  useEffect(() => {
    const linkingSubscription = Linking.addEventListener("url", (event) => {
      handleUrl(event.url);
    });

    const appStateSubscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === "active") {
        if (!handledInitialUrl) {
          Linking.getInitialURL().then((url) => {
            if (url) handleUrl(url, true);
          });
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      linkingSubscription.remove();
      appStateSubscription.remove();
    };
  }, [isNavReady, handledInitialUrl]);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        setIsNavReady(true);
      }}
    >
      <Route />
    </NavigationContainer>
  );
};

export default AppNavigator;
