import { describe, expect, it } from "vitest";

import {
  isPasswordLengthValid,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from "./passwordPolicy";

describe("isPasswordLengthValid", () => {
  it("accepts passwords at the supported boundaries", () => {
    expect(isPasswordLengthValid("x".repeat(MIN_PASSWORD_LENGTH))).toBe(true);
    expect(isPasswordLengthValid("x".repeat(MAX_PASSWORD_LENGTH))).toBe(true);
  });

  it("rejects passwords outside the supported range", () => {
    expect(isPasswordLengthValid("x".repeat(MIN_PASSWORD_LENGTH - 1))).toBe(
      false,
    );
    expect(isPasswordLengthValid("x".repeat(MAX_PASSWORD_LENGTH + 1))).toBe(
      false,
    );
  });
});
