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
      <div className="mb-3">
        <h2 className="text-lg font-black tracking-[-0.02em] text-[#0f172a] md:text-xl">
          {title}
        </h2>
      </div>

      <div className="group relative">
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

        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden items-center justify-between px-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100 sm:flex">
          {ARROW_DIRECTIONS.map((direction) => {
            const isLeft = direction === "left";

            return (
              <button
                key={direction}
                type="button"
                onClick={() => handleScroll(direction)}
                className={`pointer-events-auto rounded-full border border-[#d6deec] bg-white/90 p-2 text-[#334155] shadow-[0_4px_12px_rgba(15,23,42,0.12)] backdrop-blur transition hover:border-[#a7bbdf] hover:text-[#1d4ed8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff] focus-visible:ring-offset-2 ${
                  isLeft ? "-translate-x-1/2" : "translate-x-1/2"
                }`}
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
    </div>
  );
}
