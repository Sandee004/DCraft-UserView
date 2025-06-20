import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import tw from "twrnc";

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  image?: string;
}

const SingleProductScreen: React.FC<{ product: Product }> = ({ product }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() =>
        (navigation as any).navigate("ProductDetails", { product })
      }
      style={tw`w-[48%] mb-4`}
    >
      <View
        style={tw`bg-white rounded-lg overflow-hidden shadow border border-gray-200 h-[260px]`}
      >
        {/* Image */}
        <View style={tw`h-2/3 bg-gray-200`}>
          {product.image ? (
            <Image
              source={{ uri: product.image }}
              style={tw`w-full h-full`}
              resizeMode="cover"
            />
          ) : (
            <View style={tw`flex-1 justify-center items-center bg-gray-100`}>
              <Text style={tw`text-gray-400 text-xs`}>No image</Text>
            </View>
          )}
        </View>

        {/* Details */}
        <View style={tw`bg-white flex-1 p-3 justify-end`}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={tw`font-medium text-black mb-1`}
          >
            {product.title}
          </Text>
          <Text style={tw`text-xs text-gray-500 mb-1`}>{product.category}</Text>
          <Text style={tw`text-green-600 font-bold text-sm`}>
            ${product.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SingleProductScreen;
