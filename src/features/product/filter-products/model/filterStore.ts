import { create } from "zustand";
import type { ProductCategory, ProductSortBy } from "@/entities/product";

interface FilterState {
  keyword: string;
  category: ProductCategory | null;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: ProductSortBy;
  setKeyword: (keyword: string) => void;
  setCategory: (category: ProductCategory | null) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setSortBy: (sortBy: ProductSortBy) => void;
  resetFilters: () => void;
}

const defaultState = {
  keyword: "",
  category: null as ProductCategory | null,
  minPrice: null as number | null,
  maxPrice: null as number | null,
  sortBy: "newest" as ProductSortBy,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...defaultState,
  setKeyword: (keyword) => set({ keyword }),
  setCategory: (category) => set({ category }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set(defaultState),
}));
