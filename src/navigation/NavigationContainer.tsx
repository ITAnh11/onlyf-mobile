// navigation/NavigationContainer.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Route from "./Route";
import { navigationRef } from "./NavigationService";

const AppNavigator = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Route />
    </NavigationContainer>
  );
};

export default AppNavigator;
