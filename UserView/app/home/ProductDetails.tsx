import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import tw from "twrnc";

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  image?: string;
};

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={tw`w-full h-64 mb-4 bg-gray-200 rounded`}
            resizeMode="cover"
          />
        ) : (
          <View
            style={tw`w-full h-64 mb-4 bg-gray-200 rounded justify-center items-center`}
          >
            <Text style={tw`text-gray-500`}>No image available</Text>
          </View>
        )}

        <Text style={tw`text-xl font-bold mb-2`}>{product.title}</Text>
        <Text style={tw`text-gray-500 mb-2`}>{product.category}</Text>
        <Text style={tw`text-green-600 text-lg mb-2`}>
          ₦{Number(product.price).toLocaleString()}
        </Text>
        <Text style={tw`text-gray-700 mb-2`}>Stock: {product.stock}</Text>
        <Text style={tw`text-black text-base leading-6`}>
          {product.description || "No description provided."}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
