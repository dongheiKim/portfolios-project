import { describe, expect, it } from "vitest";

import { formatDate, formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats numbers with Korean locale grouping", () => {
    expect(formatPrice(1234567)).toBe("1,234,567");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("0");
  });
});

describe("formatDate", () => {
  it("formats valid dates with the Korean locale", () => {
    expect(
      formatDate("2026-09-23T12:00:00.000Z", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    ).toContain("2026년");
  });

  it("returns a fallback for invalid dates", () => {
    expect(formatDate("invalid-date", { year: "numeric" })).toBe(
      "날짜 확인 필요",
    );
  });
});
