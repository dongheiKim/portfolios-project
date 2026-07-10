import { create } from "zustand";
import type { ProductCategory } from "@/entities/product";

type SortBy = "price_asc" | "price_desc" | "rating" | "newest";

interface FilterState {
  keyword: string;
  category: ProductCategory | null;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: SortBy;
  setKeyword: (keyword: string) => void;
  setCategory: (category: ProductCategory | null) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setSortBy: (sortBy: SortBy) => void;
  resetFilters: () => void;
}

const defaultState = {
  keyword: "",
  category: null as ProductCategory | null,
  minPrice: null as number | null,
  maxPrice: null as number | null,
  sortBy: "newest" as SortBy,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...defaultState,
  setKeyword: (keyword) => set({ keyword }),
  setCategory: (category) => set({ category }),
  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice }),
  setSortBy: (sortBy) => set({ sortBy }),
  resetFilters: () => set(defaultState),
}));
