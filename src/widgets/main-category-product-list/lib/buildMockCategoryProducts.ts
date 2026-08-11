import { mockProducts } from "@/entities/product/api/productApi.mock";
import { type ProductSummary } from "@/entities/product";
import {
  SIDEBAR_CATEGORY_LABELS,
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
    const imageUrl = `${source.imageUrl}?category=${category}&slot=${index + 1}`;
    const price = source.price + index * 500;
    const originalPrice =
      (source.originalPrice ?? source.price + 1000) + index * 600;
    const discountRate = Math.round(
      ((originalPrice - price) / originalPrice) * 100,
    );

    return {
      ...source,
      id: uniqueId,
      name: `${SIDEBAR_CATEGORY_LABELS[category]} 추천 ${index + 1}`,
      category,
      imageUrl,
      price,
      originalPrice,
      discountRate,
      reviewCount: source.reviewCount + index * 9,
      rating: Math.max(4, Math.min(5, source.rating + ((index % 3) - 1) * 0.1)),
      productDetail: {
        ...source.productDetail,
        id: uniqueId,
        name: `${SIDEBAR_CATEGORY_LABELS[category]} 추천 ${index + 1}`,
        category,
        price,
        originalPrice,
        discountRate,
        imageUrls: [imageUrl, ...source.productDetail.imageUrls.slice(1)],
      },
    };
  });
}
