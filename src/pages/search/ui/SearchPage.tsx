import { useQuery } from "@tanstack/react-query";
import {
  ProductCard,
  searchProducts,
  type ProductSortBy,
} from "@/entities/product";
import { AddToCartButton } from "@/features/cart/add-to-cart";
import { useFilterStore } from "@/features/product/filter-products";
import { WishlistButton } from "@/features/product/wishlist";
import { SectionSkeleton } from "@/shared/ui/Skeleton";

const SORT_OPTIONS: { value: ProductSortBy; label: string }[] = [
  { value: "newest", label: "최신순" },
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
  { value: "rating", label: "평점순" },
];

export function SearchPage() {
  const keyword = useFilterStore((s) => s.keyword);
  const category = useFilterStore((s) => s.category);
  const minPrice = useFilterStore((s) => s.minPrice);
  const maxPrice = useFilterStore((s) => s.maxPrice);
  const sortBy = useFilterStore((s) => s.sortBy);
  const setSortBy = useFilterStore((s) => s.setSortBy);

  const { data: products, isLoading } = useQuery({
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
            {!isLoading && (
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

        {isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <SectionSkeleton key={index} lines={3} />
            ))}
          </div>
        )}

        {!isLoading && products && products.length === 0 && (
          <div className="rounded-[28px] border border-[#e4ebf3] bg-white py-20 text-center text-[#64748b] shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <p className="text-lg font-medium">검색 결과가 없습니다.</p>
          </div>
        )}

        {!isLoading && products && products.length > 0 && (
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
