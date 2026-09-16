import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, type ProductSummary } from "@/entities/product";
import { AddToCartButton } from "@/features/cart/add-to-cart";
import { WishlistButton } from "@/features/product/wishlist";
import {
  CAROUSEL_ARROW_BUTTON_CLASS,
  CAROUSEL_TITLE_CLASS,
  CAROUSEL_TRACK_CLASS,
} from "./styles";

interface CarouselSectionProps {
  title: string;
  rowKey: string;
  itemClassName: string;
  arrowsClassName: string;
  products: ProductSummary[];
  registerRef: (node: HTMLDivElement | null) => void;
  onScroll: (rowKey: string, direction: "left" | "right") => void;
}

const ARROW_DIRECTIONS = ["left", "right"] as const;

export function CarouselSection({
  title,
  rowKey,
  itemClassName,
  arrowsClassName,
  products,
  registerRef,
  onScroll,
}: CarouselSectionProps) {
  return (
    <div>
      <h3 className={`mb-2 ${CAROUSEL_TITLE_CLASS}`}>{title}</h3>

      <div className="group relative">
        <div ref={registerRef} className={CAROUSEL_TRACK_CLASS}>
          {products.map((product) => (
            <div key={`${rowKey}-${product.id}`} className={itemClassName}>
              <ProductCard
                product={product}
                actions={<AddToCartButton productId={product.id} />}
                wishlistSlot={<WishlistButton productId={product.id} />}
              />
            </div>
          ))}
        </div>

        <div
          className={`pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 ${arrowsClassName}`}
        >
          {ARROW_DIRECTIONS.map((direction) => {
            const isLeft = direction === "left";

            return (
              <button
                key={direction}
                type="button"
                onClick={() => onScroll(rowKey, direction)}
                className={`pointer-events-auto ${isLeft ? "-translate-x-1/2" : "translate-x-1/2"} ${CAROUSEL_ARROW_BUTTON_CLASS}`}
                aria-label={`${title} ${isLeft ? "이전" : "다음"} 상품 보기`}
              >
                {isLeft ? (
                  <ChevronLeft size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
