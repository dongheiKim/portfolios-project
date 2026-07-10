import { RotateCcw } from "lucide-react";
import { useFilterStore } from "../model/filterStore";
import type { ProductCategory } from "@/entities/product";

const CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: "electronics", label: "전자제품" },
  { value: "fashion", label: "패션" },
  { value: "food", label: "식품" },
  { value: "beauty", label: "뷰티" },
  { value: "sports", label: "스포츠" },
  { value: "home", label: "홈/리빙" },
  { value: "books", label: "도서" },
  { value: "toys", label: "완구" },
  { value: "etc", label: "기타" },
];

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "newest", label: "최신순" },
  { value: "rating", label: "평점 높은순" },
  { value: "price_asc", label: "가격 낮은순" },
  { value: "price_desc", label: "가격 높은순" },
];

export function FilterPanel() {
  const { category, sortBy, setCategory, setSortBy, resetFilters } =
    useFilterStore();

  return (
    <aside
      aria-label="상품 필터"
      className="mt-5 rounded-[24px] border border-[#e4ebf3] bg-white px-4 py-4 shadow-[0_14px_35px_rgba(15,23,42,0.05)]"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#346aff]">
            Filter Shelf
          </p>
          <h2 className="mt-1 text-lg font-black text-[#111827]">
            원하는 조건만 빠르게 보기
          </h2>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-1 rounded-full border border-[#d8e0ec] px-3 py-2 text-xs font-medium text-[#607086] transition-colors hover:border-[#346aff] hover:text-[#346aff]"
          aria-label="필터 초기화"
        >
          <RotateCcw size={13} aria-hidden="true" />
          초기화
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setCategory(null)}
          aria-pressed={category === null}
          className={`flex-shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            category === null
              ? "border-[#346aff] bg-[#346aff] text-white"
              : "border-[#d8e0ec] bg-[#f8fbff] text-[#516074] hover:border-[#346aff] hover:text-[#346aff]"
          }`}
        >
          전체
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setCategory(cat.value)}
            aria-pressed={category === cat.value}
            className={`flex-shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              category === cat.value
                ? "border-[#346aff] bg-[#346aff] text-white"
                : "border-[#d8e0ec] bg-[#f8fbff] text-[#516074] hover:border-[#346aff] hover:text-[#346aff]"
            }`}
          >
            {cat.label}
          </button>
        ))}

        <div className="ml-auto flex flex-shrink-0 items-center gap-2 pl-2">
          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(e.target.value as Parameters<typeof setSortBy>[0])
            }
            className="rounded-full border border-[#d8e0ec] bg-white px-3 py-2 text-sm text-[#24364d] outline-none focus:border-[#346aff]"
            aria-label="정렬 방식"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </aside>
  );
}
