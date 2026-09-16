import type { Review } from "../model/reviewTypes";

const REVIEW_AUTHORS = [
  "구매자1234",
  "coupang***",
  "만족고객",
  "리얼후기",
  "베스트리뷰어",
  "단골손님",
];

const REVIEW_TEMPLATES = [
  "생각보다 품질이 좋아서 만족스럽습니다.",
  "배송이 빨라서 좋았어요. 재구매 의사 있습니다.",
  "가격 대비 훌륭한 제품이에요.",
  "포장 상태가 꼼꼼해서 안심하고 받았습니다.",
  "설명과 실제 제품이 일치해서 좋았습니다.",
  "선물용으로 구매했는데 반응이 좋았어요.",
];

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function generateMockReviews(productId: number, count = 5): Review[] {
  return Array.from({ length: count }, (_, index) => {
    const seed = productId * 31 + index;

    return {
      id: `${productId}-${index + 1}`,
      productId,
      author: REVIEW_AUTHORS[seed % REVIEW_AUTHORS.length],
      rating: seed % 5 === 0 ? 4 : 5,
      content: REVIEW_TEMPLATES[seed % REVIEW_TEMPLATES.length],
      createdAt: new Date(Date.now() - seed * DAY_IN_MS).toISOString(),
    };
  });
}
