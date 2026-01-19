import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Animated,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import tw from "twrnc";
import { useCart } from "../../components/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// --- SKELETON COMPONENT ---
const Skeleton = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  return <Animated.View style={[tw`w-full h-full bg-gray-200`, { opacity }]} />;
};

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  description: string;
  stock: number;
  product_images?: string | string[];
};

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState<Record<number, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { addToCart } = useCart();

  // --- CLOUDINARY OPTIMIZATION ---
  const getOptimizedUrl = (url: string) => {
    if (url.includes("cloudinary.com")) {
      // Use 800px for detail view instead of 400px
      return url.replace("/upload/", "/upload/w_800,q_auto,f_auto/");
    }
    return url;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        const data = await response.json();
        const found = data.results.find((p: any) => p.id === Number(id));

        if (!found) {
          setError("Product not found.");
        } else {
          setProduct(found);
        }
      } catch (err) {
        setError("Failed to fetch product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login Required", "Please log in to add items to cart", [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/profile") },
        ]);
        return;
      }
      if (product) {
        const productImage = Array.isArray(product.product_images)
          ? product.product_images[0]
          : product.product_images;
        addToCart({ ...product, quantity: 1, title: product.title, product_images: productImage });
        Alert.alert("Success", "Added to cart!");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  if (loading)
    return (
      <View style={tw`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  if (error || !product)
    return (
      <View style={tw`flex-1 justify-center items-center p-4`}>
        <Text style={tw`text-red-600 text-lg`}>⚠️ {error}</Text>
      </View>
    );

  const images = Array.isArray(product.product_images)
    ? product.product_images
    : ([product.product_images].filter(Boolean) as string[]);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View style={tw`bg-[#000080] py-4 px-4 flex-row items-center`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`mr-4`}>
          <Text style={tw`text-white text-lg`}>←</Text>
        </TouchableOpacity>
        <Text style={tw`text-white text-xl font-bold flex-1 text-center mr-6`}>
          Product Details
        </Text>
      </View>

      <ScrollView style={tw`flex-1`}>
        {/* Image Gallery */}
        <View style={tw`p-4`}>
          {images.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
            >
              {images.map((img, index) => (
                <View
                  key={index}
                  style={tw`w-80 h-80 mr-4 relative rounded-xl overflow-hidden bg-gray-100`}
                >
                  {imageLoading[index] !== false && (
                    <View style={tw`absolute inset-0 z-10`}>
                      <Skeleton />
                    </View>
                  )}
                  <Image
                    source={{ uri: getOptimizedUrl(img) }}
                    style={tw`w-full h-full`}
                    resizeMode="cover"
                    onLoadEnd={() =>
                      setImageLoading((prev) => ({ ...prev, [index]: false }))
                    }
                  />
                </View>
              ))}
            </ScrollView>
          ) : (
            <View
              style={tw`w-full h-64 bg-gray-200 rounded-xl justify-center items-center`}
            >
              <Text style={tw`text-gray-500`}>No images available</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={tw`px-5 pb-10`}>
          <Text style={tw`text-2xl font-bold text-gray-800 mb-1`}>
            {product.title}
          </Text>
          <Text
            style={tw`text-gray-500 text-base mb-3 uppercase tracking-wider`}
          >
            {product.category}
          </Text>

          <Text style={tw`text-[#000080] text-3xl font-extrabold mb-5`}>
            ₦{Number(product.price).toLocaleString()}
          </Text>

          <View style={tw`border-t border-gray-100 pt-4`}>
            <Text style={tw`text-gray-800 font-bold text-lg mb-2`}>
              Description
            </Text>
            <Text style={tw`text-gray-600 text-base leading-6`}>
              {product.description ||
                "No description provided for this product."}
            </Text>
          </View>

          {/* Stock Info */}
          <View style={tw`mt-4 flex-row items-center`}>
            <View
              style={tw`w-2 h-2 rounded-full ${
                product.stock > 0 ? "bg-green-500" : "bg-red-500"
              } mr-2`}
            />
            <Text style={tw`text-gray-500`}>
              {product.stock > 0
                ? `${product.stock} items in stock`
                : "Out of stock"}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={product.stock <= 0}
            style={tw`w-full mt-8 ${
              product.stock > 0 ? "bg-[#000080]" : "bg-gray-400"
            } py-4 rounded-xl shadow-lg`}
          >
            <Text style={tw`text-white text-center font-bold text-lg`}>
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
