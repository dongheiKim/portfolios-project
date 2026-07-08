export type Order = {
  totalPrice: number;
  items: {
    productId: string;
    quantity: number;
    productImage: string;
    productName: string;
    price: number;
  }[];
  id: string;
  productId: string;
  quantity: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: {
    shippingAddress: string;
    recipient: string;
    phone: string;
    address: string;
    city: string;
    street: string;
    zipcode: string;
    addressDetail: string;
  };
};

export enum OrderStatus {
  paid = "paid",
  preparing = "preparing",
  shipping = "shipping",
  delivered = "delivered",
  Pending = "pending",
  refunded = "refunded",
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
