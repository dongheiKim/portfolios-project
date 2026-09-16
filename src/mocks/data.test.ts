import { describe, expect, it } from "vitest";

import { mockOrders } from "./data";

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
