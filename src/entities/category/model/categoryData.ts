import type { Category } from "./categoryTypes";

// 대/중/소분류가 늘어날 때 여기에만 추가 (나중에 API로 교체 가능)
export const CATEGORIES: Category[] = [
  { id: "fashion", name: "패션", level: 1, parentId: null },
  { id: "fashion-female", name: "여성패션", level: 2, parentId: "fashion" },
  { id: "fashion-male", name: "남성패션", level: 2, parentId: "fashion" },

  { id: "food", name: "식품", level: 1, parentId: null },

  // ... 앞으로 대/중/소분류가 계속 추가되는 곳
];

export function getCategoryChildren(parentId: string | null): Category[] {
  return CATEGORIES.filter((c) => c.parentId === parentId);
}

export function getCategoryPath(categoryId: string): Category[] {
  const path: Category[] = [];
  let current = CATEGORIES.find((c) => c.id === categoryId);
  while (current) {
    path.unshift(current);
    current = current.parentId
      ? CATEGORIES.find((c) => c.id === current!.parentId)
      : undefined;
  }
  return path; // 예: [패션, 여성패션, 여성 아우터]
}
