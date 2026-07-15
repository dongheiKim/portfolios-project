import { apiClient } from "@/shared/api/client";
import type { User } from "@/entities/user";

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
}

export interface SignUpResponse {
  token: string;
  user: User;
}

export async function signUp(payload: SignUpPayload): Promise<SignUpResponse> {
  return apiClient<SignUpResponse>("/auth/sign-up", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
