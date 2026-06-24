export type Order = {
  id: string;
  productId: string;
  quantity: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: string;
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
