import { afterEach, describe, expect, it, vi } from "vitest";

import { apiClient } from "./client";

describe("apiClient", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not throw when localStorage is unavailable", async () => {
    const originalLocalStorage = globalThis.localStorage;
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: undefined,
    });

    vi.stubGlobal("fetch", fetchMock);

    await expect(apiClient("/test")).resolves.toEqual({ ok: true });

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: originalLocalStorage,
    });
  });

  it("attaches the persisted auth token to requests", async () => {
    const originalLocalStorage = globalThis.localStorage;
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: () =>
          JSON.stringify({ state: { token: "token-1" }, version: 0 }),
      },
    });
    vi.stubGlobal("fetch", fetchMock);

    await apiClient("/orders");

    expect(fetchMock).toHaveBeenCalledWith(
      "/orders",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer token-1",
        }),
      }),
    );

    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: originalLocalStorage,
    });
  });

  it("converts JSON API errors into useful messages", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "권한이 없습니다." }), {
        status: 403,
        statusText: "Forbidden",
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiClient("/orders")).rejects.toThrow(
      "API 403: 권한이 없습니다.",
    );
  });
});
