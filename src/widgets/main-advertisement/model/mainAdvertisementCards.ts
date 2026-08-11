import type { AdItem } from "@/shared/model/ad";

export const MAIN_ADVERTISEMENT_CARDS: AdItem[] = Array.from(
  { length: 12 },
  (_, index) => {
    const order = index + 1;
    return {
      id: `main-ad-${order}`,
      title: `메인 광고 ${order}`,
      image: `https://example.com/main-ad-${order}.jpg`,
      href: "/products",
    };
  },
);
