import { describe, expect, it } from "vitest";

import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats numbers with Korean locale grouping", () => {
    expect(formatPrice(1234567)).toBe("1,234,567");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("0");
  });
});