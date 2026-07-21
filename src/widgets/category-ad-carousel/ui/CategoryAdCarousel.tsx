import React from "react";

interface CategoryAdCarouselProps {
  categories?: any[];
  autoplay?: boolean;
  interval?: number;
}

export const CategoryAdCarousel: React.FC<CategoryAdCarouselProps> = ({
  categories = [],
  autoplay = true,
  interval = 5000,
}) => {
  return <div className="category-ad-carousel">CategoryAdCarousel</div>;
};
