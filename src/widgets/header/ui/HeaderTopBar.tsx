import { Link } from "react-router";
import { Clock3 } from "lucide-react";
import { useTodayLabel } from "../model/useHeaderOrders";

/**
 * 헤더 상단 배너 컴포넌트
 * - 오늘의 배송 혜택 및 이벤트 정보 표시
 * - 주문 목록, 회원 가입 등 빠른 링크 제공
 */
interface HeaderTopBarProps {
  token: string | null;
  orderCount: number;
}

export function HeaderTopBar({ token, orderCount }: HeaderTopBarProps) {
  const todayLabel = useTodayLabel();

  return (
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
  );
}
