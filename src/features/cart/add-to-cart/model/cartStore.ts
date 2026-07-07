import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_QUANTITY = 99;

export interface CartItem {
  productId: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (productId: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (productId) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId);
          if (existing) {
            if (existing.quantity >= MAX_QUANTITY) return state;
            return {
              items: state.items.map((i) =>
                i.productId === productId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { productId, quantity: 1 }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId
              ? {
                  ...i,
                  quantity: Math.min(Math.max(1, quantity), MAX_QUANTITY),
                }
              : i,
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-storage" },
  ),
);
