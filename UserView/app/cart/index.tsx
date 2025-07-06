import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useCart } from "../../components/CartContext";
import CartItem from "./CartItem";
import { useRouter } from "expo-router";
import tw from "twrnc";

export default function CartScreen() {
  const { cartItems } = useCart();
  const router = useRouter();
  const total = cartItems.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`bg-[#000080] py-4 px-5`}>
        <Text style={tw`text-white text-xl font-bold`}>Cart</Text>
      </View>

      <View style={tw`flex-1 p-4`}>
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
                ₦{total.toLocaleString()}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/cart/PaymentScreen",
                  params: { total: total.toString() }, // Params must be string
                })
              }
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
    </SafeAreaView>
  );
}
