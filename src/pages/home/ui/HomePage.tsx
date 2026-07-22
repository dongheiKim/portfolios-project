import { MainCarousel } from "@/widgets/main-carousel";
import { MainAdvertisement } from "@/widgets/main-advertisement";
import { CarouselAdvertisement } from "@/widgets/carousel-advertisement";
import { CategoryAdCarousel } from "@/widgets/category-ad-carousel";
import { MainCategoryProductList } from "@/widgets/main-category-product-list";

export function HomePage() {
  return (
    <div>
      <MainCarousel />
      <MainAdvertisement />
      <CarouselAdvertisement />
      <CategoryAdCarousel />
      <MainCategoryProductList />
    </div>
  );
}
