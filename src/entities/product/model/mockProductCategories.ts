export type MockProductCategoryId =
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

export const MOCK_PRODUCT_CATEGORY_ORDER = [
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
  "health",
  "maternity",
  "kidsfashion",
  "kitchen",
  "pet",
  "car",
  "travel",
] as const satisfies readonly MockProductCategoryId[];

export const MOCK_PRODUCT_CATEGORY_LABELS: Record<
  MockProductCategoryId,
  string
> = {
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

export const MOCK_CATEGORY_SLOT_COUNT = 13;
