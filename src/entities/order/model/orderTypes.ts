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

export type CreateOrderItem = {
  productId: number;
  quantity: number;
  productImage: string;
  productName: string;
  price: number;
};

export type ShippingAddress = Order["shippingAddress"];

export type CreateOrderPayload = {
  items: CreateOrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: "card" | "account" | "phone";
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
