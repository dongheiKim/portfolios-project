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
  // 리스트 하단에 거의 도달했을 때 다음 페이지를 미리 불러오기 위해
  // 관찰용 센티넬 요소(ref)의 뷰포트 진입 여부를 감지한다.
  // rootMargin을 200px로 두어 실제 바닥에 닿기 전에 선제적으로 로딩을 시작한다.
  const { ref, inView } = useInView({ threshold: 0.1, rootMargin: "200px" });

  useEffect(() => {
    // 센티넬이 화면에 들어왔고, 더 불러올 페이지가 남아 있으며,
    // 현재 추가 요청이 진행 중이 아닐 때만 다음 페이지 요청을 1회 트리거한다.
    // 중복 호출을 막아 불필요한 네트워크 요청 폭주를 방지한다.
    if (inView && hasNextPage && !isFetchingNextPage) {
      onLoadMore?.();
    }
  }, [inView, hasNextPage, isFetchingNextPage, onLoadMore]);

  // 초기 로딩 상태에서는 실제 카드 대신 스켈레톤 카드를 일정 개수 노출해
  // 레이아웃 점프를 줄이고 사용자가 로딩 맥락을 즉시 이해할 수 있게 한다.
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
      {/*
        다음 페이지를 불러오는 동안 기존 상품 카드는 그대로 유지하고,
        하단에 인라인 로더만 추가로 보여 연속 탐색 흐름이 끊기지 않도록 한다.
      */}
      {isFetchingNextPage && <Loader2 />}
      {/*
        무한 스크롤 트리거용 센티넬 요소.
        이 요소가 뷰포트에 진입하면 useEffect 조건에 따라 onLoadMore가 호출된다.
      */}
      <div ref={ref} />
    </div>
  );
}
