import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { useCart } from "../../components/CartContext";
import tw from "twrnc";

interface Product {
  id: number;
  title: string;
  price: number;
  image?: string;
  quantity: number;
}

const CartItem: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, decreaseFromCart } = useCart();

  return (
    <View
      style={tw`flex-row items-center bg-white p-3 mb-3 rounded-lg shadow border border-gray-200`}
    >
      {/* Product image */}
      <View style={tw`w-16 h-16 mr-3 bg-gray-100 rounded overflow-hidden`}>
        {product.image ? (
          <Image
            source={{ uri: product.image }}
            style={tw`w-16 h-16`}
            resizeMode="cover"
          />
        ) : (
          <View style={tw`flex-1 justify-center items-center`}>
            <Text style={tw`text-gray-400 text-xs`}>No image</Text>
          </View>
        )}
      </View>

      {/* Product details */}
      <View style={tw`flex-1`}>
        <Text numberOfLines={1} style={tw`font-medium text-black mb-1`}>
          {product.title}
        </Text>
        <Text style={tw`text-[#000080] font-bold text-base`}>
          ₦{product.price.toLocaleString()}
        </Text>
      </View>

      {/* Quantity controls */}
      <View style={tw`flex-row items-center gap-2`}>
        <TouchableOpacity
          onPress={() => decreaseFromCart(product.id)}
          style={tw`bg-[#000080] px-2 py-1 rounded`}
        >
          <Text style={tw`text-white font-bold text-xl`}>-</Text>
        </TouchableOpacity>

        <Text style={tw`text-black font-medium text-lg`}>
          {product.quantity}
        </Text>

        <TouchableOpacity
          onPress={() => addToCart(product)}
          style={tw`bg-[#000080] px-2 py-1 rounded`}
        >
          <Text style={tw`text-white font-bold text-xl`}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartItem;
