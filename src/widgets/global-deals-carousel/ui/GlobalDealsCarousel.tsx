import { AdCarouselSection } from "@/shared/ui/AdCarouselSection";
import { GLOBAL_DEALS } from "../model/globalDeals";

export function GlobalDealsCarousel() {
  return (
    <section className="global-deals-carousel mx-auto max-w-[1400px] px-3 pt-6 md:px-6">
      <AdCarouselSection
        title="전세계 핫딜 로켓직구 글로벌특가"
        items={GLOBAL_DEALS}
      />
    </section>
  );
}
