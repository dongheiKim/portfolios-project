import { describe, expect, it } from "vitest";

import { createAddressDraft, normalizeAddressDraft } from "./addressForm";

const validAddress = {
  id: 1,
  label: " 집 ",
  recipient: " 홍길동 ",
  phone: " 010-1234-5678 ",
  zipCode: " 12345 ",
  address: " 서울시 강남구 ",
  addressDetail: " 101호 ",
  isDefault: true,
};

describe("normalizeAddressDraft", () => {
  it("trims address fields before saving", () => {
    expect(normalizeAddressDraft(validAddress)).toEqual({
      ...validAddress,
      label: "집",
      recipient: "홍길동",
      phone: "010-1234-5678",
      zipCode: "12345",
      address: "서울시 강남구",
      addressDetail: "101호",
    });
  });

  it("rejects blank required fields but allows an empty detail address", () => {
    expect(
      normalizeAddressDraft({ ...validAddress, recipient: "  " }),
    ).toBeNull();
    expect(normalizeAddressDraft({ ...validAddress, address: " " })).toBeNull();
    expect(
      normalizeAddressDraft({ ...validAddress, addressDetail: " " })
        ?.addressDetail,
    ).toBe("");
  });
});

describe("createAddressDraft", () => {
  it("avoids reusing an existing ID when created during the same millisecond", () => {
    const existingAddresses = [
      { ...validAddress, id: 100 },
      { ...validAddress, id: 101 },
    ];

    expect(createAddressDraft(existingAddresses, 100).id).toBe(102);
  });

  it("uses the current timestamp when it is greater than existing IDs", () => {
    expect(createAddressDraft([{ ...validAddress, id: 10 }], 100).id).toBe(100);
  });

  it("falls back to an unused safe integer at the numeric limit", () => {
    const addressId = createAddressDraft(
      [{ ...validAddress, id: Number.MAX_SAFE_INTEGER }],
      Number.MAX_SAFE_INTEGER,
    ).id;

    expect(addressId).toBe(1);
    expect(Number.isSafeInteger(addressId)).toBe(true);
  });
});
