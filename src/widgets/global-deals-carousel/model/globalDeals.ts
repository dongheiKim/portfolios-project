import type { AdItem } from "@/shared/model/ad";

export const GLOBAL_DEALS: AdItem[] = Array.from({ length: 16 }, (_, index) => {
  const order = index + 1;
  return {
    id: `global-deal-${order}`,
    title: `글로벌 핫딜 상품 ${order}`,
    subtitle: "로켓직구",
    image: `https://picsum.photos/seed/global-deal-${order}/400/400`,
    href: "/search",
    badge: "직구",
  };
});
