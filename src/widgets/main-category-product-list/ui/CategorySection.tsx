import { useCallback } from "react";
import {
  FEATURED_ROW,
  GRID_ROW,
  type CategoryRows,
} from "../model/useCategoryProducts";
import {
  SIDEBAR_CATEGORY_LABELS,
  type SidebarCategoryId,
} from "../model/sidebarCategories";
import { CarouselSection } from "./CarouselSection";
import {
  CATEGORY_SECTION_CARD_CLASS,
  CATEGORY_SECTION_CARD_INNER_CLASS,
  CATEGORY_SECTION_FEATURED_ARROWS_CLASS,
  CATEGORY_SECTION_FEATURED_ITEM_CLASS,
  CATEGORY_SECTION_FEATURED_WRAP_CLASS,
  CATEGORY_SECTION_GRID_ARROWS_CLASS,
  CATEGORY_SECTION_GRID_ITEM_CLASS,
  CATEGORY_SECTION_GRID_WRAP_CLASS,
  CATEGORY_SECTION_ROOT_CLASS,
  CATEGORY_SECTION_TITLE_CLASS,
} from "./styles";

interface CategorySectionProps {
  category: SidebarCategoryId;
  sectionScrollMargin: number;
  rows: CategoryRows;
  setSectionRef: (
    category: SidebarCategoryId,
    node: HTMLElement | null,
  ) => void;
  registerCarouselRef: (rowKey: string, node: HTMLDivElement | null) => void;
  onCarouselScroll: (rowKey: string, direction: "left" | "right") => void;
}

export function CategorySection({
  category,
  sectionScrollMargin,
  rows,
  setSectionRef,
  registerCarouselRef,
  onCarouselScroll,
}: CategorySectionProps) {
  const { featuredProducts, gridProducts } = rows;
  const featuredKey = `${category}-${FEATURED_ROW.key}`;
  const gridKey = `${category}-${GRID_ROW.key}`;

  const sectionRef = useCallback(
    (node: HTMLElement | null) => {
      setSectionRef(category, node);
    },
    [category, setSectionRef],
  );

  const featuredRef = useCallback(
    (node: HTMLDivElement | null) => {
      registerCarouselRef(featuredKey, node);
    },
    [featuredKey, registerCarouselRef],
  );

  const gridRef = useCallback(
    (node: HTMLDivElement | null) => {
      registerCarouselRef(gridKey, node);
    },
    [gridKey, registerCarouselRef],
  );

  return (
    <section
      ref={sectionRef}
      data-category={category}
      style={{ scrollMarginTop: sectionScrollMargin }}
      className={CATEGORY_SECTION_ROOT_CLASS}
    >
      <h2 className={CATEGORY_SECTION_TITLE_CLASS}>
        {SIDEBAR_CATEGORY_LABELS[category]}
      </h2>

      <div className={CATEGORY_SECTION_CARD_CLASS}>
        <div className={CATEGORY_SECTION_CARD_INNER_CLASS}>
          <div className={CATEGORY_SECTION_FEATURED_WRAP_CLASS}>
            <CarouselSection
              title={FEATURED_ROW.title}
              rowKey={featuredKey}
              products={featuredProducts}
              itemClassName={CATEGORY_SECTION_FEATURED_ITEM_CLASS}
              arrowsClassName={CATEGORY_SECTION_FEATURED_ARROWS_CLASS}
              registerRef={featuredRef}
              onScroll={onCarouselScroll}
            />
          </div>

          <div className={CATEGORY_SECTION_GRID_WRAP_CLASS}>
            <CarouselSection
              title={GRID_ROW.title}
              rowKey={gridKey}
              products={gridProducts}
              itemClassName={CATEGORY_SECTION_GRID_ITEM_CLASS}
              arrowsClassName={CATEGORY_SECTION_GRID_ARROWS_CLASS}
              registerRef={gridRef}
              onScroll={onCarouselScroll}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
