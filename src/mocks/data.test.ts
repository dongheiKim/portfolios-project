import { describe, expect, it } from "vitest";

import {
  mockOrders,
  restorePersistedMockOrders,
  restorePersistedMockUserProfiles,
  restorePersistedMockUsers,
} from "./data";
import { MAX_PASSWORD_LENGTH } from "@/features/auth/model/passwordPolicy";

describe("mock order data", () => {
  it("contains orders with valid totals and supported statuses", () => {
    expect(mockOrders.length).toBeGreaterThan(0);

    for (const order of mockOrders) {
      expect(order.items.length).toBeGreaterThan(0);
      expect(order.totalPrice).toBe(
        order.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        ),
      );
      expect([
        "pending",
        "paid",
        "preparing",
        "shipping",
        "delivered",
        "cancelled",
        "refunded",
        "completed",
      ]).toContain(order.status);
    }
  });
});

describe("persisted mock users", () => {
  it("restores valid unique registrations and ignores invalid or seeded duplicates", () => {
    const user = {
      id: 2,
      name: "New User",
      email: "new@example.com",
      passwordSalt: "a".repeat(32),
      passwordHash: "b".repeat(64),
      addresses: [],
      createdAt: "2026-09-30T00:00:00.000Z",
    };

    expect(
      restorePersistedMockUsers([
        user,
        { ...user, id: 3, email: "NEW@example.com" },
        { ...user, id: 1, email: "another@example.com" },
        { ...user, id: 0, email: "zero-id@example.com" },
        { ...user, id: 5, name: "  ", email: "blank-name@example.com" },
        { ...user, id: 6, email: "invalid-email" },
        {
          ...user,
          id: 7,
          email: "invalid-verifier@example.com",
          passwordSalt: "not-hex",
        },
        {
          ...user,
          id: 8,
          email: "oversized-password@example.com",
          password: "x".repeat(MAX_PASSWORD_LENGTH + 1),
          passwordSalt: undefined,
          passwordHash: undefined,
        },
        { ...user, id: 4, email: "broken@example.com", addresses: null },
      ]),
    ).toEqual([user]);
  });

  it("returns no registrations for malformed storage data", () => {
    expect(restorePersistedMockUsers(null)).toEqual([]);
    expect(restorePersistedMockUsers({ users: [] })).toEqual([]);
  });

  it("normalizes restored user names and email addresses", () => {
    const user = {
      id: 8,
      name: "  New User  ",
      email: "  NEW@example.com ",
      passwordSalt: "a".repeat(32),
      passwordHash: "b".repeat(64),
      addresses: [],
      createdAt: "2026-09-30T00:00:00.000Z",
    };

    expect(restorePersistedMockUsers([user])).toEqual([
      { ...user, name: "New User", email: "new@example.com" },
    ]);
  });

  it("rejects registrations with duplicate address IDs or multiple defaults", () => {
    const address = {
      id: 1,
      label: "집",
      recipient: "테스트 사용자",
      phone: "010-1234-5678",
      zipCode: "12345",
      address: "서울시 강남구",
      addressDetail: "101호",
      isDefault: true,
    };
    const user = {
      id: 2,
      name: "New User",
      email: "new@example.com",
      passwordSalt: "a".repeat(32),
      passwordHash: "b".repeat(64),
      addresses: [address],
      createdAt: "2026-09-30T00:00:00.000Z",
    };

    expect(
      restorePersistedMockUsers([
        user,
        {
          ...user,
          id: 3,
          email: "duplicate-ids@example.com",
          addresses: [address, { ...address, isDefault: false }],
        },
        {
          ...user,
          id: 4,
          email: "multiple-defaults@example.com",
          addresses: [address, { ...address, id: 2 }],
        },
      ]),
    ).toEqual([user]);
  });
});

describe("persisted mock user profiles", () => {
  it("restores one valid address override only for known users", () => {
    const address = {
      id: 2,
      label: "회사",
      recipient: "테스트 사용자",
      phone: "010-1234-5678",
      zipCode: "12345",
      address: "서울시 강남구",
      addressDetail: "101호",
      isDefault: true,
    };

    expect(
      restorePersistedMockUserProfiles([
        { userId: 1, addresses: [address] },
        { userId: 1, addresses: [address] },
        { userId: 999, addresses: [address] },
        { userId: 1, addresses: [{ ...address, isDefault: "yes" }] },
        {
          userId: 1,
          addresses: [address, { ...address, id: 3, isDefault: true }],
        },
      ]),
    ).toEqual([{ userId: 1, addresses: [address] }]);
  });

  it("rejects profiles with duplicate address IDs", () => {
    const address = {
      id: 2,
      label: "집",
      recipient: "테스트 사용자",
      phone: "010-1234-5678",
      zipCode: "12345",
      address: "서울시 강남구",
      addressDetail: "101호",
      isDefault: true,
    };

    expect(
      restorePersistedMockUserProfiles([
        {
          userId: 1,
          addresses: [address, { ...address, label: "회사", isDefault: false }],
        },
      ]),
    ).toEqual([]);
  });

  it("rejects addresses with invalid IDs or blank required fields", () => {
    const address = {
      id: 2,
      label: "집",
      recipient: "테스트 사용자",
      phone: "010-1234-5678",
      zipCode: "12345",
      address: "서울시 강남구",
      addressDetail: "101호",
      isDefault: true,
    };

    for (const invalidAddress of [
      { ...address, id: -1 },
      { ...address, label: "  " },
      { ...address, recipient: "  " },
      { ...address, address: "  " },
    ]) {
      expect(
        restorePersistedMockUserProfiles([
          { userId: 1, addresses: [invalidAddress] },
        ]),
      ).toEqual([]);
    }
  });
});

describe("persisted mock orders", () => {
  it("restores valid orders with Date instances and skips invalid owners or dates", () => {
    const order = {
      id: "1004",
      totalPrice: 1200,
      items: [
        {
          productId: "1",
          quantity: 1,
          productImage: "/product.png",
          productName: "테스트 상품",
          price: 1200,
        },
      ],
      status: "paid",
      createdAt: "2026-09-30T00:00:00.000Z",
      updatedAt: "2026-09-30T00:00:00.000Z",
      shippingAddress: {
        recipient: "테스트 사용자",
        phone: "010-1234-5678",
        address: "서울시 강남구",
        city: "서울시",
        street: "테헤란로",
        zipcode: "12345",
        addressDetail: "101호",
      },
    };

    const restored = restorePersistedMockOrders([
      { userId: 1, order },
      { userId: 999, order: { ...order, id: "1005" } },
      {
        userId: 1,
        order: { ...order, id: "1006", createdAt: "invalid-date" },
      },
      { userId: 1, order: { ...order, id: "1007", items: [null] } },
      { userId: 1, order: { ...order, id: "not-a-number" } },
      { userId: 1, order: { ...order, id: "9007199254740992" } },
      {
        userId: 1,
        order: {
          ...order,
          id: "1008",
          items: [{ ...order.items[0], productId: "not-a-product" }],
        },
      },
      {
        userId: 1,
        order: {
          ...order,
          id: "1009",
          items: [{ ...order.items[0], productId: "19" }],
        },
      },
      {
        userId: 1,
        order: {
          ...order,
          id: "1010",
          shippingAddress: { ...order.shippingAddress, address: "  " },
        },
      },
    ]);

    expect(restored).toHaveLength(1);
    expect(restored[0].userId).toBe(1);
    expect(restored[0].order.createdAt).toBeInstanceOf(Date);
    expect(restored[0].order.totalPrice).toBe(1200);
  });

  it("rejects malformed storage payloads", () => {
    expect(restorePersistedMockOrders(null)).toEqual([]);
    expect(restorePersistedMockOrders({ orders: [] })).toEqual([]);
  });
});
