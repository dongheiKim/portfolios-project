import { describe, expect, it } from "vitest";

import { fetchProductById, searchProducts } from "./productApi";
import { buildMockCategoryProducts } from "@/widgets/main-category-product-list/lib/buildMockCategoryProducts";

describe("searchProducts", () => {
  it("normalizes keywords and applies category and inclusive price filters", async () => {
    const products = await searchProducts({
      keyword: "  무선 ",
      category: "electronics",
      minPrice: 39900,
      maxPrice: 39900,
      sortBy: "newest",
    });

    expect(products.map((product) => product.id)).toEqual([1]);
  });

  it("includes both price boundaries and returns the requested sort order", async () => {
    const products = await searchProducts({
      keyword: "",
      category: null,
      minPrice: 18900,
      maxPrice: 22900,
      sortBy: "price_asc",
    });

    expect(products.map((product) => product.id)).toEqual([3, 14, 16, 5]);
  });

  it("supports each advertised sort order", async () => {
    const filters = {
      keyword: "",
      category: null,
      minPrice: null,
      maxPrice: null,
    };
    const [priceAscending, priceDescending, byRating, newest] =
      await Promise.all([
        searchProducts({ ...filters, sortBy: "price_asc" }),
        searchProducts({ ...filters, sortBy: "price_desc" }),
        searchProducts({ ...filters, sortBy: "rating" }),
        searchProducts({ ...filters, sortBy: "newest" }),
      ]);

    expect(priceAscending[0].price).toBeLessThan(
      priceAscending[priceAscending.length - 1].price,
    );
    expect(priceDescending[0].price).toBeGreaterThan(
      priceDescending[priceDescending.length - 1].price,
    );
    expect(byRating[0].rating).toBe(4.8);
    expect(newest[0].id).toBeGreaterThan(newest[newest.length - 1].id);
  });
});

describe("fetchProductById", () => {
  it("preserves generated category product details", async () => {
    const generatedProduct = buildMockCategoryProducts("femalefashion", 1)[0];
    const product = await fetchProductById(generatedProduct.id);

    expect(product).toMatchObject({
      id: generatedProduct.id,
      name: generatedProduct.name,
      price: generatedProduct.price,
      originalPrice: generatedProduct.originalPrice,
      discountRate: generatedProduct.discountRate,
      category: generatedProduct.category,
      imageUrls: generatedProduct.productDetail.imageUrls,
      reviews: generatedProduct.reviewCount,
    });
  });
});
