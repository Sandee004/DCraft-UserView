import { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import Intro from "../intro";
import { CartProvider } from "../components/CartContext";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "twrnc";

export default function Layout() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <CartProvider>
      <SafeAreaView
        style={tw`flex-1 bg-white`}
        edges={["top", "left", "right"]}
      >
        {showIntro ? (
          <Intro />
        ) : (
          <Tabs
            screenOptions={{
              tabBarActiveTintColor: "#B0E0E6",
              tabBarInactiveTintColor: "#F5F5F5",
              tabBarStyle: tw`bg-[#000080]`,
            }}
          >
            <Tabs.Screen
              name="home"
              options={{
                title: "Home",
                headerShown: false, // keep false to prevent native header
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome name="home" color={color} size={size} />
                ),
              }}
            />
            <Tabs.Screen
              name="cart"
              options={{
                title: "Cart",
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome name="shopping-cart" color={color} size={size} />
                ),
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: "Profile",
                headerShown: false,
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome name="user" color={color} size={size} />
                ),
              }}
            />
          </Tabs>
        )}
      </SafeAreaView>
    </CartProvider>
  );
}
