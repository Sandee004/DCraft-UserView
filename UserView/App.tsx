// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { CartProvider } from "./app/context/CartContext"; // <-- Import your CartProvider
import IntroScreen from "./app/intro";

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <IntroScreen />
      </NavigationContainer>
    </CartProvider>
  );
}
