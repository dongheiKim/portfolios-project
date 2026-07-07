import { useCartStore } from "./cartStore";

export function useAddToCart(productId: number) {
  const { items, addItem } = useCartStore();
  const count = items.find((i) => i.productId === productId)?.quantity ?? 0;

  return { count, addToCart: () => addItem(productId) };
}
