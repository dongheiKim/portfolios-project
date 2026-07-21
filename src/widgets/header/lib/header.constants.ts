/** 헤더 빠른 링크 메뉴 항목들 */
export const QUICK_LINKS = [
  "로켓배송",
  "로켓프레시",
  "쿠팡비즈",
  "와우회원할인",
];

/** 주문 상태별 한글 레이블 매핑 */
export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: "결제 대기",
  paid: "결제 완료",
  preparing: "상품 준비 중",
  shipping: "배송 중",
  delivered: "배송 완료",
  cancelled: "취소됨",
  refunded: "환불 완료",
};
