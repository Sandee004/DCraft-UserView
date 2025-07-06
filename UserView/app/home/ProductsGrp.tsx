import React, { useState, useEffect } from "react";
import { Text, View, FlatList, ActivityIndicator } from "react-native";
import SingleProductScreen from "./SingleProductScreen";
import tw from "twrnc";

interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ProductScreenProps {
  searchQuery: string;
  category: string;
}

const apiUrl = "https://dcraft-backend.onrender.com/products";

const ProductScreen: React.FC<ProductScreenProps> = ({
  searchQuery,
  category,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiUrl);
        const contentType = response.headers.get("Content-Type");

        if (!response.ok || !contentType?.includes("application/json")) {
          const text = await response.text();
          console.error("Unexpected response:", text);
          throw new Error(`Invalid response: ${response.status}`);
        }

        const data = await response.json();

        const productsWithNumberId = data.results.map((product: any) => ({
          id: Number(product.id),
          title: product.title,
          price: product.price,
          category: product.category,
          image: product.image || undefined,
          quantity: 1,
        }));

        setProducts(productsWithNumberId);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, category]);

  // Filter by search and category
  const filteredProducts = products.filter((product) => {
    const matchesQuery = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesQuery && matchesCategory;
  });

  return (
    <View style={tw`flex-1 w-full px-2 py-4`}>
      {loading ? (
        <ActivityIndicator size="large" color="#000080" />
      ) : filteredProducts.length === 0 ? (
        <Text style={tw`text-center text-gray-500 mt-8`}>
          No products found.
        </Text>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <SingleProductScreen product={item} />}
          numColumns={2}
          contentContainerStyle={tw`pb-24 px-2`}
          columnWrapperStyle={tw`justify-between mb-4`}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ProductScreen;
