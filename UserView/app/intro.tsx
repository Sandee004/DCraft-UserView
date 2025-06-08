import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";

type RootStackParamList = {
  IntroScreen: undefined;
  AppNavigator: undefined;
  MainScreen: undefined;
};

const IntroScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate scale from 0 to 1
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      navigation.navigate("AppNavigator");
    }, 5000);

    return () => clearTimeout(timeout);
  }, [navigation, scaleAnim]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.text,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        Welcome to MyApp!
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
});

export default IntroScreen;
