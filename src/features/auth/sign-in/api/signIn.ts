import { apiClient } from "@/shared/api/client";
import type { User } from "@/entities/user";

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInResponse {
  token: string;
  user: User;
}

export async function signIn(payload: SignInPayload): Promise<SignInResponse> {
  return apiClient<SignInResponse>("/auth/sign-in", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
