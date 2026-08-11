import { useState } from "react";
import { useNavigate } from "react-router";
import { Search, ChevronDown } from "lucide-react";
import { useFilterStore } from "@/features/product/filter-products";

/**
 * 헤더 검색 폼 컴포넌트
 * - 상품 검색 입력 필드 제공
 * - 카테고리 필터 선택 옵션
 */
export function HeaderSearch() {
  const [searchInput, setSearchInput] = useState("");
  const setKeyword = useFilterStore((s) => s.setKeyword);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput);
    navigate("/");
  };

  return (
    <form onSubmit={handleSearch} className="flex-1 max-w-3xl">
      <div className="flex items-center overflow-hidden rounded-sm border-2 border-[#346aff] bg-white shadow-[0_8px_20px_rgba(52,106,255,0.08)]">
        <div className="hidden items-center gap-1 border-r border-[#dbe4ff] px-3 text-sm font-medium text-[#24364d] sm:flex">
          전체 카테고리
          <ChevronDown size={16} />
        </div>
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="찾고 싶은 상품을 검색해 보세요"
          className="flex-1 px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-[#94a0b4]"
          aria-label="상품 검색"
        />
        <button
          type="submit"
          className="h-12 px-4 text-white transition-colors hover:bg-[#1d55ef] bg-[#346aff]"
          aria-label="검색"
        >
          <Search size={20} />
        </button>
      </div>
    </form>
  );
}
