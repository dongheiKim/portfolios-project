import { Order, OrderStatus } from "../model/orderTypes";

export interface CreateOrderPayload {
  items: Pick<Order, "productId" | "quantity">[];
  shippingAddress: Order["shippingAddress"];
}

export function isOrderCompleted(order: Order): boolean {
  return order.status === OrderStatus.Completed;
}

export function isOrderPending(order: Order): boolean {
  return order.status === OrderStatus.Pending;
}

export function isOrderCancelled(order: Order): boolean {
  return order.status === OrderStatus.Cancelled;
}

export function canOrderBeViewed(): boolean {
  return true;
}
