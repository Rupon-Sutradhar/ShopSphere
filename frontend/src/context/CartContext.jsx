import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateCartTotals } from '../utils/formatters';

const CartContext = createContext(null);
const CART_STORAGE_KEY = 'shopsphere_cart_items';

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed to load cart from localStorage:', err);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.error('Failed to save cart to localStorage:', err);
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    let message = '';
    let success = false;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);
      const availableStock = product.stock ?? 99;

      if (existingItem) {
        const nextQty = existingItem.quantity + quantity;
        if (nextQty > availableStock) {
          message = `Cannot add more than available stock (${availableStock}).`;
          success = false;
          return prevItems;
        }
        success = true;
        return prevItems.map((item) =>
          item._id === product._id ? { ...item, quantity: nextQty } : item
        );
      } else {
        if (quantity > availableStock) {
          message = `Cannot add more than available stock (${availableStock}).`;
          success = false;
          return prevItems;
        }
        success = true;
        return [
          ...prevItems,
          {
            _id: product._id,
            title: product.title,
            price: product.price,
            stock: availableStock,
            image: product.images?.[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
            category: product.category?.name || 'General',
            quantity,
          },
        ];
      }
    });

    return { success, message };
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item._id === productId) {
          const qty = Math.min(newQuantity, item.stock);
          return { ...item, quantity: qty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const { subtotal, tax, shipping, total } = calculateCartTotals(cartItems);
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        tax,
        shipping,
        total,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
