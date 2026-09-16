import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  productIds: number[];
  toggleWishlist: (productId: number) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      productIds: [],
      toggleWishlist: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId],
        })),
    }),
    { name: "wishlist-storage" },
  ),
);
