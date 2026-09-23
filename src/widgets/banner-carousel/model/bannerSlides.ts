export interface BannerSlide {
  id: string;
  title: string;
  image: string;
  href?: string;
}

export const BANNER_SLIDES: BannerSlide[] = [
  {
    id: "banner-1",
    title: "신규 회원 첫 구매 할인",
    image: "https://picsum.photos/seed/banner-1/1200/400",
    href: "/search",
  },
  {
    id: "banner-2",
    title: "로켓와우 무료체험",
    image: "https://picsum.photos/seed/banner-2/1200/400",
    href: "/search",
  },
  {
    id: "banner-3",
    title: "주말 한정 초특가",
    image: "https://picsum.photos/seed/banner-3/1200/400",
    href: "/search",
  },
  {
    id: "banner-4",
    title: "패션 위크 마지막 세일",
    image: "https://picsum.photos/seed/banner-4/1200/400",
    href: "/search",
  },
  {
    id: "banner-5",
    title: "생활가전 특별 기획전",
    image: "https://picsum.photos/seed/banner-5/1200/400",
    href: "/search",
  },
];
