import { Order, OrderStatus } from "../model/orderTypes";

export function isOrderCompleted(order: Order): boolean {
  return order.status === OrderStatus.Completed;
}

export function canOrderBeViewed(): boolean {
  return true;
}

export function isOrderPending(order: Order): boolean {
  return order.status === OrderStatus.Pending;
}

export function isOrderCancelled(order: Order): boolean {
  return order.status === OrderStatus.Cancelled;
}

export function canOrderBeDeleted(order: Order): boolean {
  return (
    order.status === OrderStatus.Pending ||
    order.status === OrderStatus.Cancelled
  );
}
export function canOrderBeCancelled(order: Order): boolean {
  return order.status === OrderStatus.Pending;
}

export function canOrderBeCompleted(order: Order): boolean {
  return order.status === OrderStatus.Pending;
}

export function canOrderBeUpdated(order: Order): boolean {
  return order.status === OrderStatus.Pending;
}
