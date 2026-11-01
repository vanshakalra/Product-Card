'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type CartState = {
  count: number;
  wishlist: Set<string>;
  addToCart: (id: string) => void;
  toggleWishlist: (id: string) => boolean;
};

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());

  const addToCart = useCallback((_id: string) => {
    setCount((c) => c + 1);
  }, []);

  /** Optimistic toggle: returns the new state so the button can animate immediately. */
  const toggleWishlist = useCallback((id: string) => {
    let next = false;
    setWishlist((prev) => {
      const copy = new Set(prev);
      if (copy.has(id)) {
        copy.delete(id);
        next = false;
      } else {
        copy.add(id);
        next = true;
      }
      return copy;
    });
    return next;
  }, []);

  const value = useMemo(
    () => ({ count, wishlist, addToCart, toggleWishlist }),
    [count, wishlist, addToCart, toggleWishlist],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
