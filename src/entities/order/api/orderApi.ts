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

export function fetchOrderById(orderId: string): Promise<Order> {
  return fetch(`/api/orders/${orderId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }
      return response.json();
    })
    .then((data) => data as Order);
}

export function createOrder(payload: CreateOrderPayload): Promise<Order> {
  return fetch("/api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      return response.json();
    })
    .then((data) => data as Order);
}
