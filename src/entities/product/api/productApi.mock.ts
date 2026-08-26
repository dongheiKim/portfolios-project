import type { ProductDetail, ProductSummary } from "../model/productTypes";

export const mockProducts: ProductSummary[] = [
  {
    id: 1,
    name: "Sample Product",
    price: 100,
    originalPrice: 120,
    discountRate: 17,
    imageUrl: "https://picsum.photos/seed/product1/800/800",
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
      discountRate: 17,
      description: "This is a sample product description.",
      imageUrls: [
        "https://picsum.photos/seed/product1/800/800",
        "https://picsum.photos/seed/product1-2/800/800",
        "https://picsum.photos/seed/product1-3/800/800",
      ],
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
  {
    id: 2,
    name: "Sample Fashion Item",
    price: 29900,
    originalPrice: 49900,
    discountRate: 40,
    imageUrl: "https://picsum.photos/seed/product2/800/800",
    category: "femalefashion",
    rating: 4.2,
    reviewCount: 35,
    isRocketDelivery: false,
    seller: "Fashion Store",
    productDetail: {
      id: 2,
      name: "Sample Fashion Item",
      price: 29900,
      originalPrice: 49900,
      discountRate: 40,
      description: "A stylish fashion item for everyday wear.",
      imageUrls: [
        "https://picsum.photos/seed/product2/800/800",
        "https://picsum.photos/seed/product2-2/800/800",
      ],
      category: "femalefashion",
      createdAt: new Date().toISOString(),
      details: {
        "제품 설명": "A stylish fashion item for everyday wear.",
      },
      reviews: 35,
      questions: 3,
    },
    description: "A stylish fashion item for everyday wear.",
  },
  {
    id: 3,
    name: "Sample Food Product",
    price: 8900,
    originalPrice: 9900,
    discountRate: 10,
    imageUrl: "https://picsum.photos/seed/product3/800/800",
    category: "food",
    rating: 4.8,
    reviewCount: 120,
    isRocketDelivery: true,
    seller: "Fresh Market",
    productDetail: {
      id: 3,
      name: "Sample Food Product",
      price: 8900,
      originalPrice: 9900,
      discountRate: 10,
      description: "Fresh and delicious food product.",
      imageUrls: [
        "https://picsum.photos/seed/product3/800/800",
        "https://picsum.photos/seed/product3-2/800/800",
      ],
      category: "food",
      createdAt: new Date().toISOString(),
      details: {
        "제품 설명": "Fresh and delicious food product.",
      },
      reviews: 120,
      questions: 8,
    },
    description: "Fresh and delicious food product.",
  },
];

export function findMockProductDetailById(id: number): ProductDetail {
  const product = mockProducts.find((item) => item.id === id);

  if (!product) {
    throw new Error(`Product with id ${id} not found`);
  }

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    discountRate: product.discountRate,
    imageUrls: [product.imageUrl],
    category: product.category,
    createdAt: new Date().toISOString(),
    details: {
      "제품 설명": product.description,
    },
    reviews: product.productDetail.reviews,
    questions: product.productDetail.questions,
    description: product.description,
  };
}
