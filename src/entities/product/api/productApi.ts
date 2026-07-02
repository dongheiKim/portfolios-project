import type { ProductSummary, ProductDetail } from "../model/productTypes";
// import { Review, Question } from "../model/productTypes";

export async function fetchProductById(id: number): Promise<ProductDetail> {
  const Products: ProductSummary[] = [];
  const Product = Products.find((p) => p.id === id);
  if (Product) {
    return {
      ...Product,
      id: Product.id,
      name: Product.name,
      category: Product.category,
      price: Product.price,
      originalPrice: Product.originalPrice,
      discountRate: Product.discountRate,
      imageUrls: [Product.imageUrl],
      description: Product.description,
      createdAt: new Date().toISOString(),
      details: {
        "제품 설명": Product.description,
      },
      reviews: [] as any,
      questions: [] as any,
    };
  }
  throw new Error(`Product with id ${id} not found`);
}
