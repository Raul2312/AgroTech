import React, { createContext, useContext, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  increase: (id: number) => void;
  decrease: (id: number) => void;
  cartCount: number;
};

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => useContext(CartContext)!;

export const CartProvider = ({ children }: any) => {

  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    const exist = cart.find(p => p.id === item.id);

    if (exist) {
      setCart(cart.map(p =>
        p.id === item.id
          ? { ...p, quantity: p.quantity + 1 }
          : p
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id:number) => {
    setCart(cart.filter(p => p.id !== id));
  };

  const increase = (id:number) => {
    setCart(cart.map(p =>
      p.id === id ? { ...p, quantity: p.quantity + 1 } : p
    ));
  };

  const decrease = (id:number) => {
    setCart(cart.map(p =>
      p.id === id && p.quantity > 1
        ? { ...p, quantity: p.quantity - 1 }
        : p
    ));
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, increase, decrease, cartCount }}
    >
      {children}
    </CartContext.Provider>
  );
};