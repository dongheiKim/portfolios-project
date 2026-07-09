import { Link, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, MapPin, Package } from "lucide-react";
import { fetchOrderById } from "@/entities/order";
import { formatPrice } from "@/shared/lib/format";
import { HeroSkeleton, SectionSkeleton } from "@/shared/ui/Skeleton";
import type { OrderStatus } from "@/entities/order";

const statusLabel: Record<OrderStatus, string> = {
  pending: "결제 대기",
  paid: "결제 완료",
  preparing: "상품 준비 중",
  shipping: "배송 중",
  delivered: "배송 완료",
  cancelled: "취소됨",
  refunded: "환불 완료",
  completed: "완료됨",
};

const statusColor: Record<OrderStatus, string> = {
  pending: "text-yellow-600",
  paid: "text-blue-600",
  preparing: "text-indigo-600",
  shipping: "text-[#1a93e5]",
  delivered: "text-green-600",
  cancelled: "text-gray-500",
  refunded: "text-red-500",
  completed: "text-green-600",
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const orderId = (id ?? "").trim();
  const invalidOrderId = !/^[1-9]\d*$/.test(orderId);

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrderById(orderId),
    enabled: !invalidOrderId,
  });

  return (
    <div className="coupang-shell min-h-screen flex flex-col bg-[#f4f7fb]">
      <main
        id="main-content"
        className="flex-1 max-w-5xl mx-auto w-full px-4 py-6"
      >
        <Link
          to="/orders"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-[#64748b] hover:text-[#346aff]"
        >
          <ChevronLeft size={16} />
          주문 목록
        </Link>

        {invalidOrderId && (
          <div className="rounded-[28px] border border-[#e4ebf3] bg-white py-20 text-center text-[#64748b] shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <p className="text-lg font-medium">
              유효한 숫자 주문 번호가 아닙니다.
            </p>
          </div>
        )}

        {!invalidOrderId && isError && (
          <div className="rounded-[28px] border border-[#e4ebf3] bg-white py-20 text-center text-[#64748b] shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <p className="text-lg font-medium">주문을 찾을 수 없습니다.</p>
          </div>
        )}

        {!invalidOrderId && isLoading && (
          <div className="flex flex-col gap-5">
            <HeroSkeleton />
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.8fr)]">
              <div className="flex flex-col gap-5">
                <SectionSkeleton lines={4} />
                <SectionSkeleton lines={3} />
              </div>
              <SectionSkeleton lines={4} className="lg:sticky lg:top-24" />
            </div>
          </div>
        )}

        {order && (
          <div className="flex flex-col gap-5">
            <section className="rounded-[30px] bg-[linear-gradient(135deg,#f8fbff_0%,#eef5ff_100%)] px-6 py-6 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#346aff]">
                    Order Detail
                  </p>
                  <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#111827]">
                    주문 #{order.id}
                  </h1>
                  <p className="mt-2 text-sm text-[#64748b]">
                    {new Date(order.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
                  <span
                    className={`text-sm font-bold ${statusColor[order.status]}`}
                  >
                    {statusLabel[order.status]}
                  </span>
                </div>
              </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.8fr)]">
              <section className="flex flex-col gap-5">
                <div className="rounded-[24px] border border-[#e4ebf3] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
                  <h2 className="mb-4 flex items-center gap-2 font-black text-[#111827]">
                    <Package size={18} />
                    주문 상품
                  </h2>
                  <div className="flex flex-col divide-y divide-[#edf2f7]">
                    {order.items.map(
                      (item: (typeof order.items)[number], i: number) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                        >
                          <div className="h-18 w-18 overflow-hidden rounded-2xl bg-[#f7f9fc] flex-shrink-0">
                            {item.productImage && (
                              <img
                                src={item.productImage}
                                alt={item.productName}
                                className="h-full w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-[#111827]">
                              {item.productName}
                            </p>
                            <p className="mt-1 text-xs text-[#64748b]">
                              수량 {item.quantity}개
                            </p>
                          </div>
                          <span className="text-base font-black text-[#111827]">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#e4ebf3] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
                  <h2 className="mb-3 flex items-center gap-2 font-black text-[#111827]">
                    <MapPin size={18} />
                    배송지
                  </h2>
                  <div className="flex flex-col gap-1 text-sm text-[#516074] leading-6">
                    <p className="font-semibold text-[#111827]">
                      {order.shippingAddress.recipient}
                    </p>
                    <p>{order.shippingAddress.phone}</p>
                    <p>
                      ({order.shippingAddress.address}){" "}
                      {order.shippingAddress.city}{" "}
                      {order.shippingAddress.street}
                    </p>
                    {(order.shippingAddress.zipcode ||
                      order.shippingAddress.addressDetail) && (
                      <p>
                        {order.shippingAddress.zipcode}{" "}
                        {order.shippingAddress.addressDetail}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-[28px] border border-[#dfe7f2] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#346aff]">
                    Payment Summary
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-[#111827]">
                    결제 금액
                  </h2>
                  <div className="mt-5 space-y-3 text-sm text-[#516074]">
                    <div className="flex justify-between">
                      <span>상품 금액</span>
                      <span>{formatPrice(order.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>배송비</span>
                      <span className="font-semibold text-[#346aff]">무료</span>
                    </div>
                  </div>
                  <div className="mt-5 rounded-2xl bg-[#f7faff] px-4 py-4">
                    <div className="flex justify-between font-black text-[#111827]">
                      <span>총 결제금액</span>
                      <span>{formatPrice(order.totalPrice)}</span>
                    </div>
                    <p className="mt-2 text-xs text-[#64748b]">
                      총{" "}
                      {order.items.reduce(
                        (sum: number, item: (typeof order.items)[number]) =>
                          sum + item.quantity,
                        0,
                      )}
                      개 상품이 결제되었습니다.
                    </p>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
