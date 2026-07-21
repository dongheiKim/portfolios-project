import React from "react";

interface MainAdvertisementCard {
  id?: string | number;
  title?: string;
  image?: string;
  link?: string;
}

interface MainAdvertisementProps {
  cards?: MainAdvertisementCard[];
  visibleCount?: number;
  title?: string;
  image?: string;
  link?: string;
}

export const MainAdvertisement: React.FC<MainAdvertisementProps> = ({
  cards = [],
  visibleCount = 12,
  title,
  image,
  link,
}) => {
  const normalizedCards =
    cards.length > 0
      ? cards
      : Array.from({ length: visibleCount }, (_, index) => ({
          id: `main-ad-${index + 1}`,
          title: title ?? `메인 광고 ${index + 1}`,
          image,
          link,
        }));

  const visibleCards = normalizedCards.slice(0, visibleCount);

  return (
    <section className="main-advertisement">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
        {visibleCards.map((card, index) => (
          <a
            key={card.id ?? `main-ad-slot-${index + 1}`}
            href={card.link ?? "#"}
            className="flex min-h-24 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-4 text-sm font-medium text-slate-700 transition hover:border-slate-300"
          >
            {card.title ?? `메인 광고 ${index + 1}`}
          </a>
        ))}
      </div>
    </section>
  );
};
