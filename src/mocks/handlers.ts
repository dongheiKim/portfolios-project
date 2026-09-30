import { http, HttpResponse } from "msw";
import type { SignInPayload } from "@/features/auth/sign-in/api/signIn";
import type { SignUpPayload } from "@/features/auth/sign-up/api/signUp";
import {
  OrderStatus,
  type CreateOrderPayload,
  type Order,
} from "@/entities/order";
import type { Address } from "@/entities/user/model/userTypes";
import { isPasswordLengthValid } from "@/features/auth/model/passwordPolicy";
import {
  findMockProductDetailById,
  isKnownMockProductId,
} from "@/entities/product/api/productApi.mock";
import {
  mockOrderOwners,
  mockOrders,
  mockUsers,
  persistMockUserProfiles,
  persistMockOrders,
  persistMockUsers,
} from "./data";
import { verifyPassword } from "./mockPassword";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");
const url = (path: string) => `${BASE_URL}${path}`;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOCK_TOKENS_STORAGE_KEY = "mock-auth-tokens";

let nextUserId = Math.max(0, ...mockUsers.map((user) => user.id)) + 1;
let nextOrderId =
  mockOrders.reduce((max, order) => {
    const id = Number(order.id);
    return Number.isSafeInteger(id) ? Math.max(max, id) : max;
  }, 1003) + 1;
const issuedTokens = new Map<string, number>();
const memoryOnlyTokens = new Set<string>();

function issueToken(userId: number) {
  const token = `mock-${crypto.randomUUID()}`;
  issuedTokens.set(token, userId);

  try {
    const stored = globalThis.localStorage.getItem(MOCK_TOKENS_STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : null;
    const tokens = isRecord(parsed) ? parsed : {};
    globalThis.localStorage.setItem(
      MOCK_TOKENS_STORAGE_KEY,
      JSON.stringify({ ...tokens, [token]: userId }),
    );
  } catch {
    memoryOnlyTokens.add(token);
  }

  return token;
}

function getBearerToken(request: Request) {
  return request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
}

function getAuthenticatedUserId(request: Request) {
  const token = getBearerToken(request);
  if (!token) return null;

  let storedTokens: string | null;
  try {
    storedTokens = globalThis.localStorage.getItem(MOCK_TOKENS_STORAGE_KEY);
  } catch {
    return memoryOnlyTokens.has(token)
      ? (issuedTokens.get(token) ?? null)
      : null;
  }

  if (storedTokens === null) {
    return memoryOnlyTokens.has(token)
      ? (issuedTokens.get(token) ?? null)
      : null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(storedTokens);
  } catch {
    return memoryOnlyTokens.has(token)
      ? (issuedTokens.get(token) ?? null)
      : null;
  }

  const storedUserId =
    isRecord(parsed) && typeof parsed[token] === "number"
      ? parsed[token]
      : undefined;
  const userId =
    storedUserId ??
    (memoryOnlyTokens.has(token) ? issuedTokens.get(token) : undefined);

  if (typeof userId !== "number" || !Number.isInteger(userId)) return null;

  return mockUsers.some((user) => user.id === userId) ? userId : null;
}

function revokeToken(token: string) {
  issuedTokens.delete(token);
  memoryOnlyTokens.delete(token);

  try {
    const stored = globalThis.localStorage.getItem(MOCK_TOKENS_STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : null;
    if (!isRecord(parsed)) return;

    const tokens = { ...parsed };
    delete tokens[token];
    globalThis.localStorage.setItem(
      MOCK_TOKENS_STORAGE_KEY,
      JSON.stringify(tokens),
    );
  } catch {
    // Keep logout functional when session storage is unavailable.
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function readJsonBody(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

function isValidSignInPayload(value: unknown): value is SignInPayload {
  return (
    isRecord(value) &&
    typeof value.email === "string" &&
    EMAIL_PATTERN.test(value.email.trim()) &&
    typeof value.password === "string" &&
    isPasswordLengthValid(value.password)
  );
}

function isValidSignUpPayload(value: unknown): value is SignUpPayload {
  return (
    isRecord(value) &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    typeof value.email === "string" &&
    EMAIL_PATTERN.test(value.email.trim()) &&
    typeof value.password === "string" &&
    isPasswordLengthValid(value.password)
  );
}

function isAddress(value: unknown): value is Address {
  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    Number.isSafeInteger(value.id) &&
    value.id > 0 &&
    typeof value.label === "string" &&
    value.label.trim().length > 0 &&
    typeof value.recipient === "string" &&
    value.recipient.trim().length > 0 &&
    typeof value.phone === "string" &&
    value.phone.trim().length > 0 &&
    typeof value.zipCode === "string" &&
    value.zipCode.trim().length > 0 &&
    typeof value.address === "string" &&
    value.address.trim().length > 0 &&
    typeof value.addressDetail === "string" &&
    typeof value.isDefault === "boolean"
  );
}

function isValidProfilePayload(
  value: unknown,
): value is { addresses: Address[] } {
  if (!isRecord(value) || !Array.isArray(value.addresses)) return false;
  if (!value.addresses.every(isAddress)) return false;

  const ids = value.addresses.map((address) => address.id);
  return (
    new Set(ids).size === ids.length &&
    value.addresses.filter((address) => address.isDefault).length <= 1
  );
}

function isValidCreateOrderPayload(
  value: unknown,
): value is CreateOrderPayload {
  if (!isRecord(value) || !Array.isArray(value.items)) return false;
  const shippingAddress = value.shippingAddress;
  if (!isRecord(shippingAddress)) return false;

  const addressFields = [
    "recipient",
    "phone",
    "address",
    "city",
    "street",
    "zipcode",
    "addressDetail",
  ] as const;
  const requiredAddressFields = [
    "recipient",
    "phone",
    "address",
    "zipcode",
  ] as const;
  const validPaymentMethod = ["card", "account", "phone"].includes(
    String(value.paymentMethod),
  );

  return (
    value.items.length > 0 &&
    value.items.every(
      (item) =>
        isRecord(item) &&
        typeof item.productId === "number" &&
        Number.isInteger(item.productId) &&
        isKnownMockProductId(item.productId) &&
        typeof item.quantity === "number" &&
        Number.isInteger(item.quantity) &&
        item.quantity >= 1 &&
        item.quantity <= 99 &&
        typeof item.productImage === "string" &&
        typeof item.productName === "string" &&
        typeof item.price === "number" &&
        Number.isFinite(item.price) &&
        item.price >= 0,
    ) &&
    addressFields.every(
      (field) => typeof shippingAddress[field] === "string",
    ) &&
    requiredAddressFields.every(
      (field) => (shippingAddress[field] as string).trim().length > 0,
    ) &&
    validPaymentMethod
  );
}

export const handlers = [
  http.post(url("/auth/sign-in"), async ({ request }) => {
    const body = await readJsonBody(request);
    if (!isValidSignInPayload(body)) {
      return HttpResponse.json(
        { message: "로그인 정보를 확인해 주세요." },
        { status: 400 },
      );
    }

    const email = body.email.trim().toLowerCase();
    const { password } = body;
    const found = mockUsers.find((user) => user.email.toLowerCase() === email);

    const isPasswordValid = found
      ? found.password !== undefined
        ? found.password === password
        : found.passwordSalt && found.passwordHash
          ? await verifyPassword(
              password,
              found.passwordSalt,
              found.passwordHash,
            )
          : false
      : false;

    if (!found || !isPasswordValid) {
      return HttpResponse.json(
        { message: "이메일 또는 비밀번호가 올바르지 않습니다." },
        { status: 401 },
      );
    }

    const {
      password: _password,
      passwordHash: _passwordHash,
      passwordSalt: _passwordSalt,
      ...user
    } = found;
    return HttpResponse.json({ token: issueToken(found.id), user });
  }),

  http.post(url("/auth/sign-up"), async ({ request }) => {
    const body = await readJsonBody(request);
    if (!isValidSignUpPayload(body)) {
      return HttpResponse.json(
        { message: "회원가입 정보를 확인해 주세요." },
        { status: 400 },
      );
    }

    const name = body.name.trim();
    const email = body.email.trim().toLowerCase();
    const { password } = body;

    if (mockUsers.some((user) => user.email.toLowerCase() === email)) {
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
    await persistMockUsers();

    const { password: _password, ...user } = newUser;
    return HttpResponse.json({ token: issueToken(newUser.id), user });
  }),

  http.post(url("/auth/sign-out"), ({ request }) => {
    const token = getBearerToken(request);
    if (!token || getAuthenticatedUserId(request) === null) {
      return HttpResponse.json(
        { message: "인증이 필요합니다." },
        { status: 401 },
      );
    }

    revokeToken(token);
    return HttpResponse.json({ message: "로그아웃되었습니다." });
  }),

  http.patch(url("/auth/profile"), async ({ request }) => {
    const userId = getAuthenticatedUserId(request);
    if (userId === null) {
      return HttpResponse.json(
        { message: "인증이 필요합니다." },
        { status: 401 },
      );
    }

    const body = await readJsonBody(request);
    if (!isValidProfilePayload(body)) {
      return HttpResponse.json(
        { message: "배송지 정보를 확인해 주세요." },
        { status: 400 },
      );
    }

    const user = mockUsers.find((candidate) => candidate.id === userId);
    if (!user) {
      return HttpResponse.json(
        { message: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    user.addresses = body.addresses;
    persistMockUserProfiles();
    await persistMockUsers();

    const {
      password: _password,
      passwordHash: _passwordHash,
      passwordSalt: _passwordSalt,
      ...publicUser
    } = user;
    return HttpResponse.json(publicUser);
  }),

  http.get(url("/orders"), ({ request }) => {
    const userId = getAuthenticatedUserId(request);
    if (userId === null) {
      return HttpResponse.json(
        { message: "인증이 필요합니다." },
        { status: 401 },
      );
    }

    return HttpResponse.json(
      mockOrders.filter((order) => mockOrderOwners.get(order.id) === userId),
    );
  }),

  http.post(url("/orders"), async ({ request }) => {
    const userId = getAuthenticatedUserId(request);
    if (userId === null) {
      return HttpResponse.json(
        { message: "인증이 필요합니다." },
        { status: 401 },
      );
    }

    const body = await readJsonBody(request);

    if (!isValidCreateOrderPayload(body)) {
      return HttpResponse.json(
        { message: "주문 상품과 배송지를 확인해 주세요." },
        { status: 400 },
      );
    }

    const orderItems = body.items.map((item) => {
      const product = findMockProductDetailById(item.productId);
      return {
        productId: String(item.productId),
        quantity: item.quantity,
        productImage: product.imageUrls[0] ?? "",
        productName: product.name,
        price: product.price,
      };
    });
    const now = new Date();
    const order: Order = {
      id: String(nextOrderId++),
      totalPrice: orderItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      ),
      items: orderItems,
      status: OrderStatus.Paid,
      createdAt: now,
      updatedAt: now,
      shippingAddress: body.shippingAddress,
    };

    mockOrders.unshift(order);
    mockOrderOwners.set(order.id, userId);
    persistMockOrders();
    return HttpResponse.json(order, { status: 201 });
  }),

  http.get(url("/orders/:id"), ({ params, request }) => {
    const userId = getAuthenticatedUserId(request);
    const order = mockOrders.find((item) => item.id === params.id);

    if (userId === null) {
      return HttpResponse.json(
        { message: "인증이 필요합니다." },
        { status: 401 },
      );
    }

    if (!order || mockOrderOwners.get(order.id) !== userId) {
      return HttpResponse.json(
        { message: "주문을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return HttpResponse.json(order);
  }),
];
