import { createJSONStorage } from "zustand/middleware";

const memoryStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export function getSafeStorage(): Storage | null {
  try {
    const globalStorage =
      typeof globalThis !== "undefined" ? globalThis.localStorage : undefined;
    if (globalStorage) return globalStorage;
  } catch {
    // ignore and continue to window fallback
  }

  if (typeof window === "undefined") return null;

  try {
    return window.localStorage ?? null;
  } catch {
    return null;
  }
}

export function createSafeJSONStorage() {
  return createJSONStorage(() => ({
    getItem: (name: string) => {
      try {
        return (getSafeStorage() ?? memoryStorage).getItem(name);
      } catch {
        return null;
      }
    },
    setItem: (name: string, value: string) => {
      try {
        (getSafeStorage() ?? memoryStorage).setItem(name, value);
      } catch {
        return undefined;
      }
    },
    removeItem: (name: string) => {
      try {
        (getSafeStorage() ?? memoryStorage).removeItem(name);
      } catch {
        return undefined;
      }
    },
  }));
}

export function readStoredJson<T>(key: string): T | null {
  const storage = getSafeStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as T;
    return parsed;
  } catch {
    return null;
  }
}

export function writeStoredJson<T>(key: string, value: T) {
  const storage = getSafeStorage();
  if (!storage) return false;

  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStoredJson(key: string) {
  const storage = getSafeStorage();
  if (!storage) return false;

  try {
    storage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
