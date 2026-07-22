export type CategoryLevel = 1 | 2 | 3; // 1=대분류, 2=중분류, 3=소분류

export interface Category {
  id: string; // "fashion-female-outer"
  name: string; // "여성 아우터"
  level: CategoryLevel;
  parentId: string | null; // 대분류는 null
}
