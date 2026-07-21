import { Link } from "react-router";
import { PackageCheck, Gift } from "lucide-react";
import { QUICK_LINKS } from "../lib/header.constants";
import type { Order } from "@/entities/order";

/**
 * 헤더 빠른 액션 섹션 컴포넌트 (태블릿 이상)
 * - 빠른 링크 메뉴 (로켓배송, 로켓프레시 등)
 * - 최근 주문 상태, 배송 혜택 정보 표시
 */
interface HeaderQuickActionsProps {
  token: string | null;
  latestOrder: Order | null;
  latestOrderStatusLabel: string;
}

export function HeaderQuickActions({
  token,
  latestOrder,
  latestOrderStatusLabel,
}: HeaderQuickActionsProps) {
  return (
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
  );
}
