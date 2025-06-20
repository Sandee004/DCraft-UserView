import React from "react";
import { Text, View } from "react-native";
import tw from "twrnc";

//const TMDB_API_KEY = "ceba03f56c18f997a242eb118d552605";

export default function CartScreen() {
  return (
    <View style={tw`flex-1 justify-center items-center p-5`}>
      <Text style={tw`text-3xl font-bold text-gray-800 mb-5`}>Cart</Text>
      <Text style={tw`text-lg text-gray-600 text-center leading-6`}>
        Welcome to the Cart Screen!
      </Text>
    </View>
  );
}
