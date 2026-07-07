import { Link } from "react-router";
import { Star } from "lucide-react";
import { formatPrice } from "@/shared/lib/format";
import { Badge } from "@/shared/ui/Badge";
import { OptimizedImage } from "@/shared/ui/OptimizedImage";
import { AddToCartButton } from "@/features/cart/add-to-cart";
import type { ProductSummary } from "../model/productTypes";

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-[#e7edf5] bg-white shadow-[0_10px_25px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-1 hover:border-[#bfd1ff] hover:shadow-[0_18px_38px_rgba(52,106,255,0.16)]"
      aria-label={product.name}
    >
      <Link
        to={`/products/${product.id}`}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff] focus-visible:ring-inset"
        aria-label={`${product.name} 상세 보기`}
      >
        <div className="relative aspect-square overflow-hidden bg-[#f7f9fc]">
          <OptimizedImage
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full transition-transform duration-300 group-hover:scale-105"
          />
          {product.discountRate != null && product.discountRate > 0 && (
            <span className="absolute left-3 top-3">
              <Badge variant="discount" value={product.discountRate} />
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 p-4">
          <div className="flex items-center justify-between gap-2">
            {product.isRocketDelivery ? (
              <Badge variant="rocket" />
            ) : (
              <span className="text-xs font-medium text-[#94a3b8]">
                일반배송
              </span>
            )}
            {product.reviewCount > 500 && <Badge variant="best" />}
          </div>

          <p className="line-clamp-2 min-h-10 text-sm leading-snug text-[#162032]">
            {product.name}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-[#8b97a9]">
            <span>내일 도착 보장</span>
            <span className="h-1 w-1 rounded-full bg-[#c9d3e1]" />
            <span>무료반품</span>
          </div>

          <div className="flex items-baseline gap-1.5">
            {product.discountRate != null && product.discountRate > 0 && (
              <span
                className="text-sm font-black text-[#e11937]"
                aria-hidden="true"
              >
                {product.discountRate}%
              </span>
            )}
            <span className="text-xl font-black tracking-[-0.03em] text-[#111827]">
              {formatPrice(product.price)}
            </span>
          </div>

          {product.originalPrice != null &&
            product.originalPrice > product.price && (
              <p
                className="text-xs text-[#9aa7b8] line-through"
                aria-label={`정가 ${formatPrice(product.originalPrice)}`}
              >
                {formatPrice(product.originalPrice)}
              </p>
            )}

          <div
            className="flex items-center gap-1 text-xs text-[#64748b]"
            aria-label={`평점 ${product.rating.toFixed(1)}점, 리뷰 ${product.reviewCount.toLocaleString()}개`}
          >
            <Star
              size={12}
              className="fill-[#ffb600] text-[#ffb600]"
              aria-hidden="true"
            />
            <span aria-hidden="true">{product.rating.toFixed(1)}</span>
            <span aria-hidden="true">
              ({product.reviewCount.toLocaleString()})
            </span>
          </div>
        </div>
      </Link>

      <div className="mt-auto px-4 pb-4">
        <AddToCartButton productId={product.id} />
      </div>
    </article>
  );
}
