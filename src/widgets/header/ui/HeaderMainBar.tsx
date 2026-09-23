import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { useFilterStore } from "@/features/product/filter-products";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderNav } from "./HeaderNav";
import type { User } from "@/entities/user";
import type { Order } from "@/entities/order";

/**
 * 헤더 메인 바 컴포넌트
 * - 로고, 검색바, 네비게이션, 카테고리 메뉴 버튼 포함
 * - 모바일 메뉴 토글 기능
 */
interface HeaderMainBarProps {
  user: User | null;
  cartCount: number;
  latestViewedProduct: { id: number; name: string; imageUrl: string } | null;
  latestOrder: Order | null;
  mobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
}

export function HeaderMainBar({
  user,
  cartCount,
  latestViewedProduct,
  latestOrder,
  mobileMenuOpen,
  onMobileMenuToggle,
}: HeaderMainBarProps) {
  const keyword = useFilterStore((state) => state.keyword);
  const location = useLocation();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-4">
      <div className="flex min-w-0 items-center gap-3 lg:gap-5">
        <Link
          to="/#category-list"
          className="hidden md:inline-flex h-13 w-13 shrink-0 rounded-sm bg-[#346aff] text-white hover:bg-[#1d55ef] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff] focus-visible:ring-offset-2"
          aria-label="카테고리 메뉴"
        >
          <Menu size={22} />
        </Link>

        <Link to="/" className="flex shrink-0 items-center gap-1.5">
          <span className="text-[2rem] font-black tracking-[-0.06em] text-[#e11937]">
            coupang
          </span>
          <span className="hidden rounded-full bg-[#346aff] px-2 py-1 text-[11px] font-bold text-white sm:inline-flex">
            WOW
          </span>
        </Link>

        <HeaderSearch
          key={`${keyword}:${location.pathname}${location.search}`}
        />

        <HeaderNav
          user={user}
          cartCount={cartCount}
          latestViewedProduct={latestViewedProduct}
          latestOrder={latestOrder}
        />

        <button
          type="button"
          className="ml-auto rounded-sm text-[#24364d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff] focus-visible:ring-offset-2 md:hidden"
          onClick={onMobileMenuToggle}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>
  );
}
