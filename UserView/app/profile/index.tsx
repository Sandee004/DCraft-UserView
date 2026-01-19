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
  address?: string;
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
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  //const [profilePic] = useState<string | null>(user?.profile_picture || null);
  const [profilePic, setProfilePic] = useState<string | null>(
    user?.profile_picture || null,
  );
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

  useEffect(() => {
    const initCart = async () => {
      if (user) {
        try {
          await loadUserCart();
        } catch (error) {
          console.error("Error loading user cart:", error);
        }
      }
    };
    initCart();
  }, [user, loadUserCart]);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        "https://dcraft-backend.onrender.com/api/orders",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders || []);
      } else {
        console.error("Failed to load orders", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleAuth = async () => {
    if (!username || !email) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/login" : "/signup";
      const response = await fetch(
        `https://dcraft-backend.onrender.com/api${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            phone,
            ...(isLogin ? {} : { address }), // only include address during sign up
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        const newUser: User = {
          username: data.user?.username || username,
          email: data.user?.email || email,
          phone: data.user?.phone || phone,
          address: data.user?.address || address,
          profile_picture: data.user?.profile_picture || null,
        };

        await AsyncStorage.setItem("user", JSON.stringify(newUser));
        await AsyncStorage.setItem("token", data.access_token);
        setUser(newUser);
        await loadUserCart();

        Alert.alert("Success", data.message || "Authentication successful");
      } else {
        Alert.alert("Error", data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth failed", error);
      Alert.alert("Error", "Something went wrong");
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
      if (!token) {
        Alert.alert("Error", "Please log in and try again");
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
        },
      );

      const data = await response.json();
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
          {isLogin ? "Log In" : "Sign Up"}
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
        {!isLogin && (
          <TextInput
            style={tw`w-full bg-white text-black border border-[#000080] px-4 py-3 rounded-md mb-3 h-24 text-top`}
            placeholder="Address **(please be detailed as this would be used for deliveries)**"
            placeholderTextColor="gray"
            value={address}
            onChangeText={setAddress}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        )}

        <TouchableOpacity
          style={tw`w-full items-center py-3 mt-6 rounded-md ${
            loading ? "bg-gray-400" : "bg-[#000080]"
          }`}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={tw`text-white text-lg`}>
              {isLogin ? "Log In" : "Sign Up"}
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={tw`mt-4`}>
          <Text style={tw`text-blue-600 text-base`}>
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </Text>
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
              user={user}
              username={username}
              setUsername={setUsername}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              address={address}
              setAddress={setAddress}
              profilePic={profilePic}
              setProfilePic={setProfilePic}
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
