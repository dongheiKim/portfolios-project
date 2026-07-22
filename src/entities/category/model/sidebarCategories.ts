// 이 파일은 entities/category(성장하는 분류 체계)와 완전히 독립적입니다.
// 사이드바 노출 목록은 여기서만 관리하며, 분류 체계가 커져도 변경되지 않습니다.

export type SidebarCategoryId =
  | "femalefashion"
  | "malefashion"
  | "food"
  | "beauty"
  | "sports"
  | "home"
  | "electronics"
  | "books"
  | "toys"
  | "office"
  | "daily"
  | "health"
  | "maternity"
  | "kidsfashion"
  | "kitchen"
  | "pet"
  | "car"
  | "travel";

export const SIDEBAR_CATEGORY_LABELS: Record<SidebarCategoryId, string> = {
  femalefashion: "여성패션",
  malefashion: "남성패션",
  food: "식품",
  home: "가구/홈인테리어",
  electronics: "가전/디지털",
  office: "문구/오피스",
  daily: "생활용품",
  beauty: "뷰티",
  sports: "스포츠/레저",
  health: "헬스/건강식품",
  maternity: "출산/유아동",
  kidsfashion: "유아동패션",
  kitchen: "주방용품",
  pet: "반려동물용품",
  toys: "완구/취미",
  car: "자동차용품",
  books: "도서/CD/DVD",
  travel: "여행",
};

// 사이드바에 노출되는 순서 (고정)
export const SIDEBAR_CATEGORY_ORDER: SidebarCategoryId[] = [
  "femalefashion",
  "malefashion",
  "food",
  "beauty",
  "sports",
  "home",
  "electronics",
  "books",
  "toys",
  "office",
  "daily",
  "maternity",
  "kidsfashion",
  "kitchen",
  "pet",
  "car",
  "travel",
];
