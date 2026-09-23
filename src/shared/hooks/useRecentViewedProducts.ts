import { useEffect, useState } from "react";

import {
  readStoredJson,
  writeStoredJson,
} from "@/shared/lib/safeBrowserStorage";

const STORAGE_KEY = "claude-recent-viewed-products";
const EVENT_NAME = "claude-recent-viewed-updated";
const MAX_ITEMS = 5;

export interface RecentViewedProduct {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
}

function readRecentViewedProducts(): RecentViewedProduct[] {
  const parsed = readStoredJson<RecentViewedProduct[]>(STORAGE_KEY);
  return Array.isArray(parsed) ? parsed : [];
}

export function pushRecentViewedProduct(product: RecentViewedProduct) {
  if (typeof window === "undefined") return;

  const next = [
    product,
    ...readRecentViewedProducts().filter((item) => item.id !== product.id),
  ].slice(0, MAX_ITEMS);

  if (writeStoredJson(STORAGE_KEY, next)) {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
}

export function useRecentViewedProducts() {
  const [products, setProducts] = useState<RecentViewedProduct[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const sync = () => setProducts(readRecentViewedProducts());

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(EVENT_NAME, sync as EventListener);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(EVENT_NAME, sync as EventListener);
    };
  }, []);

  return products;
}
