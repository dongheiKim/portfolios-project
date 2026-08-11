import { useCartStore } from "./cartStore";

export function useAddToCart(productId: number) {
  const count = useCartStore(
    (s) => s.items.find((i) => i.productId === productId)?.quantity ?? 0,
  );
  const addItem = useCartStore((s) => s.addItem);

  return { count, addToCart: () => addItem(productId) };
}
