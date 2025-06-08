import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import tw, { style } from "twrnc";
import HomeScreen from "./HomeScreen";
import SettingsScreen from "./Settings";

export type RootStackParamList = {
  MainScreen: undefined;
  MovieDetailScreen: { movie: any };
  ProfileScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainScreen"
        component={HomeScreen}
        options={{
          title: "Home",
          headerShown: true,
          headerStyle: tw`bg-white`,
          headerTitleStyle: style("text-[22px]"),
        }}
      />

      <Stack.Screen
        name="ProfileScreen"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: "Profile",
        }}
      />
    </Stack.Navigator>
  );
}
