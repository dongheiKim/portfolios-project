import { useCallback, useEffect, useState } from "react";
import { OptimizedImage } from "@/shared/ui/OptimizedImage";
import { MAIN_CAROUSEL_SLIDES } from "../model/mainCarouselSlides";

const AUTOPLAY_INTERVAL_MS = 5000;

interface MainCarouselProps {
  autoplay?: boolean;
  interval?: number;
}

export function MainCarousel({
  autoplay = true,
  interval = AUTOPLAY_INTERVAL_MS,
}: MainCarouselProps) {
  const slides = MAIN_CAROUSEL_SLIDES;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!autoplay || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => window.clearInterval(timer);
  }, [autoplay, interval, slides.length]);

  const handleSelect = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const activeSlide = slides[activeIndex];
  if (!activeSlide) return null;

  return (
    <section className="main-carousel mx-auto max-w-[1400px] px-3 pt-4 md:px-6">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#0f172a] sm:aspect-[16/9] lg:aspect-[21/9]">
        <a
          href={activeSlide.href ?? "#"}
          className="block h-full w-full"
          aria-label={activeSlide.title}
        >
          <OptimizedImage
            src={activeSlide.image}
            alt={activeSlide.title}
            priority={activeIndex === 0}
            className="h-full w-full"
          />
        </a>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white sm:p-6">
          <p className="text-lg font-black sm:text-2xl">{activeSlide.title}</p>
          {activeSlide.subtitle && (
            <p className="mt-1 text-sm text-white/80 sm:text-base">
              {activeSlide.subtitle}
            </p>
          )}
        </div>

        <div className="absolute right-2 top-1/2 flex max-h-[80%] -translate-y-1/2 flex-col gap-2 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:right-4 sm:gap-3">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleSelect(index)}
                aria-label={`${slide.title} 배너로 이동`}
                aria-current={isActive}
                className={`relative aspect-video w-14 shrink-0 overflow-hidden rounded-lg border-2 shadow-[0_4px_12px_rgba(15,23,42,0.25)] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff] focus-visible:ring-offset-2 sm:w-20 ${
                  isActive
                    ? "border-[#2563eb]"
                    : "border-white/70 opacity-70 hover:opacity-100"
                }`}
              >
                <OptimizedImage
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full"
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
