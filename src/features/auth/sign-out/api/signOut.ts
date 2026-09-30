import { apiClient } from "@/shared/api/client";

export function signOut(): Promise<void> {
  return apiClient<void>("/auth/sign-out", { method: "POST" });
}
