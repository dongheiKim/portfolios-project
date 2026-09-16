import { http, HttpResponse } from "msw";
import type { SignInPayload } from "@/features/auth/sign-in/api/signIn";
import type { SignUpPayload } from "@/features/auth/sign-up/api/signUp";
import {
  OrderStatus,
  type CreateOrderPayload,
  type Order,
} from "@/entities/order";
import { mockOrders, mockUsers } from "./data";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const url = (path: string) => `${BASE_URL}${path}`;

let nextUserId = mockUsers.length + 1;
let nextOrderId = 1004;

function issueToken(userId: number) {
  return `mock-token-${userId}-${Date.now()}`;
}

export const handlers = [
  http.post(url("/auth/sign-in"), async ({ request }) => {
    const { email, password } = (await request.json()) as SignInPayload;
    const found = mockUsers.find(
      (user) => user.email === email && user.password === password,
    );

    if (!found) {
      return HttpResponse.json(
        { message: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 },
      );
    }

    const { password: _password, ...user } = found;
    return HttpResponse.json({ token: issueToken(found.id), user });
  }),

  http.post(url("/auth/sign-up"), async ({ request }) => {
    const { name, email, password } = (await request.json()) as SignUpPayload;

    if (mockUsers.some((user) => user.email === email)) {
      return HttpResponse.json(
        { message: "이미 가입된 이메일입니다." },
        { status: 409 },
      );
    }

    const newUser = {
      id: nextUserId++,
      name,
      email,
      password,
      addresses: [],
      createdAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);

    const { password: _password, ...user } = newUser;
    return HttpResponse.json({ token: issueToken(newUser.id), user });
  }),

  http.get(url("/orders"), () => {
    return HttpResponse.json(mockOrders);
  }),

  http.post(url("/orders"), async ({ request }) => {
    const payload = (await request.json()) as CreateOrderPayload;

    if (!payload.items?.length || !payload.shippingAddress) {
      return HttpResponse.json(
        { message: "주문 상품과 배송지를 확인해 주세요." },
        { status: 400 },
      );
    }

    const now = new Date();
    const order: Order = {
      id: String(nextOrderId++),
      totalPrice: payload.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
      items: payload.items.map((item) => ({
        ...item,
        productId: String(item.productId),
      })),
      status: OrderStatus.Paid,
      createdAt: now,
      updatedAt: now,
      shippingAddress: payload.shippingAddress,
    };

    mockOrders.unshift(order);
    return HttpResponse.json(order, { status: 201 });
  }),

  http.get(url("/orders/:id"), ({ params }) => {
    const order = mockOrders.find((item) => item.id === params.id);

    if (!order) {
      return HttpResponse.json(
        { message: "주문을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return HttpResponse.json(order);
  }),
];
