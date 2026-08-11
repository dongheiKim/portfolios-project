import { useCallback, useRef } from "react";
import { SIDEBAR_CATEGORY_ORDER } from "../model/sidebarCategories";
import { useCategoryProducts } from "../model/useCategoryProducts";
import { useHeaderOffset } from "../model/useHeaderOffset";
import { useScrollSpy } from "../model/useScrollSpy";
import { CategorySidebarNav } from "./CategorySidebarNav";
import { CategorySection } from "./CategorySection";
import {
  MAIN_CATEGORY_PRODUCT_LIST_CONTENT_CLASS,
  MAIN_CATEGORY_PRODUCT_LIST_GRID_CLASS,
  MAIN_CATEGORY_PRODUCT_LIST_SECTION_CLASS,
} from "./styles";

export function MainCategoryProductList() {
  const mobileNavRef = useRef<HTMLDivElement | null>(null);
  const carouselRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { productsByCategory, rowsByCategory } = useCategoryProducts();
  const {
    localNavTop,
    sectionScrollMargin,
    siteHeaderHeight,
    mobileNavHeight,
  } = useHeaderOffset(mobileNavRef);
  const {
    activeCategory,
    handleSidebarClick,
    setSectionRef,
    setSidebarChipRef,
  } = useScrollSpy({
    siteHeaderHeight,
    mobileNavHeight,
  });

  // 캐러셀 좌우 화살표 클릭 시, 현재 보이는 폭의 90%만큼 부드럽게 스크롤 이동
  const scrollByAmount = useCallback(
    (rowKey: string, direction: "left" | "right") => {
      const target = carouselRefs.current[rowKey];
      if (!target) return;
      const step = target.clientWidth * 0.9;
      target.scrollBy({
        left: direction === "left" ? -step : step,
        behavior: "smooth",
      });
    },
    [],
  );

  const registerCarouselRef = useCallback(
    (rowKey: string, node: HTMLDivElement | null) => {
      carouselRefs.current[rowKey] = node;
    },
    [],
  );

  return (
    <section className={MAIN_CATEGORY_PRODUCT_LIST_SECTION_CLASS}>
      <div className={MAIN_CATEGORY_PRODUCT_LIST_GRID_CLASS}>
        <CategorySidebarNav
          localNavTop={localNavTop}
          mobileNavRef={mobileNavRef}
          activeCategory={activeCategory}
          productsByCategory={productsByCategory}
          onCategoryClick={handleSidebarClick}
          setSidebarChipRef={setSidebarChipRef}
        />

        <div className={MAIN_CATEGORY_PRODUCT_LIST_CONTENT_CLASS}>
          {SIDEBAR_CATEGORY_ORDER.map((category) => {
            const rows = rowsByCategory[category];

            return (
              <CategorySection
                key={category}
                category={category}
                sectionScrollMargin={sectionScrollMargin}
                rows={rows}
                setSectionRef={setSectionRef}
                registerCarouselRef={registerCarouselRef}
                onCarouselScroll={scrollByAmount}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
