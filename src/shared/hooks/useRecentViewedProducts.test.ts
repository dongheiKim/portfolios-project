import { describe, expect, it, vi } from "vitest";

import { pushRecentViewedProduct } from "./useRecentViewedProducts";

describe("pushRecentViewedProduct", () => {
  it("does not throw when localStorage is unavailable", () => {
    const dispatchEvent = vi.fn();
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();

    vi.stubGlobal("window", {
      localStorage: undefined,
      addEventListener,
      removeEventListener,
      dispatchEvent,
    });

    expect(() =>
      pushRecentViewedProduct({
        id: 1,
        name: "Desk Lamp",
        imageUrl: "https://example.com/lamp.jpg",
        price: 10000,
      }),
    ).not.toThrow();
  });
});
