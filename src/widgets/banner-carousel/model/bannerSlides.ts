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
    image: "https://example.com/banner-1.jpg",
    href: "/products",
  },
  {
    id: "banner-2",
    title: "로켓와우 무료체험",
    image: "https://example.com/banner-2.jpg",
    href: "/products",
  },
  {
    id: "banner-3",
    title: "주말 한정 초특가",
    image: "https://example.com/banner-3.jpg",
    href: "/products",
  },
  {
    id: "banner-4",
    title: "패션 위크 마지막 세일",
    image: "https://example.com/banner-4.jpg",
    href: "/products",
  },
  {
    id: "banner-5",
    title: "생활가전 특별 기획전",
    image: "https://example.com/banner-5.jpg",
    href: "/products",
  },
];
