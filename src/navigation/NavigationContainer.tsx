import React, { useEffect, useRef, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Route from "./Route";
import { navigationRef } from "./NavigationService";
import * as Linking from 'expo-linking';
import { AppState, AppStateStatus, View, ActivityIndicator } from "react-native";
import TokenService from "../services/token.service";

const AppNavigator = () => {
  const [initialNavState, setInitialNavState] = useState<any>(undefined);
  const [isReady, setIsReady] = useState(false); // Đánh dấu đã load xong initial state
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const getInitialStateFromUrl = async () => {
      const url = await Linking.getInitialURL();

      const refreshToken = await TokenService.getRefreshToken();

      if (!refreshToken) {
        setInitialNavState({
          index: 0,
          routes: [{ name: "Splash" }],
        });
        setIsReady(true);
        return;
      }

      if (!url) {
        // Nếu ko có URL thì đi màn mặc định, ví dụ Home
        setInitialNavState({
          index: 0,
          routes: [{ name: "Home" }],
        });
        setIsReady(true);
        return;
      }

      const { hostname, queryParams } = Linking.parse(url);

      switch (hostname) {
        case "share-post":
          setInitialNavState({
            index: 0,
            routes: [{ name: "Home", params: { ...queryParams, _ts: Date.now() } }],
          });
          break;
        case "payment/success":
          setInitialNavState({
            index: 0,
            routes: [{ name: "Splash", params: { ...queryParams } }],
          });
          break;
        case "invite":
          setInitialNavState({
            index: 0,
            routes: [{ name: "Friend", params: { ...queryParams } }],
          });
          break;
        default:
          setInitialNavState({
            index: 0,
            routes: [{ name: "Home" }],
          });
          break;
      }

      setIsReady(true); // Đánh dấu đã load xong
    };

    getInitialStateFromUrl();

    const linkingSubscription = Linking.addEventListener("url", (event) => {
      if (navigationRef.isReady()) {
        const { hostname, queryParams } = Linking.parse(event.url);
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
            navigationRef.resetRoot({
              index: 0,
              routes: [{ name: "Friend", params: { ...queryParams } }],
            });
            break;
        }
      }
    });

    const appStateSubscription = AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;
    });

    return () => {
      linkingSubscription.remove();
      appStateSubscription.remove();
    };
  }, []);

  if (!isReady) {
    // Hiển thị loading hoặc null trong khi chờ initialNavState
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      initialState={initialNavState}
      onReady={() => {
        // Khi navigation sẵn sàng, bạn có thể set thêm logic nếu muốn
      }}
    >
      <Route />
    </NavigationContainer>
  );
};

export default AppNavigator;
