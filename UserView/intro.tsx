import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import tw from "twrnc";

export default function Intro() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  });

  return (
    <View style={tw`flex-1 bg-blue-900 justify-center items-center`}>
      <Animated.View
        style={[
          tw`items-center`,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
          },
        ]}
      >
        <Text style={tw`text-white text-2xl opacity-80 mb-1`}>DCraftHouse</Text>
        <Text style={tw`text-white italic text-sm text-center opacity-80`}>
          Where comfort meets style
        </Text>
      </Animated.View>
    </View>
  );
}
