import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CartScreen from "./screens/CartScreen";
import PaymentScreen from "./screens/PaymentScreen";

export type CartStackParamList = {
  CartScreen: undefined;
  PaymentScreen: { total: number };
};

const Stack = createNativeStackNavigator<CartStackParamList>();

export default function CartScreenNav() {
  return (
    <Stack.Navigator
      initialRouteName="CartScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="CartScreen"
        component={CartScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
