import { clsx } from "clsx";

type BadgeVariant = "rocket" | "logistics" | "discount" | "new" | "best";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  value?: string | number;
  className?: string;
}

const badgeConfig: Record<
  BadgeVariant,
  { defaultLabel: string; styles: string }
> = {
  rocket: {
    defaultLabel: "로켓배송",
    styles: "bg-[#1a93e5] text-white",
  },
  logistics: {
    defaultLabel: "쿠팡 로지스틱스",
    styles: "bg-[#00b0a0] text-white",
  },
  discount: {
    defaultLabel: "",
    styles: "bg-[#e4003b] text-white",
  },
  new: {
    defaultLabel: "NEW",
    styles: "bg-gray-800 text-white",
  },
  best: {
    defaultLabel: "BEST",
    styles: "bg-orange-500 text-white",
  },
};

export function Badge({ variant, label, value, className }: BadgeProps) {
  const config = badgeConfig[variant];
  const displayLabel =
    variant === "discount" ? `${value}%` : (label ?? config.defaultLabel);

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold",
        config.styles,
        className,
      )}
    >
      {displayLabel}
    </span>
  );
}
