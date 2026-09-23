export interface HeroSlide {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  href?: string;
}

export const MAIN_CAROUSEL_SLIDES: HeroSlide[] = [
  {
    id: "hero-1",
    title: "여름 신상품 특별전",
    subtitle: "최대 50% 할인, 오늘만 이 가격",
    image: "https://picsum.photos/seed/hero-banner-1/1600/600",
    href: "/search",
  },
  {
    id: "hero-2",
    title: "로켓직구 글로벌 위크",
    subtitle: "해외 인기 상품 관부가세 포함가",
    image: "https://picsum.photos/seed/hero-banner-2/1600/600",
    href: "/search",
  },
  {
    id: "hero-3",
    title: "판매자특가 라이브",
    subtitle: "매일 새로운 딜이 열립니다",
    image: "https://picsum.photos/seed/hero-banner-3/1600/600",
    href: "/search",
  },
  {
    id: "hero-4",
    title: "생활가전 대전",
    subtitle: "인기 브랜드 가전 한자리에",
    image: "https://picsum.photos/seed/hero-banner-4/1600/600",
    href: "/search",
  },
  {
    id: "hero-5",
    title: "패션 위크 특가",
    subtitle: "시즌 오프 최대 70%",
    image: "https://picsum.photos/seed/hero-banner-5/1600/600",
    href: "/search",
  },
];
