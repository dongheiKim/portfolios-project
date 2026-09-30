import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { setupServer } from "msw/node";
import type { CreateOrderPayload } from "@/entities/order";
import { MAX_PASSWORD_LENGTH } from "@/features/auth/model/passwordPolicy";
import { verifyPassword } from "./mockPassword";

const server = setupServer();
const apiUrl = "http://localhost:3000";
let authorization = { Authorization: "" };
const jsonHeaders = { "Content-Type": "application/json" };
const shippingAddress: CreateOrderPayload["shippingAddress"] = {
  recipient: "테스트 사용자",
  phone: "010-1234-5678",
  address: "서울시 강남구",
  city: "서울시",
  street: "테헤란로",
  zipcode: "12345",
  addressDetail: "101호",
};

beforeAll(async () => {
  vi.stubEnv("VITE_API_BASE_URL", apiUrl);
  const { handlers } = await import("./handlers");
  server.use(...handlers);
  server.listen({ onUnhandledRequest: "error" });

  const response = await fetch(`${apiUrl}/auth/sign-in`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({
      email: "test@example.com",
      password: "password123",
    }),
  });
  const result = (await response.json()) as { token: string };
  authorization = { Authorization: `Bearer ${result.token}` };
});
afterAll(() => {
  server.close();
  vi.unstubAllEnvs();
});

describe("mock API handlers", () => {
  it("returns a client error for malformed JSON across POST handlers", async () => {
    const requests = [
      { path: "/auth/sign-in", headers: jsonHeaders },
      { path: "/auth/sign-up", headers: jsonHeaders },
      {
        path: "/orders",
        headers: { ...authorization, ...jsonHeaders },
      },
    ];

    for (const request of requests) {
      const response = await fetch(`${apiUrl}${request.path}`, {
        method: "POST",
        headers: request.headers,
        body: "{invalid-json",
      });

      expect(response.status).toBe(400);
    }
  });

  it("rejects invalid credentials and omits the password from sign-in responses", async () => {
    const invalidResponse = await fetch(`${apiUrl}/auth/sign-in`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        email: "test@example.com",
        password: "wrong-password",
      }),
    });
    expect(invalidResponse.status).toBe(401);

    const validResponse = await fetch(`${apiUrl}/auth/sign-in`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });
    const result = await validResponse.json();

    expect(validResponse.status).toBe(200);
    expect(result.user).not.toHaveProperty("password");
    expect(result.token).toEqual(expect.any(String));
  });

  it("persists issued token mappings in localStorage", async () => {
    let storedTokens: string | null = null;
    const originalLocalStorage = globalThis.localStorage;
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: () => storedTokens,
        setItem: (_key: string, value: string) => {
          storedTokens = value;
        },
        removeItem: () => {
          storedTokens = null;
        },
      },
    });

    try {
      const response = await fetch(`${apiUrl}/auth/sign-in`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });
      const { token } = (await response.json()) as { token: string };

      expect(JSON.parse(storedTokens ?? "{}")).toMatchObject({ [token]: 1 });
    } finally {
      Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it("rejects sign-in and sign-up payloads with invalid field types", async () => {
    const invalidSignInPayloads = [
      null,
      [],
      { email: 1, password: "password123" },
      { email: "test@example.com", password: "" },
      {
        email: "test@example.com",
        password: "x".repeat(MAX_PASSWORD_LENGTH + 1),
      },
    ];
    const invalidSignUpPayloads = [
      null,
      [],
      { name: 1, email: "new@example.com", password: "password123" },
      { name: "Tester", email: "new@example.com", password: 12345678 },
      {
        name: "Tester",
        email: "too-long@example.com",
        password: "x".repeat(MAX_PASSWORD_LENGTH + 1),
      },
    ];

    for (const payload of invalidSignInPayloads) {
      const response = await fetch(`${apiUrl}/auth/sign-in`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify(payload),
      });
      expect(response.status).toBe(400);
    }

    for (const payload of invalidSignUpPayloads) {
      const response = await fetch(`${apiUrl}/auth/sign-up`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify(payload),
      });
      expect(response.status).toBe(400);
    }
  });

  it("validates sign-up fields and rejects duplicate email addresses", async () => {
    const invalidPayloads = [
      { name: "  ", email: "valid@example.com", password: "password123" },
      { name: "Tester", email: "invalid-email", password: "password123" },
      { name: "Tester", email: "valid@example.com", password: "short" },
    ];

    for (const payload of invalidPayloads) {
      const response = await fetch(`${apiUrl}/auth/sign-up`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify(payload),
      });

      expect(response.status).toBe(400);
    }

    const duplicateResponse = await fetch(`${apiUrl}/auth/sign-up`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        name: "Tester",
        email: "test@example.com",
        password: "password123",
      }),
    });
    expect(duplicateResponse.status).toBe(409);

    const email = `new-user-${Date.now()}@example.com`;
    const validResponse = await fetch(`${apiUrl}/auth/sign-up`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        name: "  New User  ",
        email,
        password: "password123",
      }),
    });
    const result = await validResponse.json();

    expect(validResponse.status).toBe(200);
    expect(result.user).toMatchObject({ name: "New User", email });
    expect(result.user).not.toHaveProperty("password");
  });

  it("persists registered users for a restored mock session", async () => {
    let storedUsers: string | null = null;
    const originalLocalStorage = globalThis.localStorage;
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: () => storedUsers,
        setItem: (key: string, value: string) => {
          if (key === "mock-users") storedUsers = value;
        },
        removeItem: () => {
          storedUsers = null;
        },
      },
    });

    try {
      const email = `persisted-user-${Date.now()}@example.com`;
      const response = await fetch(`${apiUrl}/auth/sign-up`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({
          name: "Persisted User",
          email,
          password: "password123",
        }),
      });

      expect(response.status).toBe(200);
      const persistedUser = (
        JSON.parse(storedUsers ?? "[]") as {
          email: string;
          name: string;
          passwordSalt: string;
          passwordHash: string;
        }[]
      ).find((user) => user.email === email);
      if (!persistedUser) throw new Error("가입 사용자 저장에 실패했습니다.");

      expect(persistedUser).toMatchObject({ name: "Persisted User", email });
      expect(persistedUser).not.toHaveProperty("password");
      await expect(
        verifyPassword(
          "password123",
          persistedUser.passwordSalt,
          persistedUser.passwordHash,
        ),
      ).resolves.toBe(true);

      const { mockUsers, restorePersistedMockUsers } = await import("./data");
      const [restoredUser] = restorePersistedMockUsers([persistedUser]);
      const userIndex = mockUsers.findIndex((user) => user.email === email);
      mockUsers.splice(userIndex, 1, restoredUser);

      const signInResponse = await fetch(`${apiUrl}/auth/sign-in`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({ email, password: "password123" }),
      });
      expect(signInResponse.status).toBe(200);
    } finally {
      Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it("requires authentication for order list, create, and detail endpoints", async () => {
    const responses = await Promise.all([
      fetch(`${apiUrl}/orders`),
      fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({}),
      }),
      fetch(`${apiUrl}/orders/1001`),
    ]);

    expect(responses.map((response) => response.status)).toEqual([
      401, 401, 401,
    ]);
    await expect(responses[0].json()).resolves.toEqual({
      message: "인증이 필요합니다.",
    });
  });

  it("rejects tokens that were not issued by sign-in or sign-up", async () => {
    const forgedTokens = ["mock-token-1-123", "mock-token-999-123", "random"];
    const responses = await Promise.all(
      forgedTokens.map((token) =>
        fetch(`${apiUrl}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ),
    );

    expect(responses.map((response) => response.status)).toEqual([
      401, 401, 401,
    ]);
  });

  it("rejects a token removed from shared storage despite an in-memory entry", async () => {
    const storage = new Map<string, string>();
    const originalLocalStorage = globalThis.localStorage;
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      },
    });

    try {
      const signInResponse = await fetch(`${apiUrl}/auth/sign-in`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });
      const { token } = (await signInResponse.json()) as { token: string };
      storage.delete("mock-auth-tokens");

      const ordersResponse = await fetch(`${apiUrl}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      expect(ordersResponse.status).toBe(401);
    } finally {
      Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it("revokes an issued token on sign-out", async () => {
    const signInResponse = await fetch(`${apiUrl}/auth/sign-in`, {
      method: "POST",
      headers: jsonHeaders,
      body: JSON.stringify({
        email: "test@example.com",
        password: "password123",
      }),
    });
    const { token } = (await signInResponse.json()) as { token: string };
    const tokenHeaders = { Authorization: `Bearer ${token}` };

    const signOutResponse = await fetch(`${apiUrl}/auth/sign-out`, {
      method: "POST",
      headers: tokenHeaders,
    });

    expect(signOutResponse.status).toBe(200);
    const ordersResponse = await fetch(`${apiUrl}/orders`, {
      headers: tokenHeaders,
    });
    expect(ordersResponse.status).toBe(401);
  });

  it("keeps edited addresses after signing out and back in", async () => {
    const storage = new Map<string, string>();
    const originalLocalStorage = globalThis.localStorage;
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      },
    });

    try {
      const signInResponse = await fetch(`${apiUrl}/auth/sign-in`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });
      const { token } = (await signInResponse.json()) as { token: string };
      const headers = {
        Authorization: `Bearer ${token}`,
        ...jsonHeaders,
      };
      const addresses = [
        {
          id: 22,
          label: "회사",
          recipient: "김쿠팡",
          phone: "010-2222-3333",
          zipCode: "54321",
          address: "부산시 해운대구",
          addressDetail: "202호",
          isDefault: true,
        },
      ];
      const updateResponse = await fetch(`${apiUrl}/auth/profile`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ addresses }),
      });

      expect(updateResponse.status).toBe(200);
      expect(
        JSON.parse(storage.get("mock-user-profiles") ?? "[]"),
      ).toContainEqual({
        userId: 1,
        addresses,
      });

      const signOutResponse = await fetch(`${apiUrl}/auth/sign-out`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(signOutResponse.status).toBe(200);

      const reSignInResponse = await fetch(`${apiUrl}/auth/sign-in`, {
        method: "POST",
        headers: jsonHeaders,
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      });
      const reSignedInUser = await reSignInResponse.json();

      expect(reSignInResponse.status).toBe(200);
      expect(reSignedInUser.user.addresses).toEqual(addresses);
    } finally {
      Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it("rejects invalid or unauthenticated address updates", async () => {
    const validAddress = {
      id: 1,
      label: "집",
      recipient: "테스트 사용자",
      phone: "010-1234-5678",
      zipCode: "12345",
      address: "서울시 강남구",
      addressDetail: "101호",
      isDefault: true,
    };
    const invalidBodies = [
      { addresses: [{ ...validAddress, label: "  " }] },
      { addresses: [{ ...validAddress, recipient: "  " }] },
      { addresses: [validAddress, { ...validAddress, id: 2 }] },
    ];
    const unauthenticatedResponse = await fetch(`${apiUrl}/auth/profile`, {
      method: "PATCH",
      headers: jsonHeaders,
      body: JSON.stringify({ addresses: [validAddress] }),
    });
    expect(unauthenticatedResponse.status).toBe(401);

    for (const body of invalidBodies) {
      const response = await fetch(`${apiUrl}/auth/profile`, {
        method: "PATCH",
        headers: { ...authorization, ...jsonHeaders },
        body: JSON.stringify(body),
      });

      expect(response.status).toBe(400);
    }
  });

  it("rejects an order without items or a shipping address", async () => {
    const headers = {
      ...authorization,
      "Content-Type": "application/json",
    };
    const invalidPayloads = [
      { items: [], shippingAddress: {} },
      { items: [{ productId: 1, quantity: 1 }], shippingAddress: null },
      {
        items: [
          {
            productId: 1,
            quantity: 1,
            productImage: "/product.png",
            productName: "테스트 상품",
            price: 39900,
          },
        ],
        shippingAddress,
        paymentMethod: "crypto",
      },
      {
        items: [
          {
            productId: 1,
            quantity: 1,
            productImage: "/product.png",
            productName: "테스트 상품",
            price: 39900,
          },
        ],
        shippingAddress: { ...shippingAddress, recipient: "  " },
        paymentMethod: "card",
      },
    ];

    for (const payload of invalidPayloads) {
      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      expect(response.status).toBe(400);
    }
  });

  it("rejects item quantities outside the supported range", async () => {
    const headers = {
      ...authorization,
      "Content-Type": "application/json",
    };

    for (const quantity of [0, 100]) {
      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          items: [
            {
              productId: 1,
              quantity,
              productImage: "/product.png",
              productName: "테스트 상품",
              price: 39900,
            },
          ],
          shippingAddress,
          paymentMethod: "card",
        }),
      });

      expect(response.status).toBe(400);
    }
  });

  it("rejects product IDs outside the base and generated mock catalogs", async () => {
    const invalidProductIds = [19, 999, 1014, 19001];

    for (const productId of invalidProductIds) {
      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          ...authorization,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              productId,
              quantity: 1,
              productImage: "/product.png",
              productName: "테스트 상품",
              price: 1000,
            },
          ],
          shippingAddress,
          paymentMethod: "card",
        }),
      });

      expect(response.status).toBe(400);
    }
  });

  it("accepts generated product IDs at the supported category boundaries", async () => {
    for (const productId of [1001, 18013]) {
      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          ...authorization,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              productId,
              quantity: 1,
              productImage: "/product.png",
              productName: "테스트 상품",
              price: 1000,
            },
          ],
          shippingAddress,
          paymentMethod: "card",
        }),
      });

      expect(response.status).toBe(201);
    }
  });

  it("persists created orders together with their owner", async () => {
    const values = new Map<string, string>();
    const originalLocalStorage = globalThis.localStorage;
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
      },
    });

    try {
      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          ...authorization,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              productId: 1,
              quantity: 1,
              productImage: "/product.png",
              productName: "테스트 상품",
              price: 1,
            },
          ],
          shippingAddress,
          paymentMethod: "card",
        }),
      });
      const order = await response.json();

      expect(response.status).toBe(201);
      const savedOrders = JSON.parse(values.get("mock-orders") ?? "[]");
      expect(savedOrders).toContainEqual(
        expect.objectContaining({
          userId: 1,
          order: expect.objectContaining({ id: order.id, totalPrice: 39900 }),
        }),
      );
    } finally {
      Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: originalLocalStorage,
      });
    }
  });

  it("creates an authenticated order and allows its owner to fetch it", async () => {
    const payload: CreateOrderPayload = {
      items: [
        {
          productId: 1,
          quantity: 2,
          productImage: "/product.png",
          productName: "변조된 상품명",
          price: 1,
        },
      ],
      shippingAddress,
      paymentMethod: "card",
    };
    const response = await fetch(`${apiUrl}/orders`, {
      method: "POST",
      headers: {
        ...authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(201);
    const createdOrder = await response.json();
    expect(createdOrder).toMatchObject({
      totalPrice: 79800,
      items: [
        {
          productId: "1",
          quantity: 2,
          productName: "무선 블루투스 이어폰",
          price: 39900,
        },
      ],
      shippingAddress,
    });

    const detailResponse = await fetch(`${apiUrl}/orders/${createdOrder.id}`, {
      headers: authorization,
    });

    expect(detailResponse.status).toBe(200);
    await expect(detailResponse.json()).resolves.toMatchObject({
      id: createdOrder.id,
      totalPrice: 79800,
    });

    const signUpResponse = await fetch(`${apiUrl}/auth/sign-up`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "다른 사용자",
        email: "order-owner-test@example.com",
        password: "password123",
      }),
    });
    const otherUser = (await signUpResponse.json()) as { token: string };
    expect(signUpResponse.status).toBe(200);

    const otherUserOrdersResponse = await fetch(`${apiUrl}/orders`, {
      headers: { Authorization: `Bearer ${otherUser.token}` },
    });
    expect(otherUserOrdersResponse.status).toBe(200);
    await expect(otherUserOrdersResponse.json()).resolves.toEqual([]);

    const foreignOrderResponse = await fetch(
      `${apiUrl}/orders/${createdOrder.id}`,
      { headers: { Authorization: `Bearer ${otherUser.token}` } },
    );

    expect(foreignOrderResponse.status).toBe(404);
  });
});
