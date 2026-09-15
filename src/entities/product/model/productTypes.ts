export type ProductCategory = string;

export type ProductSortBy = "price_asc" | "price_desc" | "rating" | "newest";

export interface ProductDetail {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discountRate: number;
  description: string;
  imageUrls: string[];
  category: ProductCategory;
  createdAt: string;
  details: Record<string, string>;
  reviews: number;
  questions: number;
}

export interface ProductSummary {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discountRate: number;
  imageUrl: string;
  category: ProductCategory;
  rating: number;
  reviewCount: number;
  isRocketDelivery: boolean;
  seller: string;
  productDetail: ProductDetail;
  description: string;
}
