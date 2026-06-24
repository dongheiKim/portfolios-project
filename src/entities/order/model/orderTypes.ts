export type Order = {
  id: string;
  productId: string;
  quantity: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
};

export enum OrderStatus {
  Pending = "pending",
  Completed = "completed",
  Cancelled = "cancelled",
}

export type OrderSummary = {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
};

export type OrderDetails = {
  order: Order;
  productName: string;
  productPrice: number;
};

export type CreateOrderRequest = {
  productId: string;
  quantity: number;
};

export type UpdateOrderStatusRequest = {
  orderId: string;
  status: OrderStatus;
};

export type OrderFilter = {
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
};

export type OrderListResponse = {
  orders: Order[];
  total: number;
  summary: OrderSummary;
};
