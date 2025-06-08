// App.tsx
import React, { useState } from "react";
import { View } from "react-native";
import tw from "twrnc";
import SplashScreen from "./app/SplashScreen";
import MainScreen from "./app/MainScreen";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  return (
    <View style={tw`flex-1`}>
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <MainScreen />
      )}
    </View>
  );
}
