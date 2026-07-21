import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchOrders } from "@/entities/order";
import { useAuthStore } from "@/features/auth/model/authStore";
import { ORDER_STATUS_LABEL } from "../lib/header.constants";
import type { Order } from "@/entities/order";

/**
 * 헤더에서 사용할 주문 데이터를 관리하는 훅
 * - 최근 주문 정보 조회
 * - 주문 상태 레이블 번역
 */
export function useHeaderOrders() {
  const token = useAuthStore((s) => s.token);

  const { data: ordersData } = useQuery({
    queryKey: ["header-orders-preview"],
    queryFn: fetchOrders,
    enabled: Boolean(token),
    staleTime: 1000 * 60 * 3,
  });

  const orderCount = ordersData?.length ?? 0;
  const latestOrder: Order | null = ordersData?.[0] ?? null;
  const latestOrderStatusLabel = latestOrder
    ? (ORDER_STATUS_LABEL[latestOrder.status] ?? "주문 확인")
    : "주문 확인";

  return {
    orderCount,
    latestOrder,
    latestOrderStatusLabel,
    isLoaded: Boolean(token),
  };
}

/**
 * 오늘 날짜를 한글 형식으로 포맷팅하는 훅
 * 예: "7월 20일 일"
 */
export function useTodayLabel() {
  return useMemo(
    () =>
      new Intl.DateTimeFormat("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "short",
      }).format(new Date()),
    [],
  );
}
