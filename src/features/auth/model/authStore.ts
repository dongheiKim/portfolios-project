import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/entities/user";
import {
  createSafeJSONStorage,
  removeStoredJson,
} from "@/shared/lib/safeBrowserStorage";

export const AUTH_STORAGE_KEY = "auth-storage";

interface AuthState {
  user: User | null;
  token: string | null;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      login: (user, token) => {
        set({ user, token });
      },
      logout: () => {
        set({ user: null, token: null });
        removeStoredJson(AUTH_STORAGE_KEY);
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({ token: state.token, user: state.user }),
      storage: createSafeJSONStorage(),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
