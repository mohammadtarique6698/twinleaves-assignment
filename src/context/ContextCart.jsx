import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { loggedInUser, updateCart } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  // Load cart initially from loggedInUser
  useEffect(() => {
    if (loggedInUser && loggedInUser.cart) {
      setCart(loggedInUser.cart);
    }
  }, [loggedInUser?.cart]);

  // Sync cart updates only when it actually changes
  useEffect(() => {
    if (
      loggedInUser &&
      JSON.stringify(loggedInUser.cart) !== JSON.stringify(cart)
    ) {
      updateCart(cart);
    }
  }, [cart]);

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

  const removeFromCart = (sku_code) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.sku_code !== sku_code)
    );
  };

  return (
    <CartContext.Provider value={{ cart, addCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
