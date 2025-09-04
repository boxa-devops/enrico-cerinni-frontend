import { useState, useCallback } from 'react';

export const useCart = () => {
  const [cart, setCart] = useState([]);

  const addToCart = useCallback((product) => {
    console.log('Adding product to cart:', product);
    
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      // Ensure price is a number when adding to cart
      const productWithNumberPrice = {
        ...product,
        price: parseFloat(product.price) || 0,
        quantity: 1
      };
      setCart([...cart, productWithNumberPrice]);
    }
  }, [cart]);

  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== productId));
    } else {
      setCart(cart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    }
  }, [cart]);

  const updatePrice = useCallback((productId, newPrice) => {
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, price: parseFloat(newPrice) || 0 }
        : item
    ));
  }, [cart]);

  const removeFromCart = useCallback((productId) => {
    setCart(cart.filter(item => item.id !== productId));
  }, [cart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = parseFloat(item.price || 0);
    return sum + (itemPrice * item.quantity);
  }, 0);

  const total = subtotal;

  return {
    cart,
    subtotal,
    total,
    addToCart,
    updateQuantity,
    updatePrice,
    removeFromCart,
    clearCart,
    setCart,
  };
}; 