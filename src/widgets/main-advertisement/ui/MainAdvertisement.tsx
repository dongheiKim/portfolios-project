import { OptimizedImage } from "@/shared/ui/OptimizedImage";
import { MAIN_ADVERTISEMENT_CARDS } from "../model/mainAdvertisementCards";

export function MainAdvertisement() {
  return (
    <section className="main-advertisement mx-auto max-w-[1400px] px-3 pt-6 md:px-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
        {MAIN_ADVERTISEMENT_CARDS.map((card) => {
          const content = (
            <>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#f7f9fc] md:aspect-[16/10]">
                <OptimizedImage
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 line-clamp-2 text-sm font-semibold text-[#162032] md:text-base">
                {card.title}
              </p>
            </>
          );

          return card.href ? (
            <a
              key={card.id}
              href={card.href}
              className="group block rounded-xl border border-[#e7edf5] bg-white p-2 transition hover:-translate-y-0.5 hover:border-[#bfd1ff] hover:shadow-[0_10px_22px_rgba(15,23,42,0.08)] md:p-3"
            >
              {content}
            </a>
          ) : (
            <div
              key={card.id}
              className="group block rounded-xl border border-[#e7edf5] bg-white p-2 md:p-3"
            >
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
