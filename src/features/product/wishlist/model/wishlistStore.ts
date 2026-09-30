import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSafeJSONStorage } from "@/shared/lib/safeBrowserStorage";

interface WishlistState {
  productIds: number[];
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  toggleWishlist: (productId: number) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      productIds: [],
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      toggleWishlist: (productId) =>
        set((state) => ({
          productIds: state.productIds.includes(productId)
            ? state.productIds.filter((id) => id !== productId)
            : [...state.productIds, productId],
        })),
      clearWishlist: () => set({ productIds: [] }),
    }),
    {
      name: "wishlist-storage",
      partialize: (state) => ({ productIds: state.productIds }),
      storage: createSafeJSONStorage(),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
