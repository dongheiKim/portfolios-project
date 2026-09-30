import { beforeEach, describe, expect, it } from "vitest";

import { useWishlistStore } from "./wishlistStore";

describe("useWishlistStore", () => {
  beforeEach(() => {
    useWishlistStore.setState({ productIds: [] });
  });

  it("tracks wishlist items and toggles them off", () => {
    useWishlistStore.getState().toggleWishlist(1);
    expect(useWishlistStore.getState().productIds).toEqual([1]);

    useWishlistStore.getState().toggleWishlist(1);
    expect(useWishlistStore.getState().productIds).toEqual([]);
  });

  it("clears all wishlist items", () => {
    useWishlistStore.getState().toggleWishlist(1);
    useWishlistStore.getState().toggleWishlist(2);

    useWishlistStore.getState().clearWishlist();

    expect(useWishlistStore.getState().productIds).toEqual([]);
  });
});
