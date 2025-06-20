// ProductDetails.tsx
import { Text, Image, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import tw from "twrnc";

type Product = {
  id: number;
  title: string;
  category: string;
  price: number;
  image?: string;
};

type ProductDetailsRoute = RouteProp<
  { ProductDetails: { product: Product } },
  "ProductDetails"
>;

interface Props {
  route: ProductDetailsRoute;
}

const ProductDetails: React.FC<Props> = () => {
  const route = useRoute();
  const { product } = route.params as { product: Product };

  return (
    <ScrollView style={tw`bg-white flex-1 p-4`}>
      <Image
        source={{ uri: product.image }}
        style={tw`w-full h-64 mb-4 bg-gray-200 rounded`}
        resizeMode="cover"
      />
      <Text style={tw`text-xl font-bold mb-2`}>{product.title}</Text>
      <Text style={tw`text-gray-500 mb-2`}>{product.category}</Text>
      <Text style={tw`text-green-600 text-lg mb-4`}>${product.price}</Text>
      {/* Additional product details */}
      <Text style={tw`text-black text-base leading-6`}>
        Here you can add a full description of the product, reviews, or other
        information.
      </Text>
    </ScrollView>
  );
};

export default ProductDetails;
