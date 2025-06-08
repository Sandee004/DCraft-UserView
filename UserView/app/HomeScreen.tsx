import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";

const HomeScreen = () => {
  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <Text style={tw`text-3xl font-bold text-gray-800 mb-5`}>Home</Text>
      <Text style={tw`text-lg text-gray-600 text-center leading-6`}>
        Welcome to the Home screen!
      </Text>
    </View>
  );
};

export default HomeScreen;
