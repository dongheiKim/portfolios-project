import { Link } from "react-router";
import { ShoppingCart, PackageCheck } from "lucide-react";
import { UserBadge } from "@/entities/user";
import type { User } from "@/entities/user";
import type { Order } from "@/entities/order";

/**
 * 헤더 데스크탑 네비게이션 컴포넌트 (lg 이상)
 * - 최근 본 상품, 최근 주문, 사용자 정보 표시
 * - 장바구니 아이콘 및 개수 표시
 */
interface HeaderNavProps {
  user: User | null;
  cartCount: number;
  latestViewedProduct: { id: number; name: string; imageUrl: string } | null;
  latestOrder: Order | null;
}

export function HeaderNav({
  user,
  cartCount,
  latestViewedProduct,
  latestOrder,
}: HeaderNavProps) {
  return (
    <nav
      className="hidden lg:flex items-center gap-5 text-sm text-[#334155]"
      aria-label="사용자 메뉴"
    >
      {latestViewedProduct && (
        <Link
          to={`/products/${latestViewedProduct.id}`}
          className="hidden xl:flex items-center gap-3 rounded-2xl border border-[#e5ebf5] bg-[#fbfcfe] px-3 py-2 text-[#334155] transition-colors hover:border-[#bfd1ff] hover:text-[#346aff]"
        >
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white">
            <img
              src={latestViewedProduct.imageUrl}
              alt={latestViewedProduct.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0 max-w-28 leading-tight">
            <p className="text-[11px] text-[#64748b]">최근 본 상품</p>
            <p className="truncate font-semibold text-[#111827]">
              {latestViewedProduct.name}
            </p>
          </div>
        </Link>
      )}
      {latestOrder && (
        <Link
          to="/orders"
          className="hidden xl:flex items-center gap-2 rounded-2xl border border-[#e5ebf5] bg-white px-3 py-2 text-[#334155] transition-colors hover:border-[#bfd1ff] hover:text-[#346aff]"
        >
          <PackageCheck size={18} />
          <div className="leading-tight">
            <p className="text-[11px] text-[#64748b]">최근 주문</p>
            <p className="font-semibold text-[#111827]">
              {latestOrder ? `#${latestOrder.id}` : "내역 보기"}
            </p>
          </div>
        </Link>
      )}
      <div className="rounded-2xl border border-[#e5ebf5] bg-[#f8fbff] px-3 py-2">
        <UserBadge user={user} />
      </div>
      <Link
        to="/cart"
        className="relative flex items-center gap-2 text-[#24364d] transition-colors hover:text-[#346aff]"
        aria-label={`장바구니 ${cartCount > 0 ? `${cartCount}개 담김` : "비어 있음"}`}
      >
        <ShoppingCart size={22} aria-hidden="true" />
        <span aria-live="polite" aria-atomic="true" className="sr-only">
          장바구니 {cartCount}개
        </span>
        {cartCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute -top-2 left-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e11937] px-1 text-[11px] font-bold text-white"
          >
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
        <span className="font-medium">장바구니</span>
      </Link>
    </nav>
  );
}
