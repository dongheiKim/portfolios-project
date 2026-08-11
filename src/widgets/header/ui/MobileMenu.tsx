import { Link } from "react-router";
import { ShoppingCart, Eye } from "lucide-react";
import { UserBadge } from "@/entities/user";
import { QUICK_LINKS } from "../lib/header.constants";
import type { User } from "@/entities/user";
import type { Order } from "@/entities/order";

/**
 * 모바일 메뉴 컴포넌트 (md 이하)
 * - 사용자 정보, 빠른 링크, 최근 본 상품, 장바구니 등 표시
 * - 토글 상태에 따라 표시/숨김
 */
interface MobileMenuProps {
  isOpen: boolean;
  user: User | null;
  token: string | null;
  cartCount: number;
  latestViewedProduct: { id: number; name: string; imageUrl: string } | null;
  latestOrder: Order | null;
  latestOrderStatusLabel: string;
  onClose: () => void;
}

export function MobileMenu({
  isOpen,
  user,
  token,
  cartCount,
  latestViewedProduct,
  latestOrder,
  latestOrderStatusLabel,
  onClose,
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="border-t border-[#eef2f6] bg-white px-4 py-4 md:hidden">
      <div className="flex flex-col gap-3">
        <UserBadge user={user} />
        <div className="grid grid-cols-2 gap-2 text-sm text-[#334155]">
          {QUICK_LINKS.map((link) => (
            <button
              key={link}
              type="button"
              className="justify-start rounded-lg border border-[#e5ebf5] px-3 py-2"
              onClick={onClose}
            >
              {link}
            </button>
          ))}
        </div>
        {latestViewedProduct && (
          <Link
            to={`/products/${latestViewedProduct.id}`}
            className="flex items-center gap-3 rounded-lg border border-[#e5ebf5] bg-[#fbfcfe] px-3 py-3 text-sm text-[#24364d]"
            onClick={onClose}
          >
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white">
              <img
                src={latestViewedProduct.imageUrl}
                alt={latestViewedProduct.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#64748b]">최근 본 상품</p>
              <p className="truncate font-medium text-[#111827]">
                {latestViewedProduct.name}
              </p>
            </div>
          </Link>
        )}
        {token && (
          <Link
            to="/orders"
            className="rounded-lg border border-[#e5ebf5] bg-[#fbfcfe] px-3 py-3 text-sm text-[#24364d]"
            onClick={onClose}
          >
            최근 주문{" "}
            {latestOrder
              ? `#${latestOrder.id} · ${latestOrderStatusLabel}`
              : "0건"}
          </Link>
        )}
      </div>
      <Link
        to="/cart"
        className="mt-3 flex items-center gap-2 rounded-lg bg-[#f8fbff] px-3 py-3 text-sm text-[#24364d]"
        onClick={onClose}
      >
        <ShoppingCart size={18} />
        장바구니
        {cartCount > 0 && (
          <span className="rounded-full bg-[#e11937] px-1.5 text-xs font-bold text-white">
            {cartCount}
          </span>
        )}
      </Link>
      {!latestViewedProduct && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-[#fff7e8] px-3 py-3 text-sm text-[#7b5b15]">
          <Eye size={16} className="text-[#ff9900]" />
          상품을 둘러보면 최근 본 상품이 여기에 표시됩니다.
        </div>
      )}
    </div>
  );
}
