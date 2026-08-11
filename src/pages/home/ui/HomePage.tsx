import { MainCarousel } from "@/widgets/main-carousel";
import { MainAdvertisement } from "@/widgets/main-advertisement";
import { SellerSpecialCarousel } from "@/widgets/seller-special-carousel";
import { GlobalDealsCarousel } from "@/widgets/global-deals-carousel";
import { MainCategoryProductList } from "@/widgets/main-category-product-list";

export function HomePage() {
  return (
    <div>
      <MainCarousel />
      <MainAdvertisement />
      <SellerSpecialCarousel />
      <GlobalDealsCarousel />
      <MainCategoryProductList />
    </div>
  );
}
