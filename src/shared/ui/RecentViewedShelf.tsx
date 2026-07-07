import { Link } from "react-router";
import { ChevronRight, Eye } from "lucide-react";
import type { RecentViewedProduct } from "@/shared/hooks/useRecentViewedProducts";
import { formatPrice } from "@/shared/lib/format";

interface RecentViewedShelfProps {
  products: RecentViewedProduct[];
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
}

export function RecentViewedShelf({
  products,
  eyebrow,
  title,
  description,
  className,
}: RecentViewedShelfProps) {
  if (products.length === 0) return null;

  return (
    <section
      className={`rounded-[28px] border border-[#e4ebf3] bg-white px-4 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:px-6 ${className ?? ""}`}
    >
      <div className="flex flex-col gap-3 border-b border-[#edf2f7] pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#346aff]">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-2xl font-black tracking-[-0.03em] text-[#111827]">
            {title}
          </h2>
          <p className="mt-1 text-sm text-[#607086]">{description}</p>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#eef4ff] px-3 py-2 text-xs font-medium text-[#346aff]">
          <Eye size={14} />
          최근 본 상품 {products.length}개
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="group overflow-hidden rounded-[22px] border border-[#e6edf6] bg-[#fbfcfe] transition-all hover:-translate-y-1 hover:border-[#bfd1ff] hover:shadow-[0_16px_32px_rgba(52,106,255,0.12)]"
          >
            <div className="aspect-[4/3] overflow-hidden bg-white">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <div className="inline-flex items-center gap-1 rounded-full bg-[#eef4ff] px-2 py-1 text-[11px] font-bold text-[#346aff]">
                <Eye size={12} />
                다시 보기
              </div>
              <p className="mt-3 line-clamp-2 min-h-10 text-sm font-medium leading-6 text-[#162032]">
                {product.name}
              </p>
              <p className="mt-3 text-xl font-black tracking-[-0.03em] text-[#111827]">
                {formatPrice(product.price)}
              </p>
              <div className="mt-3 flex items-center justify-between text-xs text-[#64748b]">
                <span>최근 본 상품</span>
                <span className="inline-flex items-center gap-1 font-semibold text-[#346aff]">
                  상세 보기
                  <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
