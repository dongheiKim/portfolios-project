import { type RefObject } from "react";
import { type ProductSummary } from "@/entities/product";
import {
  SIDEBAR_CATEGORY_LABELS,
  SIDEBAR_CATEGORY_ORDER,
  type SidebarCategoryId,
} from "../model/sidebarCategories";
import {
  SIDEBAR_COUNT_BADGE_CLASS,
  SIDEBAR_DESKTOP_LIST_CLASS,
  SIDEBAR_MOBILE_CHIP_CONTAINER_CLASS,
  SIDEBAR_WRAPPER_CLASS,
  getSidebarDesktopItemClass,
  getSidebarMobileChipClass,
} from "./styles";

interface CategorySidebarNavProps {
  localNavTop: number;
  mobileNavRef: RefObject<HTMLDivElement | null>;
  activeCategory: SidebarCategoryId;
  productsByCategory: Record<SidebarCategoryId, ProductSummary[]>;
  onCategoryClick: (category: SidebarCategoryId) => void;
  setSidebarChipRef: (
    category: SidebarCategoryId,
    node: HTMLButtonElement | null,
  ) => void;
}

export function CategorySidebarNav({
  localNavTop,
  mobileNavRef,
  activeCategory,
  productsByCategory,
  onCategoryClick,
  setSidebarChipRef,
}: CategorySidebarNavProps) {
  return (
    <aside
      aria-label="카테고리 바로가기"
      style={{ top: localNavTop }}
      className={SIDEBAR_WRAPPER_CLASS}
    >
      <div ref={mobileNavRef} className={SIDEBAR_MOBILE_CHIP_CONTAINER_CLASS}>
        {SIDEBAR_CATEGORY_ORDER.map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              ref={(node) => {
                setSidebarChipRef(category, node);
              }}
              onClick={() => onCategoryClick(category)}
              aria-current={isActive ? "page" : undefined}
              aria-pressed={isActive}
              className={getSidebarMobileChipClass(isActive)}
            >
              {SIDEBAR_CATEGORY_LABELS[category]}
            </button>
          );
        })}
      </div>

      <div className={SIDEBAR_DESKTOP_LIST_CLASS}>
        {SIDEBAR_CATEGORY_ORDER.map((category) => {
          const isActive = activeCategory === category;
          const itemCount = productsByCategory[category]?.length ?? 0;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryClick(category)}
              aria-current={isActive ? "page" : undefined}
              aria-pressed={isActive}
              className={getSidebarDesktopItemClass(isActive)}
            >
              <span>{SIDEBAR_CATEGORY_LABELS[category]}</span>
              <span className={SIDEBAR_COUNT_BADGE_CLASS}>{itemCount}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
