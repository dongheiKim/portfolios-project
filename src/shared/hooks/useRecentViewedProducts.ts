import { useEffect, useState } from "react";

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
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RecentViewedProduct[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function pushRecentViewedProduct(product: RecentViewedProduct) {
  if (typeof window === "undefined") return;

  const next = [
    product,
    ...readRecentViewedProducts().filter((item) => item.id !== product.id),
  ].slice(0, MAX_ITEMS);

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}

export function useRecentViewedProducts() {
  const [products, setProducts] = useState<RecentViewedProduct[]>([]);

  useEffect(() => {
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
