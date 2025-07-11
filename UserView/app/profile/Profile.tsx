import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import tw from "twrnc";

interface User {
  username: string;
  email: string;
  phone?: string;
  address?: string;
  profile_picture?: string;
}

interface ProfileProps {
  user: User;
  username: string;
  setUsername: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  address: string;
  setAddress: (val: string) => void;
  profilePic: string | null;
  setProfilePic: (val: string | null) => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  loading: boolean;
  handleLogout: () => void;
  updateUser: () => void;
}

export default function Profile({
  user,
  username,
  setUsername,
  email,
  setEmail,
  phone,
  setPhone,
  address,
  setAddress,
  profilePic,
  setProfilePic,
  isEditing,
  setIsEditing,
  loading,
  handleLogout,
  updateUser,
}: ProfileProps) {
  // Save user email to AsyncStorage when component mounts or user changes
  useEffect(() => {
    const saveUserEmail = async () => {
      try {
        await AsyncStorage.setItem("userEmail", user.email);
        console.log("Email saved", AsyncStorage.getItem("userEmail"));
      } catch (error) {
        console.error("Error saving user email:", error);
      }
    };

    if (user.email) {
      saveUserEmail();
    }
  }, [user.email]);

  // Enhanced updateUser function that also saves to AsyncStorage
  const handleUpdateUser = async () => {
    try {
      await updateUser(); // Call the original updateUser function

      // Save updated email to AsyncStorage
      if (email) {
        await AsyncStorage.setItem("userEmail", email);
        console.log("Email saved updated", AsyncStorage.getItem("userEmail"));
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Enhanced logout function that clears AsyncStorage
  const handleLogoutWithCleanup = async () => {
    try {
      // Clear user email from AsyncStorage
      await AsyncStorage.removeItem("userEmail");

      // Call the original logout function
      handleLogout();
    } catch (error) {
      console.error("Error during logout cleanup:", error);
      handleLogout();
    }
  };

  const handlePickProfileImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Permission denied", "Camera roll access is required.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        const uri = selectedImage.uri;
        const filename = uri.split("/").pop()!;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        const formData = new FormData();
        formData.append("profile_pic", {
          uri,
          name: filename,
          type,
        } as any);

        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "User not authenticated");
          return;
        }

        const response = await fetch(
          "https://dcraft-backend.onrender.com/api/upload-profile-pic",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
            body: formData,
          }
        );

        const data = await response.json();

        if (response.ok && data.profile_pic_url) {
          setProfilePic(data.profile_pic_url);

          const updatedUser = {
            ...user,
            profile_picture: data.profile_pic_url,
          };

          await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
          Alert.alert("Success", "Profile picture updated!");
        } else {
          console.error("Upload failed:", data.message);
          Alert.alert("Error", data.message || "Failed to upload image.");
        }
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      Alert.alert("Error", "Something went wrong while uploading.");
    }
  };

  return (
    <View style={tw`flex-1 items-center bg-white justify-start p-4 w-full`}>
      {!isEditing ? (
        <>
          <View style={tw`mb-4`}>
            <Image
              source={
                profilePic
                  ? { uri: profilePic }
                  : require("../assets/profilepic.jpg")
              }
              style={tw`h-40 w-40 rounded-full border border-[#000080] border-4`}
            />

            <TouchableOpacity
              onPress={handlePickProfileImage}
              style={tw`absolute bottom-0 right-0 bg-red-500 p-2 rounded-full border-2 border-white`}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <FontAwesome name="pencil" size={16} color="white" />
              )}
            </TouchableOpacity>
          </View>

          <Text style={tw`text-black text-2xl font-bold mb-1`}>
            {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
          </Text>
          <Text style={tw`text-black text-lg mb-1`}>{user.email}</Text>
          <Text style={tw`text-black text-lg mb-4`}>
            {user.phone || "No phone number"}
          </Text>
          <Text>{user.address || ""}</Text>

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
            onPress={handleLogoutWithCleanup}
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
              style={tw`py-3 w-[48%] rounded-md ${
                loading ? "bg-gray-400" : "bg-[#000080]"
              }`}
              onPress={handleUpdateUser}
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
    </View>
  );
}
