// navigation/NavigationContainer.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Route from "./Route";

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Route />
    </NavigationContainer>
  );
};

export default AppNavigator;
