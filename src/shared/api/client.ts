import { AUTH_STORAGE_KEY } from "@/features/auth/model/authStore";
import { readStoredJson } from "@/shared/lib/safeBrowserStorage";

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

// zustand persist 포맷: { state: { token, user }, version }
function getStoredToken(): string | null {
  const parsed = readStoredJson<{ state?: { token?: unknown } }>(
    AUTH_STORAGE_KEY,
  );
  const token = parsed?.state?.token;
  return typeof token === "string" ? token : null;
}

function buildApiErrorMessage(
  status: number,
  statusText: string,
  body: unknown,
) {
  if (typeof body === "string" && body.trim()) {
    return `API ${status}: ${body}`;
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "message" in body &&
    typeof (body as { message?: unknown }).message === "string"
  ) {
    return `API ${status}: ${(body as { message: string }).message}`;
  }

  return `API ${status}: ${statusText}`;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getStoredToken();

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const body = isJson
    ? await response.json().catch(() => null)
    : await response.text().catch(() => "");

  if (!response.ok) {
    throw new Error(
      buildApiErrorMessage(response.status, response.statusText, body),
    );
  }

  return body as T;
}
