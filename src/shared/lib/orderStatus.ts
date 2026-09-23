import { OrderStatus } from "@/entities/order";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "결제 대기",
  paid: "결제 완료",
  preparing: "상품 준비 중",
  shipping: "배송 중",
  delivered: "배송 완료",
  cancelled: "취소됨",
  refunded: "환불 완료",
  completed: "완료됨",
};

export const ORDER_STATUS_VALUES = [
  OrderStatus.Pending,
  OrderStatus.Paid,
  OrderStatus.Preparing,
  OrderStatus.Shipping,
  OrderStatus.Delivered,
  OrderStatus.Cancelled,
  OrderStatus.Refunded,
  OrderStatus.Completed,
] as const;

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "text-yellow-600",
  paid: "text-blue-600",
  preparing: "text-indigo-600",
  shipping: "text-[#1a93e5]",
  delivered: "text-green-600",
  cancelled: "text-gray-500",
  refunded: "text-red-500",
  completed: "text-green-600",
};

function isOrderStatus(status: string): status is OrderStatus {
  return Object.prototype.hasOwnProperty.call(ORDER_STATUS_LABELS, status);
}

export function getOrderStatusLabel(status: OrderStatus | string | undefined) {
  if (!status) return "주문 확인";
  return isOrderStatus(status) ? ORDER_STATUS_LABELS[status] : "주문 확인";
}

export function getOrderStatusColor(status: OrderStatus | string | undefined) {
  if (!status) return "text-gray-500";
  return isOrderStatus(status) ? ORDER_STATUS_COLORS[status] : "text-gray-500";
}
