import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import tw from "twrnc";
import { useCart } from "../../components/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  product_images?: string;
};

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) {
      setError("Product ID not provided.");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(
          "https://dcraft-backend.onrender.com/products"
        );
        const data = await response.json();

        const found = data.results.find((p: Product) => p.id === Number(id));

        if (!found) {
          setError("Product not found.");
        } else {
          setProduct(found);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
              onPress: () => router.push("/profile"),
            },
          ]
        );
        return;
      }

      // Ensure product is not null before adding to cart
      if (!product) {
        Alert.alert("Error", "Product details are missing.");
        return;
      }

      // User is logged in, add to cart
      addToCart({ ...product, quantity: 1 });
      console.log("Added to cart");
    } catch (error) {
      console.error("Error checking login status:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-red-600 text-center text-lg`}>
          ⚠️ {error || "Missing product details."}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`bg-[#000080] py-4 px-4 items-center`}>
        <Text style={tw`text-white text-xl font-bold`}>{product.title}</Text>
      </View>

      <ScrollView style={tw`bg-white flex-1 p-4`}>
        {Array.isArray(product.product_images) &&
        product.product_images.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={tw`mb-4`}
          >
            {product.product_images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={tw`w-72 h-64 mr-3 rounded bg-gray-200`}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        ) : (
          <View
            style={tw`w-full h-64 mb-4 bg-gray-200 rounded justify-center items-center`}
          >
            <Text style={tw`text-gray-500`}>No images available</Text>
          </View>
        )}

        <Text style={tw`text-lg font-semibold mb-2`}>{product.title}</Text>
        <Text style={tw`text-[#000080] text-2xl font-bold mb-2`}>
          ₦{Number(product.price).toLocaleString()}
        </Text>

        <View style={tw`my-3`}>
          <Text style={tw`mb-2 text-black text-[16px]`}>Description</Text>
          <Text style={tw`text-gray-700 text-base leading-6`}>
            {product.description || "No description provided."}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleAddToCart}
          style={tw`w-full mt-5 bg-[#000080] py-2 rounded justify-center items-center`}
        >
          <Text style={tw`text-white text-center font-medium text-xl`}>
            Add to Cart
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
