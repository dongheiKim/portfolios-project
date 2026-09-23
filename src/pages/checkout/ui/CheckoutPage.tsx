import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, CreditCard, MapPin } from "lucide-react";
import {
  createOrder,
  type CreateOrderPayload,
  type ShippingAddress,
} from "@/entities/order";
import { fetchProductById } from "@/entities/product";
import { useAuthStore } from "@/features/auth/model/authStore";
import { useCartStore } from "@/features/cart/add-to-cart";
import { createInitialShippingAddress } from "@/pages/checkout/model/checkoutAddress";
import { formatPrice } from "@/shared/lib/format";
import { Button } from "@/shared/ui/Button";
import { OptimizedImage } from "@/shared/ui/OptimizedImage";
import { SectionSkeleton } from "@/shared/ui/Skeleton";

type PaymentMethod = CreateOrderPayload["paymentMethod"];

const paymentOptions: { value: PaymentMethod; label: string }[] = [
  { value: "card", label: "신용/체크카드" },
  { value: "account", label: "무통장입금" },
  { value: "phone", label: "휴대폰 결제" },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const items = useCartStore((s) => s.items);
  const hasCartHydrated = useCartStore((s) => s.hasHydrated);
  const clearCart = useCartStore((s) => s.clearCart);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(() =>
    createInitialShippingAddress(user),
  );

  const productIds = items.map((item) => item.productId);
  const {
    data: products,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["checkout-products", productIds],
    queryFn: () => Promise.all(productIds.map((id) => fetchProductById(id))),
    enabled: productIds.length > 0,
  });

  const rows = items
    .map((item) => {
      const product = products?.find(
        (candidate) => candidate.id === item.productId,
      );
      return product ? { ...item, product } : null;
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);
  const totalPrice = rows.reduce(
    (sum, row) => sum + row.product.price * row.quantity,
    0,
  );
  const handleSubmit = async () => {
    if (
      !shippingAddress.recipient ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.zipcode ||
      rows.length === 0
    ) {
      setErrorMessage("배송지와 주문 상품을 확인해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const order = await createOrder({
        items: rows.map((row) => ({
          productId: row.product.id,
          quantity: row.quantity,
          productImage: row.product.imageUrls[0] ?? "",
          productName: row.product.name,
          price: row.product.price,
        })),
        shippingAddress,
        paymentMethod,
      });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
        queryClient.invalidateQueries({
          queryKey: ["header-orders-preview"],
        }),
      ]);
      clearCart();
      navigate(`/orders/${order.id}`);
    } catch {
      setErrorMessage("주문 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="coupang-shell min-h-screen flex flex-col bg-[#f4f7fb]">
      <main
        id="main-content"
        className="flex-1 max-w-5xl mx-auto w-full px-4 py-6"
      >
        <Link
          to="/cart"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-[#64748b] hover:text-[#346aff]"
        >
          <ChevronLeft size={16} />
          장바구니
        </Link>
        <h1 className="mb-5 text-2xl font-black text-[#111827]">주문/결제</h1>

        {!hasCartHydrated && <SectionSkeleton lines={5} />}

        {hasCartHydrated && items.length === 0 && (
          <div className="rounded-[28px] border border-[#e4ebf3] bg-white py-20 text-center text-[#64748b]">
            <p className="text-lg font-medium">주문할 상품이 없습니다.</p>
            <Link
              to="/"
              className="mt-4 inline-block font-semibold text-[#346aff]"
            >
              쇼핑하러 가기
            </Link>
          </div>
        )}

        {hasCartHydrated && items.length > 0 && isLoading && (
          <SectionSkeleton lines={5} />
        )}

        {hasCartHydrated && items.length > 0 && isError && (
          <div className="rounded-[28px] border border-[#e4ebf3] bg-white py-20 text-center text-[#64748b] shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <p className="text-lg font-medium">
              주문 상품을 불러오지 못했습니다.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-xl bg-[#346aff] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#2858d8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff] focus-visible:ring-offset-2"
            >
              다시 시도
            </button>
          </div>
        )}

        {hasCartHydrated && items.length > 0 && !isLoading && !isError && (
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.8fr)]">
            <div className="flex flex-col gap-5">
              <section className="rounded-[24px] border border-[#e4ebf3] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
                <h2 className="mb-4 flex items-center gap-2 font-black text-[#111827]">
                  <MapPin size={18} /> 배송지
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["recipient", "받는 사람"],
                      ["phone", "휴대폰 번호"],
                      ["zipcode", "우편번호"],
                      ["address", "주소"],
                      ["addressDetail", "상세 주소"],
                    ] as const
                  ).map(([field, label]) => (
                    <label
                      key={field}
                      className={`flex flex-col gap-1 text-xs font-semibold text-[#516074] ${
                        field === "address" || field === "addressDetail"
                          ? "sm:col-span-2"
                          : ""
                      }`}
                    >
                      {label}
                      <input
                        value={shippingAddress[field]}
                        onChange={(event) =>
                          setShippingAddress((current) => ({
                            ...current,
                            [field]: event.target.value,
                            ...(field === "address"
                              ? { city: event.target.value }
                              : {}),
                            ...(field === "addressDetail"
                              ? { street: event.target.value }
                              : {}),
                          }))
                        }
                        className="rounded-xl border border-[#e4ebf3] px-3 py-2 text-sm font-normal text-[#111827] outline-none focus:border-[#346aff] focus:ring-4 focus:ring-[#dbe8ff]"
                        required={field !== "addressDetail"}
                      />
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-[24px] border border-[#e4ebf3] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
                <h2 className="mb-4 flex items-center gap-2 font-black text-[#111827]">
                  <CreditCard size={18} /> 결제수단
                </h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {paymentOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`cursor-pointer rounded-xl border p-3 text-sm font-semibold ${paymentMethod === option.value ? "border-[#346aff] bg-[#eef4ff] text-[#346aff]" : "border-[#e4ebf3] text-[#516074]"}`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={option.value}
                        checked={paymentMethod === option.value}
                        onChange={() => setPaymentMethod(option.value)}
                        className="sr-only"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </section>

              <section className="rounded-[24px] border border-[#e4ebf3] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
                <h2 className="mb-3 font-black text-[#111827]">주문 상품</h2>
                <div className="flex flex-col divide-y divide-[#edf2f7]">
                  {rows.map((row) => (
                    <div
                      key={row.productId}
                      className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="h-14 w-14 overflow-hidden rounded-xl bg-[#f7f9fc]">
                        <OptimizedImage
                          src={row.product.imageUrls[0] ?? ""}
                          alt={row.product.name}
                          className="h-full w-full"
                        />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-semibold text-[#111827]">
                          {row.product.name}
                        </p>
                        <p className="mt-1 text-[#64748b]">
                          수량 {row.quantity}개
                        </p>
                      </div>
                      <span className="font-black text-[#111827]">
                        {formatPrice(row.product.price * row.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[28px] border border-[#dfe7f2] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                <h2 className="text-lg font-black text-[#111827]">결제 금액</h2>
                <div className="mt-4 flex justify-between text-sm text-[#516074]">
                  <span>상품 금액</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-[#516074]">
                  <span>배송비</span>
                  <span className="font-semibold text-[#346aff]">무료</span>
                </div>
                <div className="mt-4 flex justify-between border-t border-[#edf2f7] pt-4 text-base font-black text-[#111827]">
                  <span>총 결제 금액</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                {errorMessage && (
                  <p role="alert" className="mt-3 text-sm text-[#e11937]">
                    {errorMessage}
                  </p>
                )}
                <Button
                  type="button"
                  className="mt-5"
                  fullWidth
                  isLoading={isSubmitting}
                  onClick={handleSubmit}
                >
                  결제하기
                </Button>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
