import type { ProductDetail, ProductSummary } from "../model/productTypes";

export const mockProducts: ProductSummary[] = [
  {
    id: 1,
    name: "Sample Product",
    price: 100,
    originalPrice: 120,
    discountRate: 20,
    imageUrl: "https://example.com/product.jpg",
    category: "electronics",
    rating: 4.5,
    reviewCount: 10,
    isRocketDelivery: true,
    seller: "Sample Seller",
    productDetail: {
      id: 1,
      name: "Sample Product",
      price: 100,
      originalPrice: 120,
      discountRate: 20,
      description: "This is a sample product description.",
      imageUrls: ["https://example.com/product.jpg"],
      category: "electronics",
      createdAt: new Date().toISOString(),
      details: {
        "제품 설명": "This is a sample product description.",
      },
      reviews: 10,
      questions: 5,
    },
    description: "This is a sample product description.",
  },
];

export function findMockProductDetailById(id: number): ProductDetail {
  const product = mockProducts.find((item) => item.id === id);

  if (!product) {
    throw new Error(`Product with id ${id} not found`);
  }

  return {
    ...product,
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    originalPrice: product.originalPrice,
    discountRate: product.discountRate,
    imageUrls: [product.imageUrl],
    description: product.description,
    createdAt: new Date().toISOString(),
    details: {
      "제품 설명": product.description,
    },
    reviews: product.productDetail.reviews,
    questions: product.productDetail.questions,
  };
}
