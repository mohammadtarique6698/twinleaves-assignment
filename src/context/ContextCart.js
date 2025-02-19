/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { loggedInUser, updateCart } = useContext(AuthContext);
  const [cart, setCart] = useState(loggedInUser?.cart || []);

  useEffect(() => {
    if (
      loggedInUser?.cart &&
      JSON.stringify(loggedInUser.cart) !== JSON.stringify(cart)
    ) {
      setCart(loggedInUser.cart);
    }
  }, [loggedInUser?.cart]); // ✅ Prevent unnecessary re-renders

  useEffect(() => {
    if (JSON.stringify(loggedInUser?.cart) !== JSON.stringify(cart)) {
      updateCart(cart);
    }
  }, [cart]); // ✅ Only update when cart changes

  // ✅ Function to add item to cart
  const addCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.sku_code === product.sku_code
      );
      let updatedCart;

      if (existingItem) {
        updatedCart = prevCart.map((item) =>
          item.sku_code === product.sku_code
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, quantity: 1 }];
      }

      return updatedCart;
    });
  };

  // ✅ Function to remove item from cart
  const removeFromCart = (sku_code) => {
    setCart(
      (prevCart) =>
        prevCart
          .map((item) =>
            item.sku_code === sku_code
              ? { ...item, quantity: item.quantity - 1 }
              : item
          )
          .filter((item) => item.quantity > 0) // Remove items with 0 quantity
    );
  };

  return (
    <CartContext.Provider value={{ cart, addCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
