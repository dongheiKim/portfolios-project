import type { AdItem } from "@/shared/model/ad";

export const SELLER_SPECIAL_DEALS: AdItem[] = Array.from(
  { length: 16 },
  (_, index) => {
    const order = index + 1;
    return {
      id: `seller-special-${order}`,
      title: `판매자특가 상품 ${order}`,
      subtitle: "오늘만 특가",
      image: `https://example.com/seller-special-${order}.jpg`,
      href: "/products",
      badge: "특가",
    };
  },
);
