import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useState, useEffect } from "react";
import ProductScreen from "./ProductsGrp";
import tw from "twrnc";

const HomeScreen = () => {
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "https://dcraft-backend.onrender.com/categories"
        );
        const data = await res.json();
        const categoryNames = data.map((cat: { name: string }) => cat.name);
        setCategories(["All", ...categoryNames]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <View style={tw`flex-1 justify-center items-center py-5`}>
      {/* Search Bar */}
      <TextInput
        placeholder="Search for products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={tw`w-[90%] border border-gray-300 rounded-md px-4 py-2 mb-4`}
      />

      {/* Horizontal Category List */}
      <View style={tw`flex w-full px-4 mb-4`}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`mb-4`}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={tw`mr-3 px-4 py-2 rounded-sm ${
                selectedCategory === category ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <Text
                style={tw`text-sm ${
                  selectedCategory === category ? "text-white" : "text-black"
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={tw`text-lg text-gray-600 text-center leading-6`}>
        Products
      </Text>

      {/* Product Display */}
      <ProductScreen searchQuery={searchQuery} category={selectedCategory} />
    </View>
  );
};

export default HomeScreen;
