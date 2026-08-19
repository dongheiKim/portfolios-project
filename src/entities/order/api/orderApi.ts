import { apiClient } from "@/shared/api/client";
import { Order } from "../model/orderTypes";

export function fetchOrderById(orderId: string): Promise<Order> {
  return apiClient<Order>(`/orders/${orderId}`);
}

export function fetchOrders(): Promise<Order[]> {
  return apiClient<Order[]>("/orders");
}
