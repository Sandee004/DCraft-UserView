// Orders.tsx
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import tw from "twrnc";

interface Order {
  id: string;
  title: string;
  price: number;
  status: string;
  date: string;
}

interface OrdersProps {
  orders: Order[];
  ordersLoading: boolean;
}

export default function Orders({ orders, ordersLoading }: OrdersProps) {
  return (
    <ScrollView style={tw`w-full`}>
      {ordersLoading ? (
        <View style={tw`items-center mt-10`}>
          <ActivityIndicator size="large" color="#000080" />
          <Text style={tw`text-gray-600 mt-2`}>Loading orders...</Text>
        </View>
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <View
            key={order.id}
            style={tw`bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm`}
          >
            <View style={tw`flex-row justify-between items-center`}>
              <View style={tw`items-start flex flex-col gap-1 mb-2`}>
                <Text style={tw`font-semibold text-lg`}>{order.title}</Text>
                <Text style={tw`text-gray-600`}>
                  {new Date(order.date).toLocaleDateString()}
                </Text>
              </View>
              <View>
                <View
                  style={tw`px-3 py-1 rounded-full ${
                    order.status === "delivered"
                      ? "bg-green-100"
                      : order.status === "shipped"
                      ? "bg-yellow-100"
                      : "bg-red-100"
                  }`}
                >
                  <Text
                    style={tw`text-sm font-medium ${
                      order.status === "delivered"
                        ? "text-green-800"
                        : order.status === "shipped"
                        ? "text-yellow-800"
                        : "text-red-800"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={tw`text-xl font-bold`}>
              ₦{order.price.toLocaleString()}
            </Text>
          </View>
        ))
      ) : (
        <View style={tw`items-center mt-10`}>
          <FontAwesome name="shopping-cart" size={50} color="#ccc" />
          <Text style={tw`text-gray-600 mt-4 text-lg`}>No orders yet</Text>
          <Text style={tw`text-gray-400 mt-2 text-center`}>
            Your orders will appear here once you make a purchase
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
