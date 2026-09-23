import { describe, expect, it } from "vitest";

import {
  getOrderStatusColor,
  getOrderStatusLabel,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_VALUES,
} from "./orderStatus";

describe("getOrderStatusLabel", () => {
  it("returns the Korean label for known statuses", () => {
    expect(getOrderStatusLabel("paid")).toBe("결제 완료");
    expect(getOrderStatusLabel("shipping")).toBe("배송 중");
  });

  it("falls back to a default label for unknown values", () => {
    expect(getOrderStatusLabel("unknown")).toBe("주문 확인");
  });

  it("returns a fallback color for unknown statuses", () => {
    expect(getOrderStatusColor("paid")).toBe("text-blue-600");
    expect(getOrderStatusColor("unknown")).toBe("text-gray-500");
  });

  it("keeps the filter values aligned with the label map", () => {
    expect(ORDER_STATUS_VALUES).toEqual(Object.keys(ORDER_STATUS_LABELS));
  });
});
