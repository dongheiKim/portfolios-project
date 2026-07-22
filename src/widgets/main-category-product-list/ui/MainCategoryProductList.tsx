import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, type ProductSummary } from "@/entities/product";
import { mockProducts } from "@/entities/product/api/productApi.mock";
import {
  SIDEBAR_CATEGORY_LABELS,
  SIDEBAR_CATEGORY_ORDER,
  type SidebarCategoryId,
} from "@/entities/category/model/sidebarCategories";

// 선택된 카테고리 안에서 보여줄 캐러셀 행(row) 정의
const CAROUSEL_ROWS = [
  { key: "trend", title: "지금 많이 보는 상품", offset: 0 },
  { key: "new", title: "방금 들어온 신상품", offset: 3 },
  { key: "deal", title: "오늘의 특가", offset: 6 },
] as const;

/**
 * 목(mock) 상품 데이터를 기반으로 특정 사이드바 카테고리의 상품 목록을 생성한다.
 * 여기서 만들어지는 상품의 category 값은 entities/category 트리를 참조하는
 * ProductCategory(string)로 들어가며, 사이드바 고정 목록과는 별개다.
 */
function buildCategoryProducts(
  category: SidebarCategoryId,
  count: number,
): ProductSummary[] {
  const baseProducts = mockProducts.length > 0 ? mockProducts : [];

  if (baseProducts.length === 0) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => {
    const source = baseProducts[index % baseProducts.length];
    const uniqueId = Number(
      `${SIDEBAR_CATEGORY_ORDER.indexOf(category) + 1}${index + 1}`,
    );

    return {
      ...source,
      id: uniqueId,
      name: `${SIDEBAR_CATEGORY_LABELS[category]} 추천 ${index + 1}`,
      category, // ProductCategory(string)로 자연스럽게 대입됨
      imageUrl: `${source.imageUrl}?category=${category}&slot=${index + 1}`,
      reviewCount: source.reviewCount + index * 9,
      rating: Math.max(4, Math.min(5, source.rating + ((index % 3) - 1) * 0.1)),
      productDetail: {
        ...source.productDetail,
        id: uniqueId,
        name: `${SIDEBAR_CATEGORY_LABELS[category]} 추천 ${index + 1}`,
        category,
        price: source.price + index * 500,
        originalPrice:
          (source.originalPrice ?? source.price + 1000) + index * 600,
      },
    };
  });
}

export function MainCategoryProductList() {
  const [selectedCategory, setSelectedCategory] =
    useState<SidebarCategoryId>("electronics");

  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const productsByCategory = useMemo(() => {
    return SIDEBAR_CATEGORY_ORDER.reduce<
      Record<SidebarCategoryId, ProductSummary[]>
    >(
      (acc, category) => {
        acc[category] = buildCategoryProducts(category, 12);
        return acc;
      },
      {} as Record<SidebarCategoryId, ProductSummary[]>,
    );
  }, []);

  const selectedProducts = productsByCategory[selectedCategory] ?? [];

  const scrollRow = (rowKey: string, direction: "left" | "right") => {
    const target = carouselRefs.current[rowKey];
    if (!target) return;
    const amount = direction === "left" ? -720 : 720;
    target.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section className="mx-auto mt-10 grid max-w-[1400px] gap-6 px-3 pb-12 md:grid-cols-[220px_minmax(0,1fr)] md:px-6">
      {/* 왼쪽 카테고리 사이드바: 고정 목록, 분류 체계 성장과 무관 */}
      <aside className="rounded-2xl border border-[#dce5f2] bg-white p-4 shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
        <div className="space-y-2">
          {SIDEBAR_CATEGORY_ORDER.map((category) => {
            const isActive = selectedCategory === category;
            const itemCount = productsByCategory[category]?.length ?? 0;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "border-[#2563eb] bg-[#eef4ff] text-[#1d4ed8]"
                    : "border-transparent bg-[#f8fbff] text-[#334155] hover:border-[#d5deec] hover:bg-[#f1f6ff]"
                }`}
              >
                <span>{SIDEBAR_CATEGORY_LABELS[category]}</span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs text-[#64748b]">
                  {itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* 오른쪽 캐러셀 영역 */}
      <div className="space-y-5">
        {CAROUSEL_ROWS.map((row) => {
          const rowProducts = selectedProducts
            .slice(row.offset)
            .concat(selectedProducts.slice(0, row.offset))
            .slice(0, 8);

          return (
            <section
              key={row.key}
              className="rounded-2xl border border-[#dce5f2] bg-white p-4 shadow-[0_10px_22px_rgba(15,23,42,0.06)] md:p-5"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black tracking-[-0.02em] text-[#0f172a]">
                    {SIDEBAR_CATEGORY_LABELS[selectedCategory]} · {row.title}
                  </h3>
                  <p className="text-xs text-[#64748b]">
                    카테고리 추천 상품을 캐러셀로 탐색해보세요.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => scrollRow(row.key, "left")}
                    className="rounded-full border border-[#d6deec] bg-white p-2 text-[#334155] transition hover:border-[#a7bbdf] hover:text-[#1d4ed8]"
                    aria-label={`${row.title} 이전 상품 보기`}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollRow(row.key, "right")}
                    className="rounded-full border border-[#d6deec] bg-white p-2 text-[#334155] transition hover:border-[#a7bbdf] hover:text-[#1d4ed8]"
                    aria-label={`${row.title} 다음 상품 보기`}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div
                ref={(node) => {
                  carouselRefs.current[row.key] = node;
                }}
                className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {rowProducts.map((product) => (
                  <div
                    key={`${row.key}-${product.id}`}
                    className="w-[190px] shrink-0 snap-start sm:w-[210px]"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </section>
  );
}
