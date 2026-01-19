import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface Product {
  id: number;
  title: string;
  price: number;
  product_images?: string;
  quantity: number;
}

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => Promise<void>;
  decreaseFromCart: (id: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadUserCart: () => Promise<void>;
  clearUserCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const BACKEND_URL = "https://dcraft-backend.onrender.com/api/cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    AsyncStorage.setItem("cartItems", JSON.stringify(cartItems)).catch(
      (error) => console.error("Error saving cart items:", error),
    );
  }, [cartItems]);

  const getToken = async () => {
    return await AsyncStorage.getItem("token");
  };

  const loadUserCart = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) {
        /* local storage logic */ return;
      }

      const response = await fetch(BACKEND_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        let msg = "Server Error";
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          msg = errorData.message || msg;
        }
        console.warn("Unable to load cart:", msg);
        return;
      }

      const data = await response.json();

      if (data.cart_items) {
        const mapped = data.cart_items.map((item: any) => ({
          id: item.id,
          // Match these keys exactly to your Flask jsonify output
          title: item.title || item.product_name,
          price: item.price || item.product_price,
          quantity: item.quantity,
          product_images: item.product_images,
        }));
        setCartItems(mapped);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  }, []);

  const addToCart = async (product: Product) => {
    const token = await getToken();

    if (token) {
      await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      }).catch((error) => console.error("Error adding to cart:", error));

      await loadUserCart();
    } else {
      Alert.alert(
        "Login Required",
        "Please log in to add items to your cart.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Login",
            onPress: () => router.push("/profile"), // or your login screen route
          },
        ],
      );
    }
  };

  const decreaseFromCart = async (id: number) => {
    const token = await getToken();
    if (token) {
      await fetch(`${BACKEND_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: -1 }),
      }).catch((error) => console.error("Error decreasing cart item:", error));
      await loadUserCart();
    } else {
      setCartItems((prev) =>
        prev
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
          )
          .filter((item) => item.quantity > 0),
      );
    }
  };

  const removeFromCart = async (id: number) => {
    const token = await getToken();
    if (token) {
      await fetch(`${BACKEND_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch((error) => console.error("Error removing from cart:", error));
      await loadUserCart();
    } else {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    await AsyncStorage.removeItem("cartItems");
  };

  const clearUserCart = async () => {
    await clearCart();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        decreaseFromCart,
        removeFromCart,
        clearCart,
        loadUserCart,
        clearUserCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

export default CartContext;
