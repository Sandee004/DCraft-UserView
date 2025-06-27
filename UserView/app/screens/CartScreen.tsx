import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";
import tw from "twrnc";

export default function CartScreen() {
  const { cartItems } = useCart();
  const total = cartItems.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const proceedtoCheckout = () => {
    console.log("Coming soon....");
  };

  return (
    <View style={tw`flex-1 p-4 bg-white`}>
      <Text style={tw`text-xl font-bold mb-4 text-black`}>Your Cart</Text>
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <CartItem product={item} />}
          />

          <View style={tw`flex-row justify-between mb-4`}>
            <Text style={tw`text-right text-lg font-bold mt-4`}>Total:</Text>
            <Text style={tw`text-right text-lg font-bold mt-4`}>
              ${total.toFixed(2)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={proceedtoCheckout}
            style={tw`w-full bg-[#000080] py-3 rounded-md justify-center items-center`}
          >
            <Text style={tw`text-white text-center font-medium text-lg`}>
              Proceed to Checkout
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={tw`text-center text-gray-500 mt-10`}>
          Your cart is empty
        </Text>
      )}
    </View>
  );
}
