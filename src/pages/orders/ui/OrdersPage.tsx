import { Link } from "react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Package } from "lucide-react";
import { fetchOrders, type OrderStatus } from "@/entities/order";
import { useAuthStore } from "@/features/auth/model/authStore";
import {
  getOrderStatusLabel,
  ORDER_STATUS_VALUES,
} from "@/shared/lib/orderStatus";
import { formatDate, formatPrice } from "@/shared/lib/format";
import { SectionSkeleton } from "@/shared/ui/Skeleton";

const statusOptions: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "전체 주문" },
  ...ORDER_STATUS_VALUES.map((value) => ({
    value,
    label: getOrderStatusLabel(value),
  })),
];

export function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const userId = useAuthStore((state) => state.user?.id);
  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders", userId],
    queryFn: fetchOrders,
  });
  const filteredOrders = useMemo(
    () =>
      orders?.filter(
        (order) => statusFilter === "all" || order.status === statusFilter,
      ) ?? [],
    [orders, statusFilter],
  );

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
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 rounded-xl bg-[#346aff] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#2858d8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff] focus-visible:ring-offset-2"
            >
              다시 시도
            </button>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div
            className="mb-5 flex flex-wrap gap-2"
            role="group"
            aria-label="주문 상태 필터"
          >
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={statusFilter === option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`rounded-full border px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff] focus-visible:ring-offset-2 ${
                  statusFilter === option.value
                    ? "border-[#346aff] bg-[#eef4ff] text-[#346aff]"
                    : "border-[#e4ebf3] bg-white text-[#64748b] hover:border-[#bfd1ff]"
                }`}
              >
                {option.label}
              </button>
            ))}
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

        {orders && orders.length > 0 && filteredOrders.length === 0 && (
          <div className="rounded-[28px] border border-[#e4ebf3] bg-white py-16 text-center text-[#64748b]">
            <p className="text-lg font-medium">해당 상태의 주문이 없습니다.</p>
          </div>
        )}

        {filteredOrders.length > 0 && (
          <div className="flex flex-col gap-4">
            {filteredOrders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex items-center justify-between gap-4 rounded-[24px] border border-[#e4ebf3] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)] transition hover:border-[#bfd1ff]"
              >
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#346aff]">
                    {getOrderStatusLabel(order.status)}
                  </p>
                  <p className="mt-1 text-base font-black text-[#111827]">
                    주문 #{order.id}
                  </p>
                  <p className="mt-1 text-sm text-[#64748b]">
                    {formatDate(order.createdAt, {
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
