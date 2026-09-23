import type { AdItem } from "@/shared/model/ad";

export const SELLER_SPECIAL_DEALS: AdItem[] = Array.from(
  { length: 16 },
  (_, index) => {
    const order = index + 1;
    return {
      id: `seller-special-${order}`,
      title: `판매자특가 상품 ${order}`,
      subtitle: "오늘만 특가",
      image: `https://picsum.photos/seed/seller-special-${order}/400/400`,
      href: "/search",
      badge: "특가",
    };
  },
);
