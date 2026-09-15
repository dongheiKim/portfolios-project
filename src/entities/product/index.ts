export type {
  ProductDetail,
  ProductSummary,
  ProductCategory,
  ProductSortBy,
} from "./model/productTypes";
export { fetchProductById, searchProducts } from "./api/productApi";
export type { ProductSearchFilters } from "./api/productApi";
export { ProductCard } from "./ui/productCard";
