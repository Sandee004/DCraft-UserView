import { Text, View } from "react-native";
import ProductScreen from "./ProductsGrp";
import tw from "twrnc";

const HomeScreen = () => {
  return (
    <View style={tw`flex-1 justify-center items-center py-5`}>
      <Text style={tw`text-lg text-gray-600 text-center leading-6`}>
        Products
      </Text>
      <ProductScreen />
    </View>
  );
};

export default HomeScreen;
