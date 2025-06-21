import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useCart } from "../context/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  image?: string;
  quantity: number;
}

const SingleProductScreen: React.FC<{ product: Product }> = ({ product }) => {
  const navigation = useNavigation();
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      // Check if user is logged in
      const storedUser = await AsyncStorage.getItem("user");
      const token = await AsyncStorage.getItem("token");

      if (!storedUser || !token) {
        Alert.alert(
          "Login Required",
          "You need to be logged in to add items to cart",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Login",
              onPress: () => (navigation as any).navigate("Profile"),
            },
          ]
        );
        return;
      }

      // User is logged in, add to cart
      addToCart(product);
    } catch (error) {
      console.error("Error checking login status:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  return (
    <View style={tw`w-[48%] mb-4`}>
      <View
        style={tw`bg-white rounded-lg overflow-hidden shadow border border-gray-200 h-[300px]`}
      >
        {/* Image */}
        <View style={tw`h-3/5 bg-gray-200`}>
          {product.image ? (
            <Image
              source={{ uri: product.image }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          ) : (
            <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
              <Text style={tw`text-gray-400 text-xs`}>No image</Text>
            </View>
          )}
        </View>

        {/* Details */}
        <View style={tw`flex-1 px-3 py-2 justify-between`}>
          {/* Title & Price */}
          <View>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={tw`font-medium text-black mb-1`}
            >
              {product.title}
            </Text>
            <Text style={tw`text-[#000080] font-bold text-lg`}>
              ${product.price}
            </Text>
          </View>

          {/* Buttons */}
          <View style={tw`flex-row mt-2 gap-2 items-center`}>
            <TouchableOpacity
              onPress={() =>
                (navigation as any).navigate("ProductDetails", { product })
              }
              style={tw`flex-1 bg-[#000080] py-2  rounded`}
            >
              <Text style={tw`text-white text-center font-medium`}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleAddToCart}
              style={tw`w-10 bg-[#000080] py-1 rounded justify-center items-center`}
            >
              <Text style={tw`text-white text-center font-medium text-xl`}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SingleProductScreen;
