import { apiClient } from "@/shared/api/client";
import type { User } from "../model/userTypes";

export async function fetchCurrentUser(): Promise<User> {
  return apiClient<User>("/users/me");
}
