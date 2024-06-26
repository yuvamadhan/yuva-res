import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [disabledItems, setDisabledItems] = useState(() => {
    const saved = localStorage.getItem('disabledItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    localStorage.setItem('disabledItems', JSON.stringify(disabledItems));
  }, [disabledItems]);

  const fetchCart = async () => {
    try {
      const response = await axios.get('https://yuva-res.onrender.com/cart');
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const addToCart = async (item) => {
    try {
      const response = await axios.post('https://yuva-res.onrender.com/cart', {
        item_name: item.name,
        quantity: item.count,
        price: parseFloat(item.price.replace('Rs.', '')),
        img: item.img,
      });
      setCart([...cart, response.data]);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await axios.delete(`https://yuva-res.onrender.com/cart/${id}`);
      setCart(cart.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const updateCartQuantity = async (id, newQuantity) => {
    try {
      const response = await axios.put(`https://yuva-res.onrender.com/cart/${id}`, {
        quantity: newQuantity,
      });
      setCart(cart.map((item) => (item.id === id ? response.data : item)));
    } catch (error) {
      console.error('Error updating cart quantity:', error);
    }
  };

  const toggleItemEnabled = (itemName) => {
    setDisabledItems((prevDisabledItems) => {
      if (prevDisabledItems.includes(itemName)) {
        return prevDisabledItems.filter((item) => item !== itemName);
      } else {
        return [...prevDisabledItems, itemName];
      }
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateCartQuantity, disabledItems, toggleItemEnabled }}
    >
      {children}
    </CartContext.Provider>
  );
};
