import { clsx } from "clsx";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export function Skeleton({ className, rounded = false }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse bg-gray-200",
        rounded ? "rounded-full" : "rounded",
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-[20px] border border-[#e4ebf3] bg-white p-3 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
      <Skeleton className="w-full aspect-square" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-5 w-1/3" />
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="rounded-[24px] border border-[#e4ebf3] bg-white p-4 shadow-[0_14px_35px_rgba(15,23,42,0.05)] sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <Skeleton className="h-28 w-28 rounded-2xl sm:h-32 sm:w-32" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="mt-3 h-6 w-3/4" />
          <Skeleton className="mt-2 h-4 w-2/3" />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-2 h-7 w-28" />
              <Skeleton className="mt-2 h-3 w-32" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-10 w-16 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SectionSkeletonProps {
  lines?: number;
  className?: string;
}

export function SectionSkeleton({
  lines = 4,
  className,
}: SectionSkeletonProps) {
  return (
    <div
      className={clsx(
        "rounded-[24px] border border-[#e4ebf3] bg-white p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)]",
        className,
      )}
    >
      <Skeleton className="h-6 w-32" />
      <div className="mt-4 flex flex-col gap-3">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            className={clsx("h-4", index === lines - 1 ? "w-2/3" : "w-full")}
          />
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="rounded-[30px] border border-[#e4ebf3] bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="mt-4 h-10 w-52" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-3 h-4 w-4/5" />
    </div>
  );
}
