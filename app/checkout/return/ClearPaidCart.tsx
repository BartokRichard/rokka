"use client";

import { useEffect } from "react";

import { useCart } from "../../cart/CartProvider";

export default function ClearPaidCart() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
