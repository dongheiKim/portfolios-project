import React from "react";


interface MainCarouselProps {
  items?: any[];
  autoplay?: boolean;
  interval?: number;
}

export const MainCarousel: React.FC<MainCarouselProps> = ({
  items = [],
  autoplay = true,
  interval = 5000,
}) => {
  return <div className="main-carousel">MainCarousel</div>;
};
