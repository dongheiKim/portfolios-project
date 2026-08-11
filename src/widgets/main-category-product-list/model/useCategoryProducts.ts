import { useMemo } from "react";
import { type ProductSummary } from "@/entities/product";
import { buildMockCategoryProducts } from "../lib/buildMockCategoryProducts";
import {
  SIDEBAR_CATEGORY_ORDER,
  type SidebarCategoryId,
} from "./sidebarCategories";

export const FEATURED_COUNT = 5;
export const GRID_COUNT = 8;
export const FEATURED_ROW = {
  key: "featured",
  title: "오늘의 추천",
  offset: 0,
};
export const GRID_ROW = {
  key: "grid",
  title: "함께 보면 좋은 상품",
  offset: FEATURED_COUNT,
};
const CATEGORY_PRODUCT_COUNT = FEATURED_COUNT + GRID_COUNT;

function rotateSlice(
  products: ProductSummary[],
  offset: number,
  count: number,
) {
  return products
    .slice(offset)
    .concat(products.slice(0, offset))
    .slice(0, count);
}

export interface CategoryRows {
  featuredProducts: ProductSummary[];
  gridProducts: ProductSummary[];
}

export function useCategoryProducts() {
  const productsByCategory = useMemo(() => {
    return SIDEBAR_CATEGORY_ORDER.reduce<
      Record<SidebarCategoryId, ProductSummary[]>
    >(
      (acc, category) => {
        acc[category] = buildMockCategoryProducts(
          category,
          CATEGORY_PRODUCT_COUNT,
        );
        return acc;
      },
      {} as Record<SidebarCategoryId, ProductSummary[]>,
    );
  }, []);

  const rowsByCategory = useMemo(() => {
    return SIDEBAR_CATEGORY_ORDER.reduce<
      Record<SidebarCategoryId, CategoryRows>
    >(
      (acc, category) => {
        const categoryProducts = productsByCategory[category] ?? [];

        acc[category] = {
          featuredProducts: rotateSlice(
            categoryProducts,
            FEATURED_ROW.offset,
            FEATURED_COUNT,
          ),
          gridProducts: rotateSlice(
            categoryProducts,
            GRID_ROW.offset,
            GRID_COUNT,
          ),
        };

        return acc;
      },
      {} as Record<SidebarCategoryId, CategoryRows>,
    );
  }, [productsByCategory]);

  return { productsByCategory, rowsByCategory };
}
