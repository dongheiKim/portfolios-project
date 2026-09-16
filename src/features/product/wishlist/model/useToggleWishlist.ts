import { useWishlistStore } from "./wishlistStore";

export function useToggleWishlist(productId: number) {
  const isWishlisted = useWishlistStore((s) =>
    s.productIds.includes(productId),
  );
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);

  return { isWishlisted, toggle: () => toggleWishlist(productId) };
}
