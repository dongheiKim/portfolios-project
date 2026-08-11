import { useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdCard } from "./AdCard";
import type { AdItem } from "../model/ad";

interface AdCarouselSectionProps {
  title: string;
  items: AdItem[];
}

const ARROW_DIRECTIONS = ["left", "right"] as const;

// 기본 2개, sm 3개, md 이상 4개가 한 화면에 보이도록 폭을 나눈다
const ITEM_CLASS =
  "shrink-0 snap-start basis-[calc(50%-6px)] sm:basis-[calc(33.333%-8px)] md:basis-[calc(25%-9px)]";

export function AdCarouselSection({ title, items }: AdCarouselSectionProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback((direction: "left" | "right") => {
    const target = trackRef.current;
    if (!target) return;
    const step = target.clientWidth * 0.9;
    target.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="@container/card rounded-2xl border border-[#dce5f2] bg-white p-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)] sm:p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black tracking-[-0.02em] text-[#0f172a] md:text-xl">
          {title}
        </h2>
        <div className="hidden items-center gap-2 sm:flex">
          {ARROW_DIRECTIONS.map((direction) => {
            const isLeft = direction === "left";

            return (
              <button
                key={direction}
                type="button"
                onClick={() => handleScroll(direction)}
                className="rounded-full border border-[#d6deec] bg-white p-2 text-[#334155] transition hover:border-[#a7bbdf] hover:text-[#1d4ed8]"
                aria-label={`${title} ${isLeft ? "이전" : "다음"} 상품 보기`}
              >
                {isLeft ? (
                  <ChevronLeft size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <div key={item.id} className={ITEM_CLASS}>
            <AdCard item={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
