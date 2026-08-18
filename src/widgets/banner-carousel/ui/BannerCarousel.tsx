import { useCallback, useEffect, useState } from "react";
import { OptimizedImage } from "@/shared/ui/OptimizedImage";
import { BANNER_SLIDES } from "../model/bannerSlides";

const AUTOPLAY_INTERVAL_MS = 4000;

interface BannerCarouselProps {
  autoplay?: boolean;
  interval?: number;
}

export function BannerCarousel({
  autoplay = true,
  interval = AUTOPLAY_INTERVAL_MS,
}: BannerCarouselProps) {
  const slides = BANNER_SLIDES;
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
    <section className="banner-carousel mx-auto max-w-[1400px] px-3 pt-6 md:px-6">
      <div className="relative aspect-[3/1] w-full overflow-hidden rounded-2xl bg-[#0f172a] md:aspect-[21/5]">
        <a
          href={activeSlide.href ?? "#"}
          className="block h-full w-full"
          aria-label={activeSlide.title}
        >
          <OptimizedImage
            src={activeSlide.image}
            alt={activeSlide.title}
            className="h-full w-full"
          />
        </a>

        <div
          className="absolute inset-x-0 bottom-3 flex justify-center gap-2"
          role="tablist"
          aria-label="배너 선택"
        >
          {slides.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleSelect(index)}
                role="tab"
                aria-selected={isActive}
                aria-label={`배너 ${index + 1}로 이동`}
                className={`h-2 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  isActive
                    ? "w-6 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
