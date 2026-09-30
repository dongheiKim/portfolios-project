import { describe, expect, it } from "vitest";

import { createInitialShippingAddress } from "./checkoutAddress";

describe("createInitialShippingAddress", () => {
  it("prefers the default address when available", () => {
    const address = createInitialShippingAddress({
      id: 1,
      name: "홍길동",
      email: "hong@example.com",
      phone: "010-1111-2222",
      addresses: [
        {
          id: 1,
          label: "집",
          recipient: "홍길동",
          phone: "010-1111-2222",
          zipCode: "12345",
          address: "서울시 강남구 테헤란로 1",
          addressDetail: "101호",
          isDefault: true,
        },
      ],
      createdAt: "2024-01-01T00:00:00.000Z",
    });

    expect(address).toMatchObject({
      recipient: "홍길동",
      phone: "010-1111-2222",
      zipcode: "12345",
      address: "서울시 강남구 테헤란로 1",
      addressDetail: "101호",
      city: "",
      street: "",
    });
  });

  it("falls back to user profile when no saved address exists", () => {
    const address = createInitialShippingAddress({
      id: 2,
      name: "김철수",
      email: "kim@example.com",
      phone: "010-9999-8888",
      addresses: [],
      createdAt: "2024-01-02T00:00:00.000Z",
    });

    expect(address).toMatchObject({
      recipient: "김철수",
      phone: "010-9999-8888",
      zipcode: "",
      address: "",
      city: "",
      street: "",
      addressDetail: "",
    });
  });
});
