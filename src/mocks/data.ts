import {
  isKnownMockProductId,
  mockProducts,
} from "@/entities/product/api/productApi.mock";
import { OrderStatus, type Order } from "@/entities/order";
import type { Address, User } from "@/entities/user/model/userTypes";
import { isPasswordLengthValid } from "@/features/auth/model/passwordPolicy";
import {
  readStoredJson,
  writeStoredJson,
} from "@/shared/lib/safeBrowserStorage";
import { createPasswordVerifier } from "./mockPassword";

export interface MockAuthUser extends User {
  password?: string;
  passwordSalt?: string;
  passwordHash?: string;
}

export const MOCK_USERS_STORAGE_KEY = "mock-users";
export const MOCK_ORDERS_STORAGE_KEY = "mock-orders";
export const MOCK_USER_PROFILES_STORAGE_KEY = "mock-user-profiles";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const seededMockUsers: MockAuthUser[] = [
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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

function areAddressesValid(value: unknown): value is Address[] {
  if (!Array.isArray(value) || !value.every(isAddress)) return false;

  const addressIds = new Set(value.map((address) => address.id));
  return (
    addressIds.size === value.length &&
    value.filter((address) => address.isDefault).length <= 1
  );
}

function isMockAuthUser(value: unknown): value is MockAuthUser {
  const hasPassword =
    isRecord(value) &&
    typeof value.password === "string" &&
    isPasswordLengthValid(value.password);
  const hasPasswordVerifier =
    isRecord(value) &&
    typeof value.passwordSalt === "string" &&
    /^[\da-f]{32}$/i.test(value.passwordSalt) &&
    typeof value.passwordHash === "string" &&
    /^[\da-f]{64}$/i.test(value.passwordHash);

  return (
    isRecord(value) &&
    typeof value.id === "number" &&
    Number.isSafeInteger(value.id) &&
    value.id > 0 &&
    typeof value.name === "string" &&
    value.name.trim().length > 0 &&
    typeof value.email === "string" &&
    EMAIL_PATTERN.test(value.email.trim()) &&
    (hasPassword || hasPasswordVerifier) &&
    areAddressesValid(value.addresses) &&
    typeof value.createdAt === "string" &&
    (value.phone === undefined || typeof value.phone === "string") &&
    (value.profileImage === undefined || typeof value.profileImage === "string")
  );
}

export function restorePersistedMockUsers(value: unknown): MockAuthUser[] {
  if (!Array.isArray(value)) return [];

  const usedIds = new Set(seededMockUsers.map((user) => user.id));
  const usedEmails = new Set(
    seededMockUsers.map((user) => user.email.toLowerCase()),
  );
  const restoredUsers: MockAuthUser[] = [];

  for (const candidate of value) {
    if (!isMockAuthUser(candidate)) continue;

    const email = candidate.email.trim().toLowerCase();
    if (usedIds.has(candidate.id) || usedEmails.has(email)) continue;

    usedIds.add(candidate.id);
    usedEmails.add(email);
    restoredUsers.push({ ...candidate, name: candidate.name.trim(), email });
  }

  return restoredUsers;
}

export const mockUsers: MockAuthUser[] = [
  ...seededMockUsers,
  ...restorePersistedMockUsers(readStoredJson<unknown>(MOCK_USERS_STORAGE_KEY)),
];

export interface MockUserProfile {
  userId: number;
  addresses: Address[];
}

export function restorePersistedMockUserProfiles(
  value: unknown,
): MockUserProfile[] {
  if (!Array.isArray(value)) return [];

  const knownUserIds = new Set(mockUsers.map((user) => user.id));
  const seenUserIds = new Set<number>();
  const profiles: MockUserProfile[] = [];

  for (const candidate of value) {
    if (!isRecord(candidate)) continue;
    const addresses = candidate.addresses;

    if (
      typeof candidate.userId !== "number" ||
      !Number.isSafeInteger(candidate.userId) ||
      !knownUserIds.has(candidate.userId) ||
      seenUserIds.has(candidate.userId) ||
      !areAddressesValid(addresses)
    ) {
      continue;
    }

    seenUserIds.add(candidate.userId);
    profiles.push({ userId: candidate.userId, addresses });
  }

  return profiles;
}

for (const profile of restorePersistedMockUserProfiles(
  readStoredJson<unknown>(MOCK_USER_PROFILES_STORAGE_KEY),
)) {
  const user = mockUsers.find((candidate) => candidate.id === profile.userId);
  if (user) user.addresses = profile.addresses;
}

export async function persistMockUsers() {
  const seededIds = new Set(seededMockUsers.map((user) => user.id));
  const registeredUsers = mockUsers.filter((user) => !seededIds.has(user.id));
  const persistedUsers = await Promise.all(
    registeredUsers.map(async (user) => {
      const verifier =
        user.passwordSalt && user.passwordHash
          ? {
              passwordSalt: user.passwordSalt,
              passwordHash: user.passwordHash,
            }
          : user.password
            ? await createPasswordVerifier(user.password)
            : null;
      if (!verifier) return null;

      const { password: _password, ...userWithoutPassword } = user;
      return { ...userWithoutPassword, ...verifier };
    }),
  );

  return writeStoredJson(
    MOCK_USERS_STORAGE_KEY,
    persistedUsers.filter((user) => user !== null),
  );
}

export function persistMockUserProfiles() {
  return writeStoredJson(
    MOCK_USER_PROFILES_STORAGE_KEY,
    mockUsers.map(({ id, addresses }) => ({ userId: id, addresses })),
  );
}

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

const seededMockOrders: Order[] = orderSeeds.map((seed) => ({
  id: seed.id,
  totalPrice: sumItems(seed.items),
  items: seed.items,
  status: seed.status,
  createdAt: seed.createdAt,
  updatedAt: seed.createdAt,
  shippingAddress: defaultShippingAddress,
}));

export interface MockOwnedOrder {
  order: Order;
  userId: number;
}

function readPersistedDate(value: unknown): Date | null {
  if (typeof value !== "string" && !(value instanceof Date)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isShippingAddress(value: unknown): value is Order["shippingAddress"] {
  return (
    isRecord(value) &&
    typeof value.recipient === "string" &&
    value.recipient.trim().length > 0 &&
    typeof value.phone === "string" &&
    value.phone.trim().length > 0 &&
    typeof value.address === "string" &&
    value.address.trim().length > 0 &&
    typeof value.city === "string" &&
    typeof value.street === "string" &&
    typeof value.zipcode === "string" &&
    value.zipcode.trim().length > 0 &&
    typeof value.addressDetail === "string"
  );
}

function restorePersistedOrder(value: unknown): Order | null {
  if (!isRecord(value) || !Array.isArray(value.items)) return null;

  const createdAt = readPersistedDate(value.createdAt);
  const updatedAt = readPersistedDate(value.updatedAt);
  const shippingAddress = value.shippingAddress;
  const validItems = value.items.every(
    (item) =>
      isRecord(item) &&
      typeof item.productId === "string" &&
      /^[1-9]\d*$/.test(item.productId) &&
      Number.isSafeInteger(Number(item.productId)) &&
      isKnownMockProductId(Number(item.productId)) &&
      typeof item.quantity === "number" &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0 &&
      item.quantity <= 99 &&
      typeof item.productImage === "string" &&
      typeof item.productName === "string" &&
      typeof item.price === "number" &&
      Number.isFinite(item.price) &&
      item.price >= 0,
  );
  if (!validItems) return null;

  const validAddress = isShippingAddress(shippingAddress);
  const validStatus = Object.values(OrderStatus).includes(
    value.status as OrderStatus,
  );
  const totalPrice = value.items.reduce(
    (sum: number, item: { price?: number; quantity?: number }) =>
      sum + (item.price ?? 0) * (item.quantity ?? 0),
    0,
  );

  if (
    typeof value.id !== "string" ||
    !/^[1-9]\d*$/.test(value.id) ||
    !Number.isSafeInteger(Number(value.id)) ||
    typeof value.totalPrice !== "number" ||
    !Number.isFinite(value.totalPrice) ||
    value.totalPrice !== totalPrice ||
    !createdAt ||
    !updatedAt ||
    !validAddress ||
    !validStatus
  ) {
    return null;
  }

  return {
    id: value.id,
    totalPrice: value.totalPrice,
    items: value.items,
    status: value.status as OrderStatus,
    createdAt,
    updatedAt,
    shippingAddress,
  };
}

export function restorePersistedMockOrders(value: unknown): MockOwnedOrder[] {
  if (!Array.isArray(value)) return [];

  const seededIds = new Set(seededMockOrders.map((order) => order.id));
  const userIds = new Set(mockUsers.map((user) => user.id));
  const seenOrderIds = new Set(seededIds);
  const restoredOrders: MockOwnedOrder[] = [];

  for (const candidate of value) {
    if (
      !isRecord(candidate) ||
      typeof candidate.userId !== "number" ||
      !Number.isSafeInteger(candidate.userId) ||
      !userIds.has(candidate.userId)
    ) {
      continue;
    }

    const order = restorePersistedOrder(candidate.order);
    if (!order || seenOrderIds.has(order.id)) continue;

    seenOrderIds.add(order.id);
    restoredOrders.push({ order, userId: candidate.userId });
  }

  return restoredOrders;
}

const persistedMockOrders = restorePersistedMockOrders(
  readStoredJson<unknown>(MOCK_ORDERS_STORAGE_KEY),
);

export const mockOrders: Order[] = [
  ...seededMockOrders,
  ...persistedMockOrders.map(({ order }) => order),
];

export const mockOrderOwners = new Map<string, number>([
  ...seededMockOrders.map((order) => [order.id, 1] as const),
  ...persistedMockOrders.map(
    ({ order, userId }) => [order.id, userId] as const,
  ),
]);

export function persistMockOrders() {
  const seededIds = new Set(seededMockOrders.map((order) => order.id));
  const persistedOrders = mockOrders.flatMap((order) => {
    if (seededIds.has(order.id)) return [];
    const userId = mockOrderOwners.get(order.id);
    return userId === undefined ? [] : [{ order, userId }];
  });

  return writeStoredJson(MOCK_ORDERS_STORAGE_KEY, persistedOrders);
}
