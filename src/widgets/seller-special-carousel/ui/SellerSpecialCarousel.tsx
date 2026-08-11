import { AdCarouselSection } from "@/shared/ui/AdCarouselSection";
import { SELLER_SPECIAL_DEALS } from "../model/sellerSpecialDeals";

export function SellerSpecialCarousel() {
  return (
    <section className="seller-special-carousel mx-auto max-w-[1400px] px-3 pt-6 md:px-6">
      <AdCarouselSection
        title="오늘의 판매자특가"
        items={SELLER_SPECIAL_DEALS}
      />
    </section>
  );
}
