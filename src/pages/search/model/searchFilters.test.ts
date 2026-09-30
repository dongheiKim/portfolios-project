import { describe, expect, it } from "vitest";

import { isInvalidPriceRange, parsePriceInput } from "./searchFilters";

describe("search filters", () => {
  it("parses empty, zero, and whole-number price inputs", () => {
    expect(parsePriceInput("")).toBeNull();
    expect(parsePriceInput("  ")).toBeNull();
    expect(parsePriceInput("0")).toBe(0);
    expect(parsePriceInput("12500")).toBe(12500);
  });

  it("rejects negative, fractional, and unsafe price inputs", () => {
    expect(parsePriceInput("-1")).toBeNull();
    expect(parsePriceInput("12.5")).toBeNull();
    expect(parsePriceInput("9007199254740992")).toBeNull();
  });

  it("allows open and equal-ended ranges but detects reversed bounds", () => {
    expect(isInvalidPriceRange(null, null)).toBe(false);
    expect(isInvalidPriceRange(1000, null)).toBe(false);
    expect(isInvalidPriceRange(1000, 1000)).toBe(false);
    expect(isInvalidPriceRange(2000, 1000)).toBe(true);
  });
});
