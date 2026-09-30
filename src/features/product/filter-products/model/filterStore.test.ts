import { beforeEach, describe, expect, it } from "vitest";

import { useFilterStore } from "./filterStore";

describe("useFilterStore", () => {
  beforeEach(() => {
    useFilterStore.getState().resetFilters();
  });

  it("resets all filters to their default values", () => {
    useFilterStore.getState().setKeyword("노트북");
    useFilterStore.getState().setCategory("electronics");
    useFilterStore.getState().setPriceRange(10000, 500000);
    useFilterStore.getState().setSortBy("price_desc");

    useFilterStore.getState().resetFilters();

    expect(useFilterStore.getState()).toMatchObject({
      keyword: "",
      category: null,
      minPrice: null,
      maxPrice: null,
      sortBy: "newest",
    });
  });

  it("stores category and price range selections", () => {
    useFilterStore.getState().setCategory("electronics");
    useFilterStore.getState().setPriceRange(10000, 50000);

    expect(useFilterStore.getState()).toMatchObject({
      category: "electronics",
      minPrice: 10000,
      maxPrice: 50000,
    });
  });
});
