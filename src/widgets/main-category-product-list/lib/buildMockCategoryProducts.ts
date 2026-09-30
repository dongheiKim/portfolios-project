import {
  findMockProductDetailById,
  mockProducts,
} from "@/entities/product/api/productApi.mock";
import { type ProductSummary } from "@/entities/product";
import {
  SIDEBAR_CATEGORY_ORDER,
  type SidebarCategoryId,
} from "../model/sidebarCategories";

export function buildMockCategoryProducts(
  category: SidebarCategoryId,
  count: number,
): ProductSummary[] {
  if (mockProducts.length === 0) {
    return [];
  }

  const categoryIndex = SIDEBAR_CATEGORY_ORDER.indexOf(category);
  if (categoryIndex === -1) {
    return [];
  }

  return Array.from({ length: count }, (_, index) => {
    const source = mockProducts[index % mockProducts.length];
    const uniqueId = (categoryIndex + 1) * 1000 + (index + 1);
    const productDetail = findMockProductDetailById(uniqueId);

    return {
      ...source,
      id: uniqueId,
      name: productDetail.name,
      category: productDetail.category,
      imageUrl: productDetail.imageUrls[0] ?? source.imageUrl,
      price: productDetail.price,
      originalPrice: productDetail.originalPrice,
      discountRate: productDetail.discountRate,
      reviewCount: source.reviewCount + index * 9,
      rating: Math.max(4, Math.min(5, source.rating + ((index % 3) - 1) * 0.1)),
      productDetail,
    };
  });
}
