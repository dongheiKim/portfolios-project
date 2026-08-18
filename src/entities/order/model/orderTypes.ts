export type Order = {
  id: string;
  totalPrice: number;
  items: {
    productId: string;
    quantity: number;
    productImage: string;
    productName: string;
    price: number;
  }[];
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  shippingAddress: {
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
  Paid = "paid",
  Preparing = "preparing",
  Shipping = "shipping",
  Delivered = "delivered",
  Pending = "pending",
  Refunded = "refunded",
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
