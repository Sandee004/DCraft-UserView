import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "../../components/CartContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "twrnc";

// --- SKELETON COMPONENT (Unchanged) ---
const Skeleton = () => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  return <Animated.View style={[tw`w-full h-full bg-gray-200`, { opacity }]} />;
};

const SingleProductScreen: React.FC<{ product: any }> = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCart();

  // Key fix: Use the image URL as an initial check.
  // If the image is already cached, some devices fire onLoad immediately.
  const [isLoaded, setIsLoaded] = useState(false);

  const getOptimizedImage = (imageUrl: any) => {
    if (!imageUrl) return null;
    const url = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl;
    if (typeof url === "string" && url.includes("cloudinary.com")) {
      return url.replace(
        "/upload/",
        "/upload/w_400,c_fill,g_auto,q_auto,f_auto/",
      );
    }
    return url;
  };

  const optimizedUri = getOptimizedImage(product.product_images);

  return (
    <View style={tw`w-[48%] mb-4`}>
      <View
        style={tw`bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 h-[310px]`}
      >
        {/* Image Section */}
        <View style={tw`h-3/5 bg-gray-50 relative`}>
          {optimizedUri ? (
            <>
              {/* Only show shimmer if isLoaded is FALSE */}
              {!isLoaded && (
                <View style={tw`absolute inset-0 z-10`}>
                  <Skeleton />
                </View>
              )}
              <Image
                key={optimizedUri} // Force fresh state if URL changes
                source={{ uri: optimizedUri }}
                style={tw`w-full h-full`}
                resizeMode="cover"
                onLoad={() => setIsLoaded(true)} // This fires as soon as the image is ready
              />
            </>
          ) : (
            <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
              <Text style={tw`text-gray-400 text-xs`}>No image</Text>
            </View>
          )}
        </View>

        {/* Product Details Section */}
        <View style={tw`flex-1 px-3 py-2 justify-between`}>
          <View>
            <Text
              numberOfLines={1}
              style={tw`font-medium text-black text-[14px] mb-1`}
            >
              {product.title}
            </Text>
            <Text style={tw`text-[#000080] font-bold text-lg`}>
              ₦{product.price.toLocaleString()}
            </Text>
          </View>

          <View style={tw`flex-row mt-2 gap-2 items-center`}>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/ProductDetails" as any,
                  params: {
                    id: product.id.toString(),
                    title: product.title,
                    price: product.price.toString(),
                    image: optimizedUri ?? "",
                  },
                })
              }
              style={tw`flex-1 bg-[#000080] py-2.5 rounded-md`}
            >
              <Text style={tw`text-white text-center font-semibold text-xs`}>
                View
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => addToCart(product)}
              style={tw`w-10 bg-[#000080] py-1.5 rounded-md justify-center items-center`}
            >
              <Text style={tw`text-white text-center font-bold text-xl`}>
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
