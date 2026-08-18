import { apiClient } from "@/shared/api/client";
import { Order, OrderStatus } from "../model/orderTypes";

export interface CreateOrderPayload {
  items: { productId: string; quantity: number }[];
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

export function fetchOrderById(orderId: string): Promise<Order> {
  return apiClient<Order>(`/orders/${orderId}`);
}

export function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return apiClient<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchOrders(): Promise<Order[]> {
  return apiClient<Order[]>("/orders");
}
