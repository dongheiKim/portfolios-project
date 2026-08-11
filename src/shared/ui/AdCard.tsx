import { OptimizedImage } from "./OptimizedImage";
import type { AdItem } from "../model/ad";

interface AdCardProps {
  item: AdItem;
}

export function AdCard({ item }: AdCardProps) {
  const content = (
    <>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f7f9fc]">
        <OptimizedImage
          src={item.image}
          alt={item.title}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
        {item.badge && (
          <span className="absolute left-2 top-2 rounded-full bg-[#e11937] px-2 py-0.5 text-xs font-bold text-white">
            {item.badge}
          </span>
        )}
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="line-clamp-2 text-sm font-medium text-[#162032]">
          {item.title}
        </p>
        {item.subtitle && (
          <p className="text-xs text-[#8b97a9]">{item.subtitle}</p>
        )}
      </div>
    </>
  );

  const className =
    "group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff] focus-visible:ring-inset";

  if (item.href) {
    return (
      <a href={item.href} className={className} aria-label={item.title}>
        {content}
      </a>
    );
  }

  return (
    <div className={className} aria-label={item.title}>
      {content}
    </div>
  );
}
