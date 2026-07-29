import { useState } from "react";
import { X } from "lucide-react";
import { useCartStore } from "@/features/cart/add-to-cart";
import { useAuthStore } from "@/features/auth/model/authStore";
import { useRecentViewedProducts } from "@/shared/hooks/useRecentViewedProducts";
import { HeaderTopBar } from "./HeaderTopBar";
import { HeaderMainBar } from "./HeaderMainBar";
import { HeaderQuickActions } from "./HeaderQuickActions";
import { MobileMenu } from "./MobileMenu";
import { useHeaderOrders } from "../model/useHeaderOrders";

/**
 * 헤더 루트 컴포넌트
 * - 모든 헤더 서브 컴포넌트를 조합하여 전체 헤더 구성
 * - 모바일 메뉴 상태 관리
 * - 사용자 정보, 주문 데이터, 장바구니 데이터 통합
 */
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.quantity, 0),
  );
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const recentViewedProducts = useRecentViewedProducts();
  const latestViewedProduct = recentViewedProducts[0];

  const { orderCount, latestOrder, latestOrderStatusLabel } = useHeaderOrders();

  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 border-b border-[#d9dee5] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.06)]"
    >
      <HeaderTopBar token={token} orderCount={orderCount} />

      <HeaderMainBar
        user={user}
        cartCount={cartCount}
        latestViewedProduct={latestViewedProduct}
        latestOrder={latestOrder}
        onMobileMenuToggle={() => setMobileMenuOpen((v) => !v)}
      />

      {mobileMenuOpen && (
        <div className="absolute right-4 top-4 md:hidden">
          <button
            type="button"
            className="text-[#24364d]"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="메뉴 닫기"
          >
            <X size={24} />
          </button>
        </div>
      )}

      <HeaderQuickActions
        token={token}
        latestOrder={latestOrder}
        latestOrderStatusLabel={latestOrderStatusLabel}
      />

      <MobileMenu
        isOpen={mobileMenuOpen}
        user={user}
        token={token}
        cartCount={cartCount}
        latestViewedProduct={latestViewedProduct}
        latestOrder={latestOrder}
        latestOrderStatusLabel={latestOrderStatusLabel}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
