import React from "react";

interface CarouselAdvertisementProps {
  items?: any[];
  autoplay?: boolean;
  interval?: number;
}

export const CarouselAdvertisement: React.FC<CarouselAdvertisementProps> = ({
  items = [],
  autoplay = true,
  interval = 5000,
}) => {
  return <div className="carousel-advertisement">CarouselAdvertisement</div>;
};
