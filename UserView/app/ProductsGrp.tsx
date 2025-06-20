import React, { useState, useEffect } from "react";
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
}

const apiUrl = "https://dcraft-backend.onrender.com/products?page=1";

const ProductScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = React.useCallback(
    async (pageNumber: number) => {
      if (pageNumber > totalPages) return;

      try {
        if (pageNumber === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const response = await fetch(`${apiUrl}?page=${pageNumber}`);
        const contentType = response.headers.get("Content-Type");

        if (!response.ok || !contentType?.includes("application/json")) {
          const text = await response.text();
          console.error("Unexpected response:", text);
          throw new Error(`Invalid response: ${response.status}`);
        }

        const data = await response.json();
        const productsWithNumberId = data.results.map((product: Product) => ({
          ...product,
          id: Number(product.id),
        })) as Product[];

        setProducts((prevProducts) =>
          pageNumber === 1
            ? productsWithNumberId
            : [...prevProducts, ...productsWithNumberId]
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
    fetchProducts(1);
  }, [fetchProducts]);

  const loadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(nextPage);
    }
  };

  return (
    <>
      <View style={tw`flex-1 w-full px-2 py-4`}>
        {loading ? (
          <ActivityIndicator size="large" color="#C8A2C8" />
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <SingleProductScreen product={item} />}
            numColumns={2}
            contentContainerStyle={tw`pb-24 px-2`} // more padding at bottom for scrolling
            columnWrapperStyle={tw`justify-between mb-4`} // add spacing between columns
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
                  style={tw`bg-[#373b69] px-8 py-3 mt-6 rounded-lg`}
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
    </>
  );
};

export default ProductScreen;
