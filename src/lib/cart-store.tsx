'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type CartState = {
  count: number;
  items: Set<string>;
  wishlist: Set<string>;
  addToCart: (id: string) => void;
  toggleWishlist: (id: string) => boolean;
};

const CartContext = createContext<CartState | null>(null);

const KEY = 'product-card-demo-cart';

/** sessionStorage can throw (private mode, blocked site data), so every access is guarded. */
function readStored(): { items: string[]; wishlist: string[]; count: number } | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<Set<string>>(() => new Set());
  const [wishlist, setWishlist] = useState<Set<string>>(() => new Set());

  // Rehydrate after mount so the server and client render the same first pass.
  useEffect(() => {
    const stored = readStored();
    if (!stored) return;
    setCount(stored.count ?? 0);
    setItems(new Set(stored.items ?? []));
    setWishlist(new Set(stored.wishlist ?? []));
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        KEY,
        JSON.stringify({ count, items: [...items], wishlist: [...wishlist] }),
      );
    } catch {
      /* storage unavailable — the cart just won't survive a reload */
    }
  }, [count, items, wishlist]);

  const addToCart = useCallback((id: string) => {
    setCount((c) => c + 1);
    setItems((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
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
    () => ({ count, items, wishlist, addToCart, toggleWishlist }),
    [count, items, wishlist, addToCart, toggleWishlist],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
