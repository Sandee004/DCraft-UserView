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
      (error) => console.error("Error saving cart items:", error)
    );
  }, [cartItems]);

  const getToken = async () => {
    return await AsyncStorage.getItem("token");
  };

  const loadUserCart = useCallback(async () => {
    try {
      const token = await getToken();

      if (!token) {
        const savedCart = await AsyncStorage.getItem("cartItems");
        if (savedCart) {
          try {
            const parsed = JSON.parse(savedCart);
            if (Array.isArray(parsed)) {
              setCartItems(parsed);
            } else {
              console.warn("Stored cart is not an array:", parsed);
            }
          } catch (parseError) {
            console.error("Failed to parse local cart:", parseError);
          }
        }
        return;
      }

      const response = await fetch(BACKEND_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        let errorMessage = "Unknown error";

        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;

          // Handle specific "User not found" error
          if (errorMessage === "User not found") {
            Alert.alert(
              "Login Required",
              "Your session may have expired. Please log in or sign up to access your cart.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Login",
                  onPress: () => router.push("/profile"),
                },
              ]
            );
          }
        } catch {
          console.warn("Unable to parse error response as JSON.");
        }

        console.warn("Unable to load cart from server:", errorMessage);
        return;
      }

      const data = await response.json();

      if (data.cart_items && Array.isArray(data.cart_items)) {
        const mapped = data.cart_items.map((item: any) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          product_images: item.product_images,
        }));
        setCartItems(mapped);
      } else {
        console.warn("Unexpected cart_items format from server:", data);
      }
    } catch (error) {
      console.error("Error loading cart items:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = async (product: Product) => {
    const token = await getToken();
    const payload = { product_id: product.id, quantity: 1 };

    if (token) {
      console.log("📦 Sending to /api/cart:", payload); // ✅ Log the payload

      try {
        const res = await fetch(BACKEND_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.warn("❌ Add to cart failed:", errorData);
          return;
        }

        await loadUserCart();
      } catch (error) {
        console.error("🚨 Error adding to cart:", error);
      }
    } else {
      // Fallback for guest cart
      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id);
        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...product, quantity: 1 }];
      });
    }
  };

  // Dummy implementations for the other context functions to avoid TS errors
  const decreaseFromCart = async (id: number) => {};
  const removeFromCart = async (id: number) => {};
  const clearCart = async () => {};
  const clearUserCart = async () => {};

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
