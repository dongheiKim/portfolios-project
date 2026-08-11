import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, type ProductSummary } from "@/entities/product";
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
      <div className="mb-2 flex items-center justify-between gap-3">
        <h3 className={CAROUSEL_TITLE_CLASS}>{title}</h3>
        <div className={`hidden items-center gap-2 ${arrowsClassName}`}>
          {ARROW_DIRECTIONS.map((direction) => {
            const isLeft = direction === "left";

            return (
              <button
                key={direction}
                type="button"
                onClick={() => onScroll(rowKey, direction)}
                className={CAROUSEL_ARROW_BUTTON_CLASS}
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

      <div ref={registerRef} className={CAROUSEL_TRACK_CLASS}>
        {products.map((product) => (
          <div key={`${rowKey}-${product.id}`} className={itemClassName}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
