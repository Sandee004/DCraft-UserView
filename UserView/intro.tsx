import React, { useEffect, useRef, useState } from "react";
import { View, Text, Animated } from "react-native";
import tw from "twrnc";

export default function Intro() {
  const [storeName, setStoreName] = useState("");
  const [storeDescription, setStoreDescription] = useState("");
  const [isDataReady, setIsDataReady] = useState(false); // NEW

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const res = await fetch(
          "https://dcraft-backend.onrender.com/store-info",
        );
        const data = await res.json();

        setStoreName(data.store_name || "DCraftHouse");
        setStoreDescription(
          data.store_description || "Where comfort meets style",
        );
      } catch (error) {
        setStoreName("DCraftHouse");
        setStoreDescription("Where comfort meets style");
      } finally {
        setIsDataReady(true); // ✅ Trigger animation after data is set
      }
    };

    fetchStoreInfo();
  }, []);

  useEffect(() => {
    if (!isDataReady) return;

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
  }, [isDataReady]); // ✅ Only run when data is ready

  return (
    <View style={tw`flex-1 bg-blue-900 justify-center items-center`}>
      {isDataReady && (
        <Animated.View
          style={[
            tw`items-center`,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
            },
          ]}
        >
          <Text style={tw`text-white text-2xl opacity-80 mb-1`}>
            {storeName}
          </Text>
          <Text style={tw`text-white italic text-sm text-center opacity-80`}>
            {storeDescription}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}
