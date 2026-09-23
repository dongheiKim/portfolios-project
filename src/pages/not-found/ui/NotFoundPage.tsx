import { Link } from "react-router";
import { Home } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="coupang-shell flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f4f7fb] px-4 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#346aff]">
        404
      </p>
      <h1 className="text-3xl font-black text-[#111827]">
        페이지를 찾을 수 없습니다.
      </h1>
      <p className="text-sm text-[#64748b]">
        요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#346aff] px-4 py-2 text-base font-semibold text-white shadow-[0_10px_20px_rgba(52,106,255,0.22)] transition-all hover:bg-[#1d55ef] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff] focus-visible:ring-offset-2"
      >
        <Home size={16} />
        홈으로 돌아가기
      </Link>
    </div>
  );
}
