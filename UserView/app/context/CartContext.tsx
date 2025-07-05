import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Product {
  id: number;
  title: string;
  price: number;
  image?: string;
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

  useEffect(() => {
    // Save local cache
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
        // Fallback to local cart
        const savedCart = await AsyncStorage.getItem("cartItems");
        if (savedCart) setCartItems(JSON.parse(savedCart));
        return;
      }
      const response = await fetch(BACKEND_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(
          data.cart_items.map((item: any) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          }))
        );
      } else {
        console.warn("Unable to load cart");
        //const savedCart = await AsyncStorage.getItem("cartItems");
        //if (savedCart) setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart items:", error);
    }
  }, []);

  useEffect(() => {
    loadUserCart();
  }, [loadUserCart]);

  const addToCart = async (product: Product) => {
    const token = await getToken();
    if (token) {
      // Backend request
      await fetch(BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      }).catch((error) => console.error(error));
      await loadUserCart();
    } else {
      // Offline/local add
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

  const decreaseFromCart = async (id: number) => {
    const token = await getToken();
    if (token) {
      await fetch(`${BACKEND_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: -1 }), // We'll decrement by one
      }).catch((error) => console.error(error));
      await loadUserCart();
    } else {
      setCartItems((prev) =>
        prev
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0)
      );
    }
  };

  const removeFromCart = async (id: number) => {
    const token = await getToken();
    if (token) {
      await fetch(`${BACKEND_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch((error) => console.error(error));
      await loadUserCart();
    } else {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const clearCart = async () => {
    const token = await getToken();
    if (token) {
      await fetch(`${BACKEND_URL}/clear`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch((error) => console.error(error));
    }
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
