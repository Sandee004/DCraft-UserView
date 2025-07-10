import React from "react";
import { Text, View, Image, TouchableOpacity } from "react-native";
import { useCart } from "../../components/CartContext";
import tw from "twrnc";

interface Product {
  id: number;
  title: string;
  price: number;
  product_images?: string;
  quantity: number;
  available_stock: number;
}

const CartItem: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart, decreaseFromCart } = useCart();

  const isOutOfStock = product.available_stock <= 0;
  const isAtMax = product.quantity >= product.available_stock;

  return (
    <View
      style={tw`flex-row items-center bg-white p-3 mb-3 rounded-lg shadow border border-gray-200`}
    >
      {/* Product image */}
      <View style={tw`w-16 h-16 mr-3 bg-gray-100 rounded overflow-hidden`}>
        {product.product_images ? (
          <Image
            source={{ uri: product.product_images?.[0] }}
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

        {/* Stock status */}
        {isOutOfStock ? (
          <Text style={tw`text-red-500 text-xs mt-1`}>Out of stock</Text>
        ) : isAtMax ? (
          <Text style={tw`text-yellow-600 text-xs mt-1`}>
            Max available in cart
          </Text>
        ) : null}
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
          disabled={isOutOfStock || isAtMax}
          style={[
            tw`px-2 py-1 rounded`,
            isOutOfStock || isAtMax ? tw`bg-gray-300` : tw`bg-[#000080]`,
          ]}
        >
          <Text
            style={tw`font-bold text-xl ${
              isOutOfStock || isAtMax ? "text-gray-500" : "text-white"
            }`}
          >
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartItem;
