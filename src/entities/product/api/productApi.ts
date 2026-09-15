import type {
  ProductDetail,
  ProductSortBy,
  ProductSummary,
} from "../model/productTypes";
import { findMockProductDetailById, mockProducts } from "./productApi.mock";

export async function fetchProductById(id: number): Promise<ProductDetail> {
  return findMockProductDetailById(id);
}

export interface ProductSearchFilters {
  keyword: string;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  sortBy: ProductSortBy;
}

export async function searchProducts(
  filters: ProductSearchFilters,
): Promise<ProductSummary[]> {
  const keyword = filters.keyword.trim().toLowerCase();

  const filtered = mockProducts.filter((product) => {
    const matchesKeyword =
      keyword.length === 0 ||
      product.name.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword);
    const matchesCategory =
      !filters.category || product.category === filters.category;
    const matchesMinPrice =
      filters.minPrice == null || product.price >= filters.minPrice;
    const matchesMaxPrice =
      filters.maxPrice == null || product.price <= filters.maxPrice;

    return (
      matchesKeyword && matchesCategory && matchesMinPrice && matchesMaxPrice
    );
  });

  return [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
      default:
        return b.id - a.id;
    }
  });
}
