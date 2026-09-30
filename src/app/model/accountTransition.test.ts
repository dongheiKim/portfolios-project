import { describe, expect, it } from "vitest";

import { shouldClearUserScopedState } from "./accountTransition";

describe("shouldClearUserScopedState", () => {
  it("preserves guest state on initial login and same-account updates", () => {
    expect(shouldClearUserScopedState(null, 1)).toBe(false);
    expect(shouldClearUserScopedState(1, 1)).toBe(false);
  });

  it("clears state when switching accounts or logging out", () => {
    expect(shouldClearUserScopedState(1, 2)).toBe(true);
    expect(shouldClearUserScopedState(1, null)).toBe(true);
  });
});
