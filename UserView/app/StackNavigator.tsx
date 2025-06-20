import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import tw from "twrnc";
import HomeScreen from "./screens/HomeScreen";
import ProductDetails from "./screens/ProductDetails";

export type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  image?: string;
};

export type HomeStackParamList = {
  MainScreen: undefined;
  ProductDetails: { product: Product };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="MainScreen"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="MainScreen"
        component={HomeScreen}
        options={{
          headerShown: false, // Hide header since CustomHeader is used
        }}
      />

      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          headerShown: true,
          title: "Product Details",
          headerStyle: tw`bg-[#00008B]`,
          headerTitleStyle: tw`text-[#F8F8FF] text-lg font-bold`,
          headerTintColor: "#F8F8FF", // Back button color
        }}
      />
    </Stack.Navigator>
  );
}
