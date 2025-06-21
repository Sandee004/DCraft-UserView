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
            <View style={tw`flex-row justify-between items-start mb-2`}>
              <Text style={tw`text-lg font-semibold text-black flex-1 mr-2`}>
                {order.title}
              </Text>
              <Text style={tw`text-lg font-bold text-[#000080]`}>
                ${order.price.toFixed(2)}
              </Text>
            </View>
            <View style={tw`flex-row justify-between items-center`}>
              <Text style={tw`text-gray-600`}>{order.date}</Text>
              <View
                style={tw`px-3 py-1 rounded-full ${
                  order.status === "completed"
                    ? "bg-green-100"
                    : order.status === "pending"
                    ? "bg-yellow-100"
                    : "bg-red-100"
                }`}
              >
                <Text
                  style={tw`text-sm font-medium ${
                    order.status === "completed"
                      ? "text-green-800"
                      : order.status === "pending"
                      ? "text-yellow-800"
                      : "text-red-800"
                  }`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>
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
