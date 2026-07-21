import { ProductList } from "@/widgets/product-list";
import { MainCarousel } from "@/widgets/main-carousel";
import { MainAdvertisement } from "@/widgets/main-advertisement";
import { CarouselAdvertisement } from "@/widgets/carousel-advertisement";
import { CategoryAdCarousel } from "@/widgets/category-ad-carousel";

export function HomePage() {
  return (
    <div>
      <MainCarousel />
      <MainAdvertisement />
      <CarouselAdvertisement />
      <CategoryAdCarousel />
      <ProductList products={[]} />
    </div>
  );
}
