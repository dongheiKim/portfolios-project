import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Heart,
  LogOut,
  MapPin,
  Package,
  Plus,
  Trash2,
  UserRound,
} from "lucide-react";
import { fetchProductById, ProductCard } from "@/entities/product";
import type { Address } from "@/entities/user/model/userTypes";
import { useAuthStore } from "@/features/auth/model/authStore";
import { useCartStore } from "@/features/cart/add-to-cart";
import { useWishlistStore } from "@/features/product/wishlist";
import { Button } from "@/shared/ui/Button";
import { WishlistButton } from "@/features/product/wishlist";

const emptyAddress = (): Address => ({
  id: Date.now(),
  label: "새 배송지",
  recipient: "",
  phone: "",
  zipCode: "",
  address: "",
  addressDetail: "",
  isDefault: false,
});

export function MyPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);
  const wishlistIds = useWishlistStore((state) => state.productIds);
  const wishlistHydrated = useWishlistStore((state) => state.hasHydrated);
  const cartCount = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0),
  );
  const [draft, setDraft] = useState<Address | null>(null);
  const [wishlistProducts, setWishlistProducts] = useState<
    Awaited<ReturnType<typeof fetchProductById>>[]
  >([]);

  useEffect(() => {
    if (!wishlistHydrated) return;

    let cancelled = false;
    Promise.all(wishlistIds.map((id) => fetchProductById(id)))
      .then((products) => {
        if (!cancelled) setWishlistProducts(products);
      })
      .catch(() => {
        if (!cancelled) setWishlistProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, [wishlistIds, wishlistHydrated]);

  if (!user) return null;

  const addresses = user.addresses;
  const updateDraft = (field: keyof Address, value: string) => {
    setDraft((current) => (current ? { ...current, [field]: value } : current));
  };
  const saveAddress = () => {
    if (!draft?.recipient || !draft.phone || !draft.zipCode || !draft.address)
      return;
    const shouldBeDefault = draft.isDefault || addresses.length === 0;
    const nextAddresses = shouldBeDefault
      ? addresses
          .map((address) => ({ ...address, isDefault: false }))
          .concat({ ...draft, isDefault: true })
      : [...addresses, draft];
    setUser({ ...user, addresses: nextAddresses });
    setDraft(null);
  };
  const removeAddress = (id: number) => {
    const remaining = addresses.filter((address) => address.id !== id);
    if (
      remaining.length > 0 &&
      !remaining.some((address) => address.isDefault)
    ) {
      remaining[0] = { ...remaining[0], isDefault: true };
    }
    setUser({ ...user, addresses: remaining });
  };
  const setDefaultAddress = (id: number) => {
    setUser({
      ...user,
      addresses: addresses.map((address) => ({
        ...address,
        isDefault: address.id === id,
      })),
    });
  };

  return (
    <div className="coupang-shell min-h-screen bg-[#f4f7fb]">
      <main id="main-content" className="mx-auto w-full max-w-6xl px-4 py-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#346aff]">
              My Coupang
            </p>
            <h1 className="mt-1 text-3xl font-black text-[#111827]">
              마이페이지
            </h1>
          </div>
          <Link
            to="/orders"
            className="text-sm font-semibold text-[#346aff] hover:underline"
          >
            주문 내역 보기
          </Link>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => {
              logout();
              navigate("/login", { replace: true });
            }}
          >
            <LogOut size={14} /> 로그아웃
          </Button>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[24px] border border-[#e4ebf3] bg-white p-5">
            <UserRound className="text-[#346aff]" size={20} />
            <p className="mt-3 text-sm text-[#64748b]">회원 정보</p>
            <p className="mt-1 font-black text-[#111827]">{user.name}</p>
            <p className="text-sm text-[#64748b]">{user.email}</p>
          </div>
          <Link
            to="/orders"
            className="rounded-[24px] border border-[#e4ebf3] bg-white p-5 hover:border-[#bfd1ff]"
          >
            <Package className="text-[#346aff]" size={20} />
            <p className="mt-3 text-sm text-[#64748b]">주문 내역</p>
            <p className="mt-1 text-2xl font-black text-[#111827]">확인하기</p>
          </Link>
          <Link
            to="/cart"
            className="rounded-[24px] border border-[#e4ebf3] bg-white p-5 hover:border-[#bfd1ff]"
          >
            <Heart className="text-[#e11937]" size={20} />
            <p className="mt-3 text-sm text-[#64748b]">장바구니 상품</p>
            <p className="mt-1 text-2xl font-black text-[#111827]">
              {cartCount}개
            </p>
          </Link>
        </section>

        <section className="mt-5 rounded-[24px] border border-[#e4ebf3] bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-black text-[#111827]">
              <MapPin size={18} /> 배송지 관리
            </h2>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setDraft(emptyAddress())}
            >
              <Plus size={14} /> 배송지 추가
            </Button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="rounded-2xl border border-[#edf2f7] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#111827]">
                      {address.label} · {address.recipient}{" "}
                      {address.isDefault && (
                        <span className="ml-1 text-xs text-[#346aff]">
                          기본
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-sm text-[#64748b]">
                      {address.phone}
                    </p>
                    <p className="text-sm leading-6 text-[#64748b]">
                      ({address.zipCode}) {address.address}{" "}
                      {address.addressDetail}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`${address.label} 배송지 삭제`}
                    onClick={() => removeAddress(address.id)}
                    className="text-[#94a3b8] hover:text-[#e11937]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => setDefaultAddress(address.id)}
                    className="mt-3 text-xs font-semibold text-[#346aff] hover:underline"
                  >
                    기본 배송지로 설정
                  </button>
                )}
              </div>
            ))}
          </div>
          {addresses.length === 0 && (
            <p className="mt-4 text-sm text-[#64748b]">
              등록된 배송지가 없습니다.
            </p>
          )}
        </section>

        {draft && (
          <section className="mt-5 rounded-[24px] border border-[#bfd1ff] bg-white p-5">
            <h2 className="font-black text-[#111827]">배송지 추가</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["label", "배송지 이름"],
                  ["recipient", "받는 사람"],
                  ["phone", "휴대폰"],
                  ["zipCode", "우편번호"],
                  ["address", "주소"],
                  ["addressDetail", "상세 주소"],
                ] as const
              ).map(([field, label]) => (
                <label
                  key={field}
                  className="flex flex-col gap-1 text-xs font-semibold text-[#516074]"
                >
                  <span>{label}</span>
                  <input
                    value={String(draft[field])}
                    onChange={(event) => updateDraft(field, event.target.value)}
                    className="rounded-xl border border-[#e4ebf3] px-3 py-2 text-sm font-normal text-[#111827] outline-none focus:border-[#346aff] focus:ring-4 focus:ring-[#dbe8ff]"
                  />
                </label>
              ))}
              <label className="flex items-center gap-2 text-sm text-[#516074]">
                <input
                  type="checkbox"
                  checked={draft.isDefault}
                  onChange={(event) =>
                    setDraft({ ...draft, isDefault: event.target.checked })
                  }
                />{" "}
                기본 배송지로 설정
              </label>
            </div>
            <div className="mt-4 flex gap-2">
              <Button type="button" size="sm" onClick={saveAddress}>
                저장
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setDraft(null)}
              >
                취소
              </Button>
            </div>
          </section>
        )}

        <section className="mt-5 rounded-[24px] border border-[#e4ebf3] bg-white p-5">
          <h2 className="flex items-center gap-2 font-black text-[#111827]">
            <Heart size={18} className="text-[#e11937]" /> 찜 목록
          </h2>
          {!wishlistHydrated ? (
            <p className="mt-4 text-sm text-[#64748b]">
              찜 목록을 불러오는 중입니다.
            </p>
          ) : wishlistProducts.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {wishlistProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    imageUrl: product.imageUrls[0],
                    rating: 5,
                    reviewCount: product.reviews,
                    isRocketDelivery: true,
                    seller: product.details.판매자 ?? "판매자",
                    productDetail: product,
                  }}
                  wishlistSlot={<WishlistButton productId={product.id} />}
                />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#64748b]">찜한 상품이 없습니다.</p>
          )}
        </section>
      </main>
    </div>
  );
}
