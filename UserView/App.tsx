// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import IntroScreen from "./app/intro";

export default function App() {
  return (
    <NavigationContainer>
      <IntroScreen />
    </NavigationContainer>
  );
}
