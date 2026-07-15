import { apiClient } from "@/shared/api/client";
import type { User } from "../model/userTypes";

export async function fetchCurrentUser(): Promise<User> {
  return apiClient<User>("/users/me");
}

/** @deprecated fetchCurrentUser를 사용하세요 */
export async function fetchUser(): Promise<User> {
  return fetchCurrentUser();
}
