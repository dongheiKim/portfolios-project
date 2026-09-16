import { Heart } from "lucide-react";
import { clsx } from "clsx";
import { useToggleWishlist } from "../model/useToggleWishlist";

interface WishlistButtonProps {
  productId: number;
  className?: string;
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { isWishlisted, toggle } = useToggleWishlist(productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle();
      }}
      aria-pressed={isWishlisted}
      aria-label={isWishlisted ? "찜 해제하기" : "찜하기"}
      className={clsx(
        "flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-[0_4px_10px_rgba(15,23,42,0.12)] backdrop-blur transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff]",
        className,
      )}
    >
      <Heart
        size={16}
        className={
          isWishlisted ? "fill-[#e11937] text-[#e11937]" : "text-[#94a3b8]"
        }
      />
    </button>
  );
}
