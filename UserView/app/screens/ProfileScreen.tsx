import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Text,
  View,
  Alert,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import tw from "twrnc";
import { FontAwesome } from "@expo/vector-icons";

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
  const [profilePic, setProfilePic] = useState<string | null>(
    user?.profile_picture || null
  );

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
      if (!token) return;

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
      if (response.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to load orders", error);
    } finally {
      setOrdersLoading(false);
    }
  };

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

  const renderOrders = () => (
    <ScrollView style={tw`w-full`}>
      {ordersLoading ? (
        <View style={tw`items-center mt-10`}>
          <ActivityIndicator size="large" color="#000080" />
          <Text style={tw`text-gray-600 mt-2`}>Loading orders...</Text>
        </View>
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <View
            key={order.id}
            style={tw`bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm`}
          >
            <View style={tw`flex-row justify-between items-start mb-2`}>
              <Text style={tw`text-lg font-semibold text-black flex-1 mr-2`}>
                {order.title}
              </Text>
              <Text style={tw`text-lg font-bold text-[#000080]`}>
                ${order.price.toFixed(2)}
              </Text>
            </View>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-gray-600`}>{order.date}</Text>
              <View
                style={tw`px-3 py-1 rounded-full ${
                  order.status === "completed"
                    ? "bg-green-100"
                    : order.status === "pending"
                    ? "bg-yellow-100"
                    : "bg-red-100"
                }`}
              >
                <Text
                  style={tw`text-sm font-medium ${
                    order.status === "completed"
                      ? "text-green-800"
                      : order.status === "pending"
                      ? "text-yellow-800"
                      : "text-red-800"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        ))
      ) : (
        <View style={tw`items-center mt-10`}>
          <FontAwesome name="shopping-cart" size={50} color="#ccc" />
          <Text style={tw`text-gray-600 mt-4 text-lg`}>No orders yet</Text>
          <Text style={tw`text-gray-400 mt-2 text-center`}>
            Your orders will appear here once you make a purchase
          </Text>
        </View>
      )}
    </ScrollView>
  );

  const renderProfile = () => (
    <>
      {!isEditing ? (
        <>
          <TouchableOpacity style={tw`mb-4`}>
            <Image
              source={
                profilePic
                  ? { uri: profilePic }
                  : require("../assets/profilepic.jpg")
              }
              style={tw`h-40 w-40 rounded-full border border-[#000080] border-4`}
            />
            <View
              style={tw`absolute bottom-0 right-0 bg-red-500 p-2 rounded-full border-2 border-white`}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <FontAwesome name="pencil" size={16} color="white" />
              )}
            </View>
          </TouchableOpacity>

          <Text style={tw`text-black text-2xl font-bold`}>
            {user && user.username
              ? user.username.charAt(0).toUpperCase() + user.username.slice(1)
              : ""}
          </Text>
          <Text style={tw`text-black text-lg`}>
            {user && user.email ? user.email : ""}
          </Text>
          <Text style={tw`text-black text-lg mb-4`}>
            {user && user.phone ? user.phone : "No phone number"}
          </Text>

          <TouchableOpacity
            style={tw`bg-[#B0E0E6] w-full py-3 rounded-md mb-4`}
            onPress={() => setIsEditing(true)}
          >
            <Text style={tw`text-black text-lg text-center`}>
              Update Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`bg-red-500 w-full py-3 rounded-md`}
            onPress={handleLogout}
          >
            <Text style={tw`text-white text-lg text-center`}>Log Out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={tw`w-full bg-white text-black border border-[#000080] px-4 py-3 rounded-md mb-3`}
            value={username}
            onChangeText={setUsername}
            placeholder="Username"
          />
          <TextInput
            style={tw`w-full bg-white text-black border border-[#000080] px-4 py-3 rounded-md mb-3`}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
          />
          <TextInput
            style={tw`w-full bg-white text-black border border-[#000080] px-4 py-3 rounded-md mb-3`}
            value={phone}
            onChangeText={setPhone}
            placeholder="Phone (Optional)"
            keyboardType="phone-pad"
          />
          <View style={tw`flex flex-row justify-between w-full mt-2`}>
            <TouchableOpacity
              style={tw`bg-gray-600 py-3 w-[48%] rounded-md`}
              onPress={() => setIsEditing(false)}
              disabled={loading}
            >
              <Text style={tw`text-white text-lg text-center`}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={updateUser}
              style={tw`py-3 w-[48%] rounded-md ${
                loading ? "bg-gray-400" : "bg-[#000080]"
              }`}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={tw`text-white text-lg text-center`}>
                  Save Changes
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </>
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
    <View style={tw`flex-1 bg-white p-6`}>
      {renderTabs()}
      <View style={tw`flex-1 items-center`}>
        {activeTab === "profile" ? renderProfile() : renderOrders()}
      </View>
    </View>
  );
}
