import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingCart,
  Search,
  Menu,
  X,
  ChevronDown,
  Clock3,
  Gift,
  PackageCheck,
  Eye,
} from "lucide-react";
import { fetchOrders } from "@/entities/order";
import { useCartStore } from "@/features/cart/add-to-cart";
import { useAuthStore } from "@/features/auth/model/authStore";
import { useFilterStore } from "@/features/product/filter-products";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useRecentViewedProducts } from "@/shared/hooks/useRecentViewedProducts";
import { UserBadge } from "@/entities/user";

const QUICK_LINKS = ["로켓배송", "로켓프레시", "쿠팡비즈", "와우회원할인"];
const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "결제 대기",
  paid: "결제 완료",
  preparing: "상품 준비 중",
  shipping: "배송 중",
  delivered: "배송 완료",
  cancelled: "취소됨",
  refunded: "환불 완료",
};

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const cartCount = useCartStore((s) =>
    s.items.reduce((acc, i) => acc + i.quantity, 0),
  );
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const setKeyword = useFilterStore((s) => s.setKeyword);
  const navigate = useNavigate();
  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
      }).format(new Date()),
    [],
  );
  const { data: ordersData } = useQuery({
    queryKey: ["header-orders-preview"],
    queryFn: fetchOrders,
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 3,
  });

  const orderCount = ordersData?.length ?? 0;
  const latestOrder = ordersData?.[0];
  const recentViewedProducts = useRecentViewedProducts();
  const latestViewedProduct = recentViewedProducts[0];
  const latestOrderStatusLabel = latestOrder
    ? (ORDER_STATUS_LABEL[latestOrder.status] ?? "주문 확인")
    : "주문 확인";

  useDebounce(searchInput, 400);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKeyword(searchInput);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#d9dee5] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.06)]">
      <div className="border-b border-[#eef2f6] bg-[#f9fbff]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 py-2 text-xs text-[#59657a]">
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1 font-medium text-[#1f2a37]">
              <Clock3 size={14} className="text-[#346aff]" />
              오늘의 배송 혜택 {todayLabel}
            </span>
            <span>와우회원 전용 특가 최대 62%</span>
          </div>
          <div className="flex items-center gap-3 sm:ml-auto">
            <Link to="/orders" className="hover:text-[#346aff]">
              {token ? `주문 ${orderCount}건` : "주문목록"}
            </Link>
            <Link
              to={token ? "/cart" : "/signup"}
              className="hover:text-[#346aff]"
            >
              {token ? "바로 결제" : "와우회원 가입"}
            </Link>
          </div>
        </div>
      </div>

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
            {token && (
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

          <button
            type="button"
            className="ml-auto text-[#24364d] md:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className="mt-3 hidden items-center justify-between gap-4 border-t border-[#eef2f6] pt-3 md:flex">
          <div className="flex items-center gap-5 overflow-x-auto text-sm font-medium text-[#2f3d52]">
            {QUICK_LINKS.map((link) => (
              <button
                key={link}
                type="button"
                className="whitespace-nowrap transition-colors hover:text-[#346aff]"
              >
                {link}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {token && latestOrder && (
              <Link
                to="/orders"
                className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-medium text-[#2d5bdb] transition-colors hover:bg-[#dfe9ff]"
              >
                <PackageCheck size={14} />
                최근 주문 {latestOrderStatusLabel}
              </Link>
            )}
            <div className="flex items-center gap-2 rounded-full bg-[#fff7e8] px-3 py-1 text-xs font-medium text-[#7b5b15]">
              <Gift size={14} className="text-[#ff9900]" />
              {token
                ? "와우회원 무료배송 혜택 적용 중"
                : "오늘만 로켓특가 무료배송"}
            </div>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[#eef2f6] bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <UserBadge user={user} />
            <div className="grid grid-cols-2 gap-2 text-sm text-[#334155]">
              {QUICK_LINKS.map((link) => (
                <button
                  key={link}
                  type="button"
                  className="justify-start rounded-lg border border-[#e5ebf5] px-3 py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link}
                </button>
              ))}
            </div>
            {latestViewedProduct && (
              <Link
                to={`/products/${latestViewedProduct.id}`}
                className="flex items-center gap-3 rounded-lg border border-[#e5ebf5] bg-[#fbfcfe] px-3 py-3 text-sm text-[#24364d]"
                onClick={() => setMobileMenuOpen(false)}
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
                onClick={() => setMobileMenuOpen(false)}
              >
                최근 주문{" "}
                {latestOrder
                  ? `#${latestOrder.id} · ${latestOrderStatusLabel}`
                  : `${orderCount}건`}
              </Link>
            )}
          </div>
          <Link
            to="/cart"
            className="mt-3 flex items-center gap-2 rounded-lg bg-[#f8fbff] px-3 py-3 text-sm text-[#24364d]"
            onClick={() => setMobileMenuOpen(false)}
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
      )}
    </header>
  );
}
