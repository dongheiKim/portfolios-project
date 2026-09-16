import { mockProducts } from "@/entities/product/api/productApi.mock";
import { OrderStatus, type Order } from "@/entities/order";
import type { User } from "@/entities/user";

export interface MockAuthUser extends User {
  password: string;
}

// 인메모리 저장소: 브라우저 세션 동안만 유지되며 새로고침 시 초기화된다.
export const mockUsers: MockAuthUser[] = [
  {
    id: 1,
    name: "김쿠팡",
    email: "test@example.com",
    password: "password123",
    phone: "010-1234-5678",
    addresses: [
      {
        id: 1,
        label: "집",
        recipient: "김쿠팡",
        phone: "010-1234-5678",
        zipCode: "06236",
        address: "서울특별시 강남구 테헤란로 123",
        addressDetail: "101동 202호",
        isDefault: true,
      },
    ],
    createdAt: new Date("2026-01-10").toISOString(),
  },
];

function findProduct(productId: number) {
  const product = mockProducts.find((item) => item.id === productId);
  if (!product) {
    throw new Error(`Unknown mock product id ${productId}`);
  }
  return product;
}

function buildOrderItem(productId: number, quantity: number) {
  const product = findProduct(productId);
  return {
    productId: String(product.id),
    quantity,
    productImage: product.imageUrl,
    productName: product.name,
    price: product.price,
  };
}

function sumItems(items: Order["items"]) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

const defaultShippingAddress = {
  recipient: "김쿠팡",
  phone: "010-1234-5678",
  address: "서울특별시 강남구 테헤란로 123",
  city: "서울특별시",
  street: "테헤란로 123",
  zipcode: "06236",
  addressDetail: "101동 202호",
};

const orderSeeds: {
  id: string;
  items: Order["items"];
  status: OrderStatus;
  createdAt: Date;
}[] = [
  {
    id: "1001",
    items: [buildOrderItem(1, 1), buildOrderItem(15, 2)],
    status: OrderStatus.Delivered,
    createdAt: new Date("2026-08-20T10:30:00"),
  },
  {
    id: "1002",
    items: [buildOrderItem(8, 1)],
    status: OrderStatus.Shipping,
    createdAt: new Date("2026-09-05T14:10:00"),
  },
  {
    id: "1003",
    items: [buildOrderItem(5, 2), buildOrderItem(11, 1)],
    status: OrderStatus.Paid,
    createdAt: new Date("2026-09-12T09:00:00"),
  },
];

export const mockOrders: Order[] = orderSeeds.map((seed) => ({
  id: seed.id,
  totalPrice: sumItems(seed.items),
  items: seed.items,
  status: seed.status,
  createdAt: seed.createdAt,
  updatedAt: seed.createdAt,
  shippingAddress: defaultShippingAddress,
}));
