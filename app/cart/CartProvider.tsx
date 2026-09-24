"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { ColorOption } from "../data/products";

export type CartItemColor = {
  partId: string;
  partLabel: string;
  optionId: string;
  optionLabel: string;
  hex?: string;
  texture?: ColorOption["texture"];
};

export type CartItem = {
  id: string;
  productId: string;
  productName: string;
  subtitle: string;
  sampleImage: string;
  productImage?: string;
  materialName: string;
  earId?: string;
  earName?: string;
  variantId?: string;
  variantName?: string;
  colors: CartItemColor[];
  size: string;
  height?: string;
  bust?: string;
  unitPrice: number;
  currency: string;
  quantity: number;
};

type NewCartItem = Omit<CartItem, "id" | "quantity">;

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  itemCount: number;
  totalPrice: number;
  addItem: (item: NewCartItem) => string;
  updateItem: (id: string, item: NewCartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "rokka-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrationTimer = window.setTimeout(() => {
      try {
        const storedCart = window.localStorage.getItem(STORAGE_KEY);

        if (storedCart) {
          const parsedCart = JSON.parse(storedCart) as CartItem[];
          if (Array.isArray(parsedCart)) setItems(parsedCart);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setHydrated(true);
      }
    }, 0);

    return () => window.clearTimeout(hydrationTimer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const addItem = useCallback((item: NewCartItem) => {
    const id = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

    setItems((currentItems) => [
      ...currentItems,
      { ...item, id, quantity: 1 },
    ]);

    return id;
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item,
      ),
    );
  }, []);

  const updateItem = useCallback((id: string, item: NewCartItem) => {
    setItems((currentItems) =>
      currentItems.map((currentItem) =>
        currentItem.id === id
          ? { ...item, id, quantity: currentItem.quantity }
          : currentItem,
      ),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      hydrated,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      totalPrice: items.reduce(
        (total, item) => total + item.unitPrice * item.quantity,
        0,
      ),
      addItem,
      updateItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [
      addItem,
      clearCart,
      hydrated,
      items,
      removeItem,
      updateItem,
      updateQuantity,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("A useCart csak CartProvideren belül használható.");
  }

  return context;
}
