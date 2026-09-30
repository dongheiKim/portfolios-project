import { beforeEach, describe, expect, it } from "vitest";

import { useCartStore } from "./cartStore";

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it("adds an item and increments an existing item", () => {
    useCartStore.getState().addItem(1);
    useCartStore.getState().addItem(1);

    expect(useCartStore.getState().items).toEqual([
      { productId: 1, quantity: 2 },
    ]);
  });

  it("clamps quantities and removes items", () => {
    useCartStore.getState().addItem(1);
    useCartStore.getState().updateQuantity(1, 120);
    expect(useCartStore.getState().items[0]?.quantity).toBe(99);

    useCartStore.getState().removeItem(1);
    expect(useCartStore.getState().items).toEqual([]);
  });

  it("keeps quantities within the supported range", () => {
    useCartStore.getState().addItem(1);
    useCartStore.getState().updateQuantity(1, 0);
    expect(useCartStore.getState().items[0]?.quantity).toBe(1);

    useCartStore.getState().updateQuantity(1, 99);
    useCartStore.getState().addItem(1);
    expect(useCartStore.getState().items[0]?.quantity).toBe(99);
  });

  it("clears all cart items", () => {
    useCartStore.getState().addItem(1);
    useCartStore.getState().addItem(2);

    useCartStore.getState().clearCart();

    expect(useCartStore.getState().items).toEqual([]);
  });
});
