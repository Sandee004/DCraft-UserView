import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
//import { NavigationContainer } from "@react-navigation/native";
import { View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import tw from "twrnc";
import StackNavigator from "./StackNavigator";
import CartScreen from "./screens/CartScreen";
import ProfileScreen from "./screens/ProfileScreen";
import { CartProvider } from "./context/CartContext";

const Tab = createBottomTabNavigator();

function CustomHeader() {
  return (
    <View style={tw`bg-[#000080] py-4 px-4 text-center items-center`}>
      <Text style={tw`text-white text-xl font-bold`}>DCraftHouse</Text>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <>
      <CustomHeader />
      <CartProvider>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: "home" | "shopping-cart" | "user" | "cog" = "home";

              if (route.name === "Home") {
                iconName = "home";
              } else if (route.name === "Cart") {
                iconName = "shopping-cart";
              } else if (route.name === "Profile") {
                iconName = "user";
              } else if (route.name === "Settings") {
                iconName = "cog";
              }

              return (
                <FontAwesome
                  name={iconName}
                  size={size}
                  color={focused ? "#B0E0E6" : "#F5F5F5"}
                />
              );
            },
            tabBarActiveTintColor: "#B0E0E6",
            tabBarInactiveTintColor: "#F5F5F5",
            tabBarStyle: tw`bg-[#000080] pb-4 h-14`,
            headerShown: true,
          })}
        >
          <Tab.Screen
            name="Home"
            component={StackNavigator}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Cart"
            component={CartScreen}
            options={{
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              headerShown: false,
            }}
          />
        </Tab.Navigator>
      </CartProvider>
    </>
  );
}
