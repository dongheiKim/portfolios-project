import { useEffect } from "react";
import { PackageSearch, Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { ProductCard } from "@/entities/product";
import { ProductCardSkeleton } from "@/shared/ui/Skeleton";
import { StatusPanel } from "@/shared/ui/StatusPanel";
import type { ProductSummary } from "@/entities/product";

interface ProductListProps {
  products: ProductSummary[];
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  skeletonCount?: number;
}

export function ProductList({
  products,
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onLoadMore,
  skeletonCount = 20,
}: ProductListProps) {
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: "200px" });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      onLoadMore?.();
    }
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore]);

  if (isLoading) {
    return (
      <div className="product-grid grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <StatusPanel
        icon={<PackageSearch size={42} strokeWidth={1.6} />}
        title="검색 결과가 없습니다"
        description="다른 검색어나 필터를 이용해 로켓배송 인기 상품을 다시 찾아보세요."
        meta={
          <>
            <span className="rounded-full bg-[#f6f9fd] px-3 py-2 text-sm font-medium text-[#4a5a72]">
              검색어 변경
            </span>
            <span className="rounded-full bg-[#f6f9fd] px-3 py-2 text-sm font-medium text-[#4a5a72]">
              카테고리 전체 보기
            </span>
          </>
        }
        className="border-dashed border-[#d7dfeb] bg-[#fbfcfe] py-20"
      />
    );
  }

  return (
    <div className="product-grid grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      {isFetchingNextPage && <Loader2 />}
      <div ref={ref} />
    </div>
  );
}
