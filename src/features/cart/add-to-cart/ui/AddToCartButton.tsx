import { ShoppingCart } from "lucide-react";
import { Button } from "@/shared/ui/Button";
import { useAddToCart } from "../model/useAddToCart";

interface Props {
  productId: number;
  fullWidth?: boolean;
}

export function AddToCartButton({ productId, fullWidth = true }: Props) {
  const { count, addToCart } = useAddToCart(productId);

  return (
    <Button
      type="button"
      variant={count > 0 ? "secondary" : "primary"}
      size="sm"
      fullWidth={fullWidth}
      onClick={addToCart}
      aria-label={count > 0 ? `장바구니에 담긴 ${count}개, 추가 담기` : "장바구니에 담기"}
    >
      <ShoppingCart size={14} />
      {count > 0 ? `담긴 ${count}개` : "장바구니 담기"}
    </Button>
  );
}
