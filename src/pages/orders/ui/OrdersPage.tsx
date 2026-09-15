import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Package } from "lucide-react";
import { fetchOrders } from "@/entities/order";
import type { OrderStatus } from "@/entities/order";
import { formatPrice } from "@/shared/lib/format";
import { SectionSkeleton } from "@/shared/ui/Skeleton";

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

export function OrdersPage() {
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrders,
  });

  return (
    <div className="coupang-shell min-h-screen flex flex-col bg-[#f4f7fb]">
      <main
        id="main-content"
        className="flex-1 max-w-5xl mx-auto w-full px-4 py-6"
      >
        <h1 className="mb-5 text-2xl font-black text-[#111827]">주문 목록</h1>

        {isLoading && (
          <div className="flex flex-col gap-4">
            <SectionSkeleton lines={3} />
            <SectionSkeleton lines={3} />
          </div>
        )}

        {isError && (
          <div className="rounded-[28px] border border-[#e4ebf3] bg-white py-20 text-center text-[#64748b] shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <p className="text-lg font-medium">
              주문 목록을 불러오지 못했습니다.
            </p>
          </div>
        )}

        {orders && orders.length === 0 && (
          <div className="rounded-[28px] border border-[#e4ebf3] bg-white py-20 text-center text-[#64748b] shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <Package
              className="mx-auto mb-3 text-[#c9d3e1]"
              size={40}
              aria-hidden="true"
            />
            <p className="text-lg font-medium">아직 주문 내역이 없습니다.</p>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="flex flex-col gap-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex items-center justify-between gap-4 rounded-[24px] border border-[#e4ebf3] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)] transition hover:border-[#bfd1ff]"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#346aff]">
                    {statusLabel[order.status]}
                  </p>
                  <p className="mt-1 text-base font-black text-[#111827]">
                    주문 #{order.id}
                  </p>
                  <p className="mt-1 text-sm text-[#64748b]">
                    {new Date(order.createdAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-[#111827]">
                    {formatPrice(order.totalPrice)}
                  </span>
                  <ChevronRight size={18} className="text-[#94a3b8]" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
