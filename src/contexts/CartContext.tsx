'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  productId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stockQuantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartItemCount: () => number;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children, slug }: { children: ReactNode; slug: string }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted on client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load cart items from localStorage
  useEffect(() => {
    if (!mounted) return;
    
    const savedCart = localStorage.getItem(`cart_${slug}`);
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        setCartItems([]);
      }
    }
  }, [mounted, slug]);

  // Save cart items to localStorage whenever cart changes
  useEffect(() => {
    if (!mounted) return;
    
    localStorage.setItem(`cart_${slug}`, JSON.stringify(cartItems));
  }, [cartItems, mounted, slug]);

  // Add item to cart
  const addToCart = (product: any, quantity: number = 1): number => {
    let quantityAdded = 0;
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Update existing item quantity
        const currentQuantity = existingItem.quantity;
        const maxPossibleQuantity = product.stockQuantity;
        const newQuantity = Math.min(currentQuantity + quantity, maxPossibleQuantity);
        quantityAdded = newQuantity - currentQuantity;
        
        return prevItems.map(item =>
          item.productId === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Add new item
        quantityAdded = Math.min(quantity, product.stockQuantity);
        
        const imageUrl = product.images?.[0]?.imageUrl || product.imageUrl || '';
        const newItem: CartItem = {
          id: Date.now(), // Generate unique ID
          productId: product.id,
          name: product.translations?.[0]?.name || 'Unnamed Product',
          description: product.translations?.[0]?.description || '',
          price: product.price,
          imageUrl: imageUrl,
          quantity: quantityAdded,
          stockQuantity: product.stockQuantity,
        };
        return [...prevItems, newItem];
      }
    });
    
    return quantityAdded;
  };

  // Remove item from cart
  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
  };

  // Update item quantity
  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.productId === productId) {
          return { ...item, quantity: Math.min(quantity, item.stockQuantity) };
        }
        return item;
      })
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get total number of items in cart
  const getCartItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Get total price of cart
  const getCartTotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItemCount,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 