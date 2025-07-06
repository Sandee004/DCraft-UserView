import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Text,
  View,
  Alert,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import tw from "twrnc";
import { useCart } from "../../components/CartContext";
import Orders from "./Orders";
import Profile from "./Profile";

interface User {
  username: string;
  email: string;
  phone?: string;
  profile_picture?: string;
}

interface Order {
  id: string;
  title: string;
  price: number;
  status: string;
  date: string;
}

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [profilePic] = useState<string | null>(user?.profile_picture || null);
  const { loadUserCart, clearUserCart } = useCart();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setUsername(parsedUser.username);
          setEmail(parsedUser.email);
          setPhone(parsedUser.phone || "");
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    if (user && activeTab === "orders") {
      loadOrders();
    }
  }, [user, activeTab]);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.log("No token found, cannot load orders");
        return;
      }

      const response = await fetch(
        "https://dcraft-backend.onrender.com/api/orders",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log("Orders: ", data);
      if (response.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    const initCart = async () => {
      if (user) {
        try {
          await loadUserCart(); // Fetch cart items from the backend
        } catch (error) {
          console.error("Error loading user cart:", error);
        }
      }
    };
    initCart();
  }, [user, loadUserCart]);

  const handleSignUp = async () => {
    if (!username || !email) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);

    try {
      const body = JSON.stringify({ username, email, phone: phone || "" });
      console.log("Request Body:", body);

      const response = await fetch(
        "https://dcraft-backend.onrender.com/api/auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body,
        }
      );

      const data = await response.json();
      console.log("Response Data:", data);

      if (response.ok) {
        await AsyncStorage.setItem(
          "user",
          JSON.stringify({ username, email, phone })
        );
        await AsyncStorage.setItem("token", data.access_token);
        setUser({ username, email, phone });
        await loadUserCart();
        Alert.alert("Success", data.message || "Signed up successfully");
      } else {
        Alert.alert("Error", data.message || "Failed to sign up");
      }
    } catch (error) {
      console.error("Sign up failed", error);
      Alert.alert("Error", "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    if (!username || !email) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      if (!token) {
        Alert.alert("Error", "Pls sign up and try again");
        return;
      }

      const response = await fetch(
        "https://dcraft-backend.onrender.com/api/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, email, phone }),
        }
      );

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        const updatedUser = { username, email, phone };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setIsEditing(false);
        Alert.alert("Success", "Details updated successfully");
      } else {
        Alert.alert("Error", data.message || "Failed to update details");
      }
    } catch (error) {
      console.error("Update failed", error);
      Alert.alert("Error", "Failed to update details");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await clearUserCart();
    await AsyncStorage.removeItem("user");
    await AsyncStorage.removeItem("token");
    setUser(null);
    setActiveTab("profile");
  };

  const renderTabs = () => (
    <View style={tw`flex-row bg-gray-100 rounded-lg mb-6 p-1`}>
      <TouchableOpacity
        style={tw`flex-1 py-3 rounded-md ${
          activeTab === "profile" ? "bg-white shadow-sm" : ""
        }`}
        onPress={() => setActiveTab("profile")}
      >
        <Text
          style={tw`text-center font-medium ${
            activeTab === "profile" ? "text-[#000080]" : "text-gray-600"
          }`}
        >
          Profile
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`flex-1 py-3 rounded-md ${
          activeTab === "orders" ? "bg-white shadow-sm" : ""
        }`}
        onPress={() => setActiveTab("orders")}
      >
        <Text
          style={tw`text-center font-medium ${
            activeTab === "orders" ? "text-[#000080]" : "text-gray-600"
          }`}
        >
          Orders
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (!user) {
    return (
      <View style={tw`flex-1 items-center bg-white p-6`}>
        <Text style={tw`text-black text-2xl font-bold mb-4`}>
          Sign Up/Login
        </Text>
        <TextInput
          style={tw`w-full bg-white text-black border border-[#000080] px-4 py-3 rounded-md mb-3`}
          placeholder="Username"
          placeholderTextColor="gray"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={tw`w-full bg-white text-black border border-[#000080] px-4 py-3 rounded-md mb-3`}
          placeholder="Email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={tw`w-full bg-white text-black border border-[#000080] px-4 py-3 rounded-md mb-3`}
          placeholder="Phone (Optional)"
          placeholderTextColor="gray"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <TouchableOpacity
          style={tw`w-full items-center py-3 mt-6 rounded-md ${
            loading ? "bg-gray-400" : "bg-[#000080]"
          }`}
          onPress={handleSignUp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={tw`text-white text-lg`}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`bg-[#000080] py-4 px-5`}>
        <Text style={tw`text-white text-xl font-bold`}>Profile</Text>
      </View>

      <View style={tw`flex-1 bg-white p-6`}>
        {renderTabs()}
        <View style={tw`flex-1 items-center`}>
          {activeTab === "profile" ? (
            <Profile
              user={user!}
              username={username}
              setUsername={setUsername}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              profilePic={profilePic}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              loading={loading}
              handleLogout={handleLogout}
              updateUser={updateUser}
            />
          ) : (
            <Orders orders={orders} ordersLoading={ordersLoading} />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
