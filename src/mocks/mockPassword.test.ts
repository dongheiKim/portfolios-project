import { describe, expect, it } from "vitest";

import { createPasswordVerifier, verifyPassword } from "./mockPassword";
import { MAX_PASSWORD_LENGTH } from "@/features/auth/model/passwordPolicy";

describe("mock password verifier", () => {
  it("verifies a password without storing the original value", async () => {
    const verifier = await createPasswordVerifier("password123");

    expect(verifier.passwordSalt).not.toBe("password123");
    expect(verifier.passwordHash).not.toContain("password123");
    await expect(
      verifyPassword(
        "password123",
        verifier.passwordSalt,
        verifier.passwordHash,
      ),
    ).resolves.toBe(true);
    await expect(
      verifyPassword(
        "wrong-password",
        verifier.passwordSalt,
        verifier.passwordHash,
      ),
    ).resolves.toBe(false);
  });

  it("rejects malformed verifiers", async () => {
    await expect(
      verifyPassword("password123", "invalid", "invalid"),
    ).resolves.toBe(false);
  });

  it("rejects unsupported password lengths before derivation", async () => {
    await expect(
      createPasswordVerifier("x".repeat(MAX_PASSWORD_LENGTH + 1)),
    ).rejects.toThrow(RangeError);
    await expect(
      verifyPassword(
        "x".repeat(MAX_PASSWORD_LENGTH + 1),
        "a".repeat(32),
        "b".repeat(64),
      ),
    ).resolves.toBe(false);
  });
});
