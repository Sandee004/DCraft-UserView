import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = useCallback(
    async (pageNumber: number) => {
      if (pageNumber > totalPages) return;
      try {
        if (pageNumber === 1) setLoading(true);
        else setLoadingMore(true);

        const response = await fetch(`${apiUrl}?page=${pageNumber}`);
        const contentType = response.headers.get("Content-Type");

        if (!response.ok || !contentType?.includes("application/json")) {
          const text = await response.text();
          console.error("Unexpected response:", text);
          throw new Error(`Invalid response: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
        const productsWithNumberId = data.results.map((product: any) => ({
          id: Number(product.id),
          title: product.title,
          price: product.price,
          category: product.category,
          image: product.image || undefined,
          quantity: 1,
        }));
        setProducts((prev) =>
          pageNumber === 1
            ? productsWithNumberId
            : [...prev, ...productsWithNumberId]
        );

        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [totalPages]
  );

  useEffect(() => {
    setPage(1); // reset page when search or category changes
    fetchProducts(1);
  }, [fetchProducts, searchQuery, category]);

  useEffect(() => {
    console.log("Current products:", products); // Check what's in state
  }, [products]);

  const loadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  // Filter by search and category
  //const filteredProducts = products;
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
        <ActivityIndicator size="large" color="#C8A2C8" />
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
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                size="small"
                color="#C8A2C8"
                style={tw`my-4`}
              />
            ) : page < totalPages ? (
              <TouchableOpacity
                onPress={loadMore}
                style={tw`bg-[#373b69] px-8 py-3 mt-6 rounded-lg self-center`}
              >
                <Text style={tw`text-white font-semibold text-center`}>
                  See More
                </Text>
              </TouchableOpacity>
            ) : null
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default ProductScreen;
