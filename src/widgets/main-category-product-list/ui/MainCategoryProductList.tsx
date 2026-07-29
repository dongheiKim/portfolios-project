import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard, type ProductSummary } from "@/entities/product";
import { mockProducts } from "@/entities/product/api/productApi.mock";
import {
  SIDEBAR_CATEGORY_LABELS,
  SIDEBAR_CATEGORY_ORDER,
  type SidebarCategoryId,
} from "@/widgets/main-category-product-list";

const FEATURED_ROW = { key: "featured", title: "오늘의 추천", offset: 0 };
const GRID_ROW = { key: "grid", title: "함께 보면 좋은 상품", offset: 3 };

const PROGRAMMATIC_SCROLL_GUARD_MS = 600;
const SCROLL_OFFSET_GAP = 16;

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
      category,
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

interface CarouselSectionProps {
  title: string;
  rowKey: string;
  itemClassName: string;
  // 기본값을 두지 않고 필수로 지정: 두 호출부가 서로 다른 named container를
  // 참조해야 하므로(@sm/card vs @sm/grid) 암묵적 기본값은 오히려 혼동을 줄 수 있음
  arrowsClassName: string;
  products: ProductSummary[];
  registerRef: (node: HTMLDivElement | null) => void;
  onScroll: (rowKey: string, direction: "left" | "right") => void;
}

function CarouselSection({
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
        <h3 className="text-sm font-black tracking-[-0.02em] text-[#0f172a] @sm/card:text-base">
          {title}
        </h3>
        <div className={`hidden items-center gap-2 ${arrowsClassName}`}>
          <button
            type="button"
            onClick={() => onScroll(rowKey, "left")}
            className="rounded-full border border-[#d6deec] bg-white p-2 text-[#334155] transition hover:border-[#a7bbdf] hover:text-[#1d4ed8]"
            aria-label={`${title} 이전 상품 보기`}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => onScroll(rowKey, "right")}
            className="rounded-full border border-[#d6deec] bg-white p-2 text-[#334155] transition hover:border-[#a7bbdf] hover:text-[#1d4ed8]"
            aria-label={`${title} 다음 상품 보기`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={registerRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product) => (
          <div key={`${rowKey}-${product.id}`} className={itemClassName}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MainCategoryProductList() {
  const [activeCategory, setActiveCategory] = useState<SidebarCategoryId>(
    SIDEBAR_CATEGORY_ORDER[0],
  );

  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sectionRefs = useRef<Record<SidebarCategoryId, HTMLElement | null>>(
    {} as Record<SidebarCategoryId, HTMLElement | null>,
  );
  const sidebarChipRefs = useRef<
    Record<SidebarCategoryId, HTMLButtonElement | null>
  >({} as Record<SidebarCategoryId, HTMLButtonElement | null>);

  const isProgrammaticScroll = useRef(false);
  // 제네릭에 `| null`을 명시해 초기값 null과 타입이 일치하도록 수정
  const programmaticScrollTimeout = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [siteHeaderHeight, setSiteHeaderHeight] = useState(0);
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const [mobileNavHeight, setMobileNavHeight] = useState(0);

  useEffect(() => {
    // querySelector("header") 대신 고유 id로 명확히 지정:
    // 페이지 내 다른 <header> 요소(예: article 안 semantic header)와 혼동 방지
    const headerEl = document.getElementById("site-header");
    if (!headerEl) return;

    const update = () =>
      setSiteHeaderHeight(headerEl.getBoundingClientRect().height);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(headerEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = mobileNavRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      setMobileNavHeight(entries[0].contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const category = visible[0].target.getAttribute(
            "data-category",
          ) as SidebarCategoryId | null;
          if (category) setActiveCategory(category);
        }
      },
      // 전역 헤더 + 로컬 네비 높이만큼 상단을 밀어서 기준선을 잡음
      {
        rootMargin: `-${siteHeaderHeight + mobileNavHeight + 40}px 0px -50% 0px`,
        threshold: 0,
      },
    );

    SIDEBAR_CATEGORY_ORDER.forEach((category) => {
      const el = sectionRefs.current[category];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [siteHeaderHeight, mobileNavHeight]);

  useEffect(() => {
    sidebarChipRefs.current[activeCategory]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeCategory]);

  useEffect(() => {
    return () => {
      if (programmaticScrollTimeout.current) {
        clearTimeout(programmaticScrollTimeout.current);
      }
    };
  }, []);

  const scrollByAmount = (rowKey: string, direction: "left" | "right") => {
    const target = carouselRefs.current[rowKey];
    if (!target) return;
    const step = target.clientWidth * 0.9;
    target.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  const handleSidebarClick = (category: SidebarCategoryId) => {
    setActiveCategory(category);

    isProgrammaticScroll.current = true;
    // ref 타입이 `| null`로 바로잡혀 더 이상 `as` 캐스팅이 필요 없음
    if (programmaticScrollTimeout.current) {
      clearTimeout(programmaticScrollTimeout.current);
    }
    programmaticScrollTimeout.current = setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, PROGRAMMATIC_SCROLL_GUARD_MS);

    sectionRefs.current[category]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const localNavTop = siteHeaderHeight;
  const sectionScrollMargin =
    siteHeaderHeight + mobileNavHeight + SCROLL_OFFSET_GAP;

  return (
    <section className="mx-auto mt-10 max-w-[1400px] px-3 pb-12 md:px-6">
      <div className="md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6">
        {/* 카테고리 네비게이션 */}
        <aside
          aria-label="카테고리 바로가기"
          style={{ top: localNavTop }}
          className="
            sticky z-10 -mx-3 mb-4 border-b border-[#e5ebf5] bg-white/95 px-3 py-2 backdrop-blur
            md:static md:z-auto md:mx-0 md:mb-0 md:h-fit md:border-none md:bg-transparent
            md:rounded-2xl md:border md:border-[#dce5f2] md:bg-white md:p-4
            md:shadow-[0_10px_22px_rgba(15,23,42,0.06)] md:sticky
          "
        >
          <div
            ref={mobileNavRef}
            className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden"
          >
            {SIDEBAR_CATEGORY_ORDER.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  ref={(node) => {
                    sidebarChipRefs.current[category] = node;
                  }}
                  onClick={() => handleSidebarClick(category)}
                  aria-current={isActive ? "true" : undefined}
                  className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-[#2563eb] bg-[#eef4ff] text-[#1d4ed8]"
                      : "border-[#d6deec] bg-white text-[#334155] hover:border-[#a7bbdf]"
                  }`}
                >
                  {SIDEBAR_CATEGORY_LABELS[category]}
                </button>
              );
            })}
          </div>

          {/* md 이상: 세로 목록 (개수 배지 포함) */}
          <div className="hidden space-y-2 md:block">
            {SIDEBAR_CATEGORY_ORDER.map((category) => {
              const isActive = activeCategory === category;
              const itemCount = productsByCategory[category]?.length ?? 0;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleSidebarClick(category)}
                  aria-current={isActive ? "true" : undefined}
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

        {/* 카테고리별 섹션 */}
        <div className="space-y-8 md:space-y-10">
          {SIDEBAR_CATEGORY_ORDER.map((category) => {
            const categoryProducts = productsByCategory[category] ?? [];

            const featuredProducts = categoryProducts
              .slice(FEATURED_ROW.offset)
              .concat(categoryProducts.slice(0, FEATURED_ROW.offset))
              .slice(0, 5);

            const gridProducts = categoryProducts
              .slice(GRID_ROW.offset)
              .concat(categoryProducts.slice(0, GRID_ROW.offset))
              .slice(0, 8);

            const featuredKey = `${category}-${FEATURED_ROW.key}`;
            const gridKey = `${category}-${GRID_ROW.key}`;

            return (
              <section
                key={category}
                ref={(node) => {
                  sectionRefs.current[category] = node;
                }}
                data-category={category}
                style={{ scrollMarginTop: sectionScrollMargin }}
                className="space-y-3"
              >
                <h2 className="text-lg font-black tracking-[-0.02em] text-[#0f172a] md:text-xl">
                  {SIDEBAR_CATEGORY_LABELS[category]}
                </h2>

                {/* 큰 단일 상품 캐러셀 + 4개 캐러셀을 하나의 카드로 통합 */}
                <div className="@container/card rounded-2xl border border-[#dce5f2] bg-white p-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)] sm:p-4 md:p-5">
                  <div className="flex flex-col gap-4 @5xl/card:flex-row @5xl/card:items-stretch">
                    {/* 큰 단일 상품 캐러셀: 가로 배치 시 고정 폭, 세로 배치 시 전체 폭 */}
                    <div className="@5xl/card:w-[400px] @5xl/card:shrink-0">
                      <CarouselSection
                        title={FEATURED_ROW.title}
                        rowKey={featuredKey}
                        products={featuredProducts}
                        itemClassName="w-full shrink-0 snap-center"
                        arrowsClassName="@sm/card:flex"
                        registerRef={(node) => {
                          carouselRefs.current[featuredKey] = node;
                        }}
                        onScroll={scrollByAmount}
                      />
                    </div>

                    {/* 4개 노출 캐러셀: 자기 자신의 실제 폭 기준(named container)으로 개수 결정 */}
                    <div className="@container/grid flex-1 border-t border-[#eef2f6] pt-4 @5xl/card:border-t-0 @5xl/card:border-l @5xl/card:pl-4 @5xl/card:pt-0">
                      <CarouselSection
                        title={GRID_ROW.title}
                        rowKey={gridKey}
                        products={gridProducts}
                        itemClassName="shrink-0 snap-start basis-[calc(50%-6px)] @sm/grid:basis-[calc(33.333%-8px)] @lg/grid:basis-[calc(25%-9px)]"
                        arrowsClassName="@sm/grid:flex"
                        registerRef={(node) => {
                          carouselRefs.current[gridKey] = node;
                        }}
                        onScroll={scrollByAmount}
                      />
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
