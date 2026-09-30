import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router";
import { RotateCcw } from "lucide-react";
import {
  ProductCard,
  searchProducts,
  type ProductSortBy,
} from "@/entities/product";
import { AddToCartButton } from "@/features/cart/add-to-cart";
import { useFilterStore } from "@/features/product/filter-products";
import { WishlistButton } from "@/features/product/wishlist";
import {
  isInvalidPriceRange,
  parsePriceInput,
} from "@/pages/search/model/searchFilters";
import {
  SIDEBAR_CATEGORY_LABELS,
  SIDEBAR_CATEGORY_ORDER,
} from "@/widgets/main-category-product-list/model/sidebarCategories";
import { SectionSkeleton } from "@/shared/ui/Skeleton";

const SORT_OPTIONS: { value: ProductSortBy; label: string }[] = [
  { value: "newest", label: "최신순" },
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
  { value: "rating", label: "평점순" },
];

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const category = useFilterStore((s) => s.category);
  const minPrice = useFilterStore((s) => s.minPrice);
  const maxPrice = useFilterStore((s) => s.maxPrice);
  const sortBy = useFilterStore((s) => s.sortBy);
  const setCategory = useFilterStore((s) => s.setCategory);
  const setPriceRange = useFilterStore((s) => s.setPriceRange);
  const setSortBy = useFilterStore((s) => s.setSortBy);
  const resetFilters = useFilterStore((s) => s.resetFilters);
  const invalidPriceRange = isInvalidPriceRange(minPrice, maxPrice);

  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      "search-products",
      keyword,
      category,
      minPrice,
      maxPrice,
      sortBy,
    ],
    queryFn: () =>
      searchProducts({ keyword, category, minPrice, maxPrice, sortBy }),
    enabled: !invalidPriceRange,
  });

  return (
    <div className="coupang-shell min-h-screen flex flex-col bg-[#f4f7fb]">
      <main
        id="main-content"
        className="flex-1 max-w-6xl mx-auto w-full px-4 py-6"
      >
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#346aff]">
              Search Result
            </p>
            <h1 className="mt-1 text-2xl font-black text-[#111827]">
              {keyword ? `"${keyword}" 검색 결과` : "전체 상품"}
            </h1>
            {!isLoading && !isError && !invalidPriceRange && (
              <p className="mt-1 text-sm text-[#64748b]">
                총 {products?.length ?? 0}개의 상품
              </p>
            )}
          </div>

          <label className="flex items-center gap-2 text-sm text-[#516074]">
            정렬
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as ProductSortBy)}
              className="rounded-xl border border-[#e4ebf3] bg-white px-3 py-2 text-sm font-medium text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff]"
              aria-label="정렬 기준"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <section
          aria-label="상품 필터"
          className="mb-5 flex flex-wrap items-end gap-3 border-y border-[#e4ebf3] py-4"
        >
          <label className="flex flex-col gap-1 text-xs font-semibold text-[#516074]">
            카테고리
            <select
              value={category ?? ""}
              onChange={(event) => setCategory(event.target.value || null)}
              className="min-w-40 rounded-xl border border-[#e4ebf3] bg-white px-3 py-2 text-sm font-medium text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff]"
            >
              <option value="">전체 카테고리</option>
              {SIDEBAR_CATEGORY_ORDER.map((categoryId) => (
                <option key={categoryId} value={categoryId}>
                  {SIDEBAR_CATEGORY_LABELS[categoryId]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold text-[#516074]">
            최저가
            <input
              type="number"
              min={0}
              step={1000}
              inputMode="numeric"
              value={minPrice ?? ""}
              onChange={(event) =>
                setPriceRange(parsePriceInput(event.target.value), maxPrice)
              }
              aria-label="최저가"
              className="w-32 rounded-xl border border-[#e4ebf3] bg-white px-3 py-2 text-sm font-medium text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff]"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold text-[#516074]">
            최고가
            <input
              type="number"
              min={0}
              step={1000}
              inputMode="numeric"
              value={maxPrice ?? ""}
              onChange={(event) =>
                setPriceRange(minPrice, parsePriceInput(event.target.value))
              }
              aria-label="최고가"
              className="w-32 rounded-xl border border-[#e4ebf3] bg-white px-3 py-2 text-sm font-medium text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff]"
            />
          </label>

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 rounded-xl border border-[#e4ebf3] bg-white px-3 py-2 text-sm font-semibold text-[#516074] hover:border-[#bfd1ff] hover:text-[#346aff] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff]"
          >
            <RotateCcw size={16} aria-hidden="true" />
            필터 초기화
          </button>
        </section>

        {invalidPriceRange && (
          <p role="alert" className="mb-5 text-sm text-[#e11937]">
            최저가는 최고가보다 클 수 없습니다.
          </p>
        )}

        {!invalidPriceRange && isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <SectionSkeleton key={index} lines={3} />
            ))}
          </div>
        )}

        {!invalidPriceRange && isError && (
          <div className="rounded-[28px] border border-[#e4ebf3] bg-white py-20 text-center text-[#64748b] shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <p className="text-lg font-medium">상품을 불러오지 못했습니다.</p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-xl bg-[#346aff] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#2858d8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff] focus-visible:ring-offset-2"
            >
              다시 시도
            </button>
          </div>
        )}

        {!invalidPriceRange &&
          !isLoading &&
          !isError &&
          products &&
          products.length === 0 && (
            <div className="rounded-[28px] border border-[#e4ebf3] bg-white py-20 text-center text-[#64748b] shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <p className="text-lg font-medium">검색 결과가 없습니다.</p>
            </div>
          )}

        {!invalidPriceRange &&
          !isLoading &&
          !isError &&
          products &&
          products.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  actions={<AddToCartButton productId={product.id} />}
                  wishlistSlot={<WishlistButton productId={product.id} />}
                />
              ))}
            </div>
          )}
      </main>
    </div>
  );
}
