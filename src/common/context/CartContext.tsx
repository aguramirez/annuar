// src/common/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CandyProduct } from '../services/candyService';

// Definición del elemento del carrito
export interface CartItem {
  product: CandyProduct;
  quantity: number;
}

// Estado del carrito
interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Contexto del carrito
interface CartContextType {
  cart: CartState;
  addToCart: (product: CandyProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (productId: string) => boolean;
  getCartItemQuantity: (productId: string) => number;
}

// Crear el contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};

// Props del proveedor
interface CartProviderProps {
  children: ReactNode;
}

// Proveedor del contexto
export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Estado inicial del carrito
  const [cart, setCart] = useState<CartState>({
    items: [],
    total: 0,
    itemCount: 0
  });

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const savedCart = localStorage.getItem('annuar-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
        localStorage.removeItem('annuar-cart');
      }
    }
  }, []);

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('annuar-cart', JSON.stringify(cart));
  }, [cart]);

  // Agregar producto al carrito
  const addToCart = (product: CandyProduct, quantity: number = 1) => {
    setCart(prevCart => {
      // Verificar si el producto ya está en el carrito
      const existingItemIndex = prevCart.items.findIndex(
        item => item.product.id === product.id
      );

      let newItems = [...prevCart.items];

      if (existingItemIndex >= 0) {
        // Si el producto ya está, actualizar cantidad
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + quantity
        };
      } else {
        // Si no está, agregarlo
        newItems.push({ product, quantity });
      }

      // Calcular nuevo total y cantidad de items
      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const itemCount = newItems.reduce(
        (count, item) => count + item.quantity,
        0
      );

      return { items: newItems, total, itemCount };
    });
  };

  // Eliminar producto del carrito
  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(
        item => item.product.id !== productId
      );

      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const itemCount = newItems.reduce(
        (count, item) => count + item.quantity,
        0
      );

      return { items: newItems, total, itemCount };
    });
  };

  // Actualizar cantidad de un producto en el carrito
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );

      const total = newItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      const itemCount = newItems.reduce(
        (count, item) => count + item.quantity,
        0
      );

      return { items: newItems, total, itemCount };
    });
  };

  // Verificar si un producto está en el carrito
  const isInCart = (productId: string): boolean => {
    return cart.items.some(item => item.product.id === productId);
  };

  // Obtener cantidad de un producto en el carrito
  const getCartItemQuantity = (productId: string): number => {
    const item = cart.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Vaciar el carrito
  const clearCart = () => {
    setCart({ items: [], total: 0, itemCount: 0 });
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartItemQuantity
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartProvider;