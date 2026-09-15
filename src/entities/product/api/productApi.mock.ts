import type { ProductDetail, ProductSummary } from "../model/productTypes";

interface MockProductSeed {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  rating: number;
  reviewCount: number;
  isRocketDelivery: boolean;
  seller: string;
  description: string;
}

const productSeeds: MockProductSeed[] = [
  {
    id: 1,
    name: "무선 블루투스 이어폰",
    price: 39900,
    originalPrice: 59900,
    category: "electronics",
    rating: 4.5,
    reviewCount: 1240,
    isRocketDelivery: true,
    seller: "테크마켓",
    description: "고음질 노이즈 캔슬링을 지원하는 무선 이어폰입니다.",
  },
  {
    id: 2,
    name: "여성 오버핏 니트 가디건",
    price: 29900,
    originalPrice: 49900,
    category: "femalefashion",
    rating: 4.2,
    reviewCount: 358,
    isRocketDelivery: false,
    seller: "패션스토어",
    description: "부드러운 촉감의 오버핏 니트 가디건입니다.",
  },
  {
    id: 3,
    name: "제주 감귤 5kg",
    price: 18900,
    originalPrice: 22900,
    category: "food",
    rating: 4.8,
    reviewCount: 2140,
    isRocketDelivery: true,
    seller: "프레시마켓",
    description: "당도 높은 제주산 감귤을 산지에서 직송합니다.",
  },
  {
    id: 4,
    name: "남성 슬림핏 청바지",
    price: 34900,
    originalPrice: 45900,
    category: "malefashion",
    rating: 4.3,
    reviewCount: 512,
    isRocketDelivery: true,
    seller: "데일리웨어",
    description: "활동성이 좋은 스트레치 원단의 슬림핏 청바지입니다.",
  },
  {
    id: 5,
    name: "수분 진정 크림",
    price: 22900,
    originalPrice: 32900,
    category: "beauty",
    rating: 4.6,
    reviewCount: 987,
    isRocketDelivery: true,
    seller: "뷰티랩",
    description: "민감한 피부를 위한 저자극 수분 진정 크림입니다.",
  },
  {
    id: 6,
    name: "요가 매트 (10mm)",
    price: 25900,
    originalPrice: 35900,
    category: "sports",
    rating: 4.4,
    reviewCount: 621,
    isRocketDelivery: false,
    seller: "스포츠존",
    description: "미끄럼 방지 처리된 두꺼운 요가 매트입니다.",
  },
  {
    id: 7,
    name: "접이식 원목 좌식 테이블",
    price: 59900,
    originalPrice: 79900,
    category: "home",
    rating: 4.5,
    reviewCount: 340,
    isRocketDelivery: true,
    seller: "리빙하우스",
    description: "공간 활용이 좋은 접이식 원목 좌식 테이블입니다.",
  },
  {
    id: 8,
    name: "베스트셀러 자기계발 도서",
    price: 15800,
    originalPrice: 17000,
    category: "books",
    rating: 4.7,
    reviewCount: 1523,
    isRocketDelivery: true,
    seller: "북스토어",
    description: "많은 독자들의 사랑을 받은 자기계발 베스트셀러입니다.",
  },
  {
    id: 9,
    name: "조립식 블록 장난감",
    price: 28900,
    originalPrice: 39900,
    category: "toys",
    rating: 4.6,
    reviewCount: 764,
    isRocketDelivery: true,
    seller: "토이킹덤",
    description: "창의력을 키워주는 조립식 블록 장난감 세트입니다.",
  },
  {
    id: 10,
    name: "무선 마우스 & 키보드 세트",
    price: 32900,
    originalPrice: 42900,
    category: "office",
    rating: 4.3,
    reviewCount: 456,
    isRocketDelivery: true,
    seller: "오피스플러스",
    description: "사무 생산성을 높여주는 무선 마우스 키보드 세트입니다.",
  },
  {
    id: 11,
    name: "화장지 30롤",
    price: 16900,
    originalPrice: 21900,
    category: "daily",
    rating: 4.5,
    reviewCount: 1890,
    isRocketDelivery: true,
    seller: "생활마트",
    description: "부드럽고 오래가는 3겹 화장지 30롤입니다.",
  },
  {
    id: 12,
    name: "저당 프로틴 바 12개입",
    price: 24900,
    originalPrice: 29900,
    category: "health",
    rating: 4.4,
    reviewCount: 678,
    isRocketDelivery: true,
    seller: "헬스푸드",
    description: "운동 후 간편하게 즐기는 저당 프로틴 바입니다.",
  },
  {
    id: 13,
    name: "신생아 속싸개 세트",
    price: 27900,
    originalPrice: 36900,
    category: "maternity",
    rating: 4.7,
    reviewCount: 289,
    isRocketDelivery: true,
    seller: "베이비케어",
    description: "신생아 피부에 순한 순면 속싸개 세트입니다.",
  },
  {
    id: 14,
    name: "아동 후드 집업",
    price: 19900,
    originalPrice: 27900,
    category: "kidsfashion",
    rating: 4.5,
    reviewCount: 412,
    isRocketDelivery: false,
    seller: "리틀스타일",
    description: "활동하기 편한 아동용 후드 집업입니다.",
  },
  {
    id: 15,
    name: "스테인리스 프라이팬 세트",
    price: 45900,
    originalPrice: 65900,
    category: "kitchen",
    rating: 4.6,
    reviewCount: 833,
    isRocketDelivery: true,
    seller: "쿠킹하우스",
    description: "눌어붙지 않는 스테인리스 프라이팬 3종 세트입니다.",
  },
  {
    id: 16,
    name: "강아지 급수기",
    price: 21900,
    originalPrice: 29900,
    category: "pet",
    rating: 4.5,
    reviewCount: 567,
    isRocketDelivery: true,
    seller: "펫프렌즈",
    description: "정수 필터가 내장된 자동 순환 강아지 급수기입니다.",
  },
  {
    id: 17,
    name: "차량용 무선 충전 거치대",
    price: 26900,
    originalPrice: 35900,
    category: "car",
    rating: 4.3,
    reviewCount: 391,
    isRocketDelivery: true,
    seller: "오토기어",
    description: "안정적인 거치가 가능한 차량용 무선 충전 거치대입니다.",
  },
  {
    id: 18,
    name: "휴대용 캐리어 20인치",
    price: 69900,
    originalPrice: 99900,
    category: "travel",
    rating: 4.6,
    reviewCount: 274,
    isRocketDelivery: false,
    seller: "트래블메이트",
    description: "기내 반입이 가능한 경량 휴대용 캐리어입니다.",
  },
];

function buildProductDetail(seed: MockProductSeed, id: number): ProductDetail {
  const discountRate = seed.originalPrice
    ? Math.round(((seed.originalPrice - seed.price) / seed.originalPrice) * 100)
    : 0;

  return {
    id,
    name: seed.name,
    price: seed.price,
    originalPrice: seed.originalPrice,
    discountRate,
    description: seed.description,
    imageUrls: [
      `https://picsum.photos/seed/product${seed.id}/800/800`,
      `https://picsum.photos/seed/product${seed.id}-2/800/800`,
      `https://picsum.photos/seed/product${seed.id}-3/800/800`,
    ],
    category: seed.category,
    createdAt: new Date().toISOString(),
    details: {
      "제품 설명": seed.description,
      판매자: seed.seller,
    },
    reviews: seed.reviewCount,
    questions: Math.max(1, Math.round(seed.reviewCount / 15)),
  };
}

function buildProductSummary(seed: MockProductSeed): ProductSummary {
  const detail = buildProductDetail(seed, seed.id);

  return {
    id: seed.id,
    name: seed.name,
    price: seed.price,
    originalPrice: seed.originalPrice,
    discountRate: detail.discountRate,
    imageUrl: detail.imageUrls[0],
    category: seed.category,
    rating: seed.rating,
    reviewCount: seed.reviewCount,
    isRocketDelivery: seed.isRocketDelivery,
    seller: seed.seller,
    productDetail: detail,
    description: seed.description,
  };
}

export const mockProducts: ProductSummary[] =
  productSeeds.map(buildProductSummary);

export function findMockProductDetailById(id: number): ProductDetail {
  const exact = mockProducts.find((item) => item.id === id);
  if (exact) return exact.productDetail;

  // 홈 카테고리 위젯이 생성하는 합성 ID(실제 카탈로그 범위 밖의 숫자)는
  // 대표 상품으로 대체 조회해 상세 페이지 진입이 끊기지 않도록 한다.
  const isSyntheticId = Number.isInteger(id) && id > mockProducts.length;
  if (!isSyntheticId || mockProducts.length === 0) {
    throw new Error(`Product with id ${id} not found`);
  }

  const fallback = mockProducts[id % mockProducts.length];
  return { ...fallback.productDetail, id };
}
