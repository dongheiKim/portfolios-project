import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, MessageCircle, Star } from "lucide-react";
import { fetchProductById } from "@/entities/product";
import type { ProductDetail } from "@/entities/product";
import { fetchReviewsByProductId } from "@/entities/review";
import { AddToCartButton } from "@/features/cart/add-to-cart";
import { WishlistButton } from "@/features/product/wishlist";
import { pushRecentViewedProduct } from "@/shared/hooks/useRecentViewedProducts";
import { formatPrice } from "@/shared/lib/format";
import { OptimizedImage } from "@/shared/ui/OptimizedImage";
import { HeroSkeleton, SectionSkeleton, Skeleton } from "@/shared/ui/Skeleton";

function ProductGallery({ product }: { product: ProductDetail }) {
  const [activeImage, setActiveImage] = useState(0);

  return (
    <section className="flex flex-col gap-3">
      <div className="aspect-square overflow-hidden rounded-[24px] bg-[#f7f9fc]">
        <OptimizedImage
          src={product.imageUrls[activeImage] ?? product.imageUrls[0]}
          alt={product.name}
          className="h-full w-full"
          priority
        />
      </div>
      {product.imageUrls.length > 1 && (
        <div className="flex gap-2">
          {product.imageUrls.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveImage(index)}
              aria-label={`이미지 ${index + 1} 보기`}
              className={`h-16 w-16 overflow-hidden rounded-xl border-2 ${
                activeImage === index
                  ? "border-[#346aff]"
                  : "border-transparent"
              }`}
            >
              <OptimizedImage src={url} alt="" className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

function ReviewSection({ productId }: { productId: number }) {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => fetchReviewsByProductId(productId),
  });

  return (
    <section className="mt-8 rounded-[24px] border border-[#e4ebf3] bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
      <h2 className="mb-4 font-black text-[#111827]">
        상품 리뷰{reviews ? ` (${reviews.length})` : ""}
      </h2>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      )}

      {!isLoading && reviews && reviews.length === 0 && (
        <p className="text-sm text-[#64748b]">아직 등록된 리뷰가 없습니다.</p>
      )}

      {!isLoading && reviews && reviews.length > 0 && (
        <div className="flex flex-col divide-y divide-[#edf2f7]">
          {reviews.map((review) => (
            <div key={review.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#111827]">
                  {review.author}
                </span>
                <span className="text-xs text-[#94a3b8]">
                  {new Date(review.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
              <div
                className="mt-1 flex items-center gap-0.5"
                aria-label={`평점 ${review.rating}점`}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    size={12}
                    aria-hidden="true"
                    className={
                      index < review.rating
                        ? "fill-[#ffb600] text-[#ffb600]"
                        : "text-[#e4ebf3]"
                    }
                  />
                ))}
              </div>
              <p className="mt-2 text-sm leading-6 text-[#516074]">
                {review.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const invalidProductId =
    !id || !Number.isInteger(productId) || productId <= 0;

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => fetchProductById(productId),
    enabled: !invalidProductId,
  });

  useEffect(() => {
    if (!product) return;
    pushRecentViewedProduct({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrls[0] ?? "",
      price: product.price,
    });
  }, [product]);

  return (
    <div className="coupang-shell min-h-screen flex flex-col bg-[#f4f7fb]">
      <main
        id="main-content"
        className="flex-1 max-w-5xl mx-auto w-full px-4 py-6"
      >
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-[#64748b] hover:text-[#346aff]"
        >
          <ChevronLeft size={16} />
          홈으로
        </Link>

        {(invalidProductId || isError) && (
          <div className="rounded-[28px] border border-[#e4ebf3] bg-white py-20 text-center text-[#64748b] shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <p className="text-lg font-medium">상품을 찾을 수 없습니다.</p>
          </div>
        )}

        {!invalidProductId && isLoading && (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
            <HeroSkeleton />
            <SectionSkeleton lines={4} />
          </div>
        )}

        {product && (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
            <ProductGallery key={product.id} product={product} />

            <section className="flex flex-col gap-5">
              <div className="rounded-[24px] border border-[#e4ebf3] bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
                <h1 className="text-xl font-black text-[#111827]">
                  {product.name}
                </h1>

                <div className="mt-3 flex items-center gap-1 text-sm text-[#64748b]">
                  <Star size={14} className="fill-[#ffb600] text-[#ffb600]" />
                  <span>리뷰 {product.reviews.toLocaleString()}개</span>
                  <span className="h-1 w-1 rounded-full bg-[#c9d3e1]" />
                  <MessageCircle size={14} />
                  <span>문의 {product.questions.toLocaleString()}개</span>
                </div>

                <div className="mt-4 flex items-baseline gap-2">
                  {product.discountRate > 0 && (
                    <span className="text-2xl font-black text-[#e11937]">
                      {product.discountRate}%
                    </span>
                  )}
                  <span className="text-3xl font-black tracking-[-0.03em] text-[#111827]">
                    {formatPrice(product.price)}
                  </span>
                </div>
                {product.originalPrice != null &&
                  product.originalPrice > product.price && (
                    <p className="mt-1 text-sm text-[#9aa7b8] line-through">
                      {formatPrice(product.originalPrice)}
                    </p>
                  )}

                <div className="mt-5 flex items-center gap-2">
                  <div className="flex-1">
                    <AddToCartButton productId={product.id} />
                  </div>
                  <WishlistButton
                    productId={product.id}
                    className="h-11 w-11"
                  />
                </div>
              </div>

              <div className="rounded-[24px] border border-[#e4ebf3] bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
                <h2 className="mb-3 font-black text-[#111827]">상품 설명</h2>
                <p className="text-sm leading-6 text-[#516074]">
                  {product.description}
                </p>
                <dl className="mt-4 flex flex-col gap-2 text-sm">
                  {Object.entries(product.details).map(([key, value]) => (
                    <div key={key} className="flex gap-3">
                      <dt className="w-24 flex-shrink-0 font-semibold text-[#111827]">
                        {key}
                      </dt>
                      <dd className="text-[#516074]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
          </div>
        )}

        {product && <ReviewSection productId={product.id} />}
      </main>
    </div>
  );
}
