// Profile.tsx
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import tw from "twrnc";

interface User {
  username: string;
  email: string;
  phone?: string;
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
  profilePic: string | null;
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
  profilePic,
  isEditing,
  setIsEditing,
  loading,
  handleLogout,
  updateUser,
}: ProfileProps) {
  return (
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
            {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
          </Text>
          <Text style={tw`text-black text-lg`}>{user.email}</Text>
          <Text style={tw`text-black text-lg mb-4`}>
            {user.phone || "No phone number"}
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
              style={tw`py-3 w-[48%] rounded-md ${
                loading ? "bg-gray-400" : "bg-[#000080]"
              }`}
              onPress={updateUser}
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
}
