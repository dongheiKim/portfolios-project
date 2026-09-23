import { afterEach, describe, expect, it, vi } from "vitest";

import { AUTH_STORAGE_KEY, useAuthStore } from "./authStore";

describe("useAuthStore", () => {
  afterEach(() => {
    useAuthStore.getState().logout();
    vi.restoreAllMocks();
  });

  it("does not throw when localStorage is unavailable or rejects writes", () => {
    const originalLocalStorage = globalThis.localStorage;

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: () => {
          throw new Error("blocked");
        },
        setItem: () => {
          throw new Error("blocked");
        },
        removeItem: () => {
          throw new Error("blocked");
        },
      },
    });

    expect(() =>
      useAuthStore.getState().login(
        {
          id: 1,
          name: "Tester",
          email: "tester@example.com",
          phone: "010-0000-0000",
          addresses: [],
          createdAt: "2024-01-01T00:00:00.000Z",
        },
        "token-1",
      ),
    ).not.toThrow();

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: originalLocalStorage,
    });
  });

  it("clears stored auth data on logout", () => {
    const removeItem = vi.fn();
    const originalLocalStorage = globalThis.localStorage;

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: () => null,
        setItem: vi.fn(),
        removeItem,
      },
    });

    useAuthStore.getState().login(
      {
        id: 2,
        name: "Tester 2",
        email: "tester2@example.com",
        phone: "010-1111-2222",
        addresses: [],
        createdAt: "2024-01-01T00:00:00.000Z",
      },
      "token-2",
    );
    useAuthStore.getState().logout();

    expect(removeItem).toHaveBeenCalledWith(AUTH_STORAGE_KEY);

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: originalLocalStorage,
    });
  });
});
