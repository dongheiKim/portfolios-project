import { Link } from "react-router";
import { Menu } from "lucide-react";
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
  onMobileMenuToggle: () => void;
}

export function HeaderMainBar({
  user,
  cartCount,
  latestViewedProduct,
  latestOrder,
  onMobileMenuToggle,
}: HeaderMainBarProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center gap-3 lg:gap-5">
        <button
          type="button"
          className="hidden md:inline-flex h-13 w-13 shrink-0 rounded-sm bg-[#346aff] text-white hover:bg-[#1d55ef]"
          aria-label="카테고리 메뉴"
        >
          <Menu size={22} />
        </button>

        <Link to="/" className="flex shrink-0 items-center gap-1.5">
          <span className="text-[2rem] font-black tracking-[-0.06em] text-[#e11937]">
            coupang
          </span>
          <span className="hidden rounded-full bg-[#346aff] px-2 py-1 text-[11px] font-bold text-white sm:inline-flex">
            WOW
          </span>
        </Link>

        <HeaderSearch />

        <HeaderNav
          user={user}
          cartCount={cartCount}
          latestViewedProduct={latestViewedProduct}
          latestOrder={latestOrder}
        />

        <button
          type="button"
          className="ml-auto text-[#24364d] md:hidden"
          onClick={onMobileMenuToggle}
          aria-label="메뉴 열기"
        >
          <Menu size={24} />
        </button>
      </div>
    </div>
  );
}
