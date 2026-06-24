export type ProductCategory =
  | "electronics"
  | "fashion"
  | "food"
  | "beauty"
  | "sports"
  | "home"
  | "books"
  | "toys"
  | "etc";

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
  Productdetail: string;
  description: string;
}

export interface Review {
  id: number;
  productId: number;
  rating: number;
  comment: string;
  reviewer: string;
  date: string;
}

export interface Question {
  id: number;
  productId: number;
  question: string;
  answer?: string;
  asker: string;
  date: string;
}

export interface Answer {
  id: number;
  questionId: number;
  answer: string;
  responder: string;
  date: string;
}
