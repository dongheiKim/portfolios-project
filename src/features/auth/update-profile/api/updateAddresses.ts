import type { Address, User } from "@/entities/user/model/userTypes";
import { apiClient } from "@/shared/api/client";

export function updateAddresses(addresses: Address[]): Promise<User> {
  return apiClient<User>("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify({ addresses }),
  });
}
