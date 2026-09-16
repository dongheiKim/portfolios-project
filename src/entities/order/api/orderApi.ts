import { apiClient } from "@/shared/api/client";
import type { CreateOrderPayload, Order } from "../model/orderTypes";

export function fetchOrderById(orderId: string): Promise<Order> {
  return apiClient<Order>(`/orders/${orderId}`);
}

export function fetchOrders(): Promise<Order[]> {
  return apiClient<Order[]>("/orders");
}

export function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return apiClient<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
