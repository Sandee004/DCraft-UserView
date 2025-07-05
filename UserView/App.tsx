// App.tsx
import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { NavigationContainer } from "@react-navigation/native";
import { CartProvider } from "./app/context/CartContext";
import IntroScreen from "./app/intro";

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51PQdk1GffRZyPIl7uLO0QILgrg4PR91b8XZnwbj0oCYLvi2cCnMOIhGl4gQTDRusI9hSitR7Fm0p9U3DxxQW7kuk00EQAhudED">
      <CartProvider>
        <NavigationContainer>
          <IntroScreen />
        </NavigationContainer>
      </CartProvider>
    </StripeProvider>
  );
}
