import { describe, expect, it } from "vitest";

import { formatShippingAddress } from "./orderAddress";
import type { ShippingAddress } from "./orderTypes";

describe("formatShippingAddress", () => {
  it("formats the postal code, base address, and detail once", () => {
    const address: ShippingAddress = {
      recipient: "홍길동",
      phone: "010-1111-2222",
      zipcode: "12345",
      address: "서울시 강남구 테헤란로 1",
      addressDetail: "101호",
      city: "서울시 강남구 테헤란로 1",
      street: "101호",
    };

    expect(formatShippingAddress(address)).toBe(
      "(12345) 서울시 강남구 테헤란로 1 101호",
    );
  });

  it("omits empty optional address parts", () => {
    expect(
      formatShippingAddress({
        zipcode: "",
        address: "서울시 강남구",
        addressDetail: "",
      }),
    ).toBe("서울시 강남구");
  });
});
