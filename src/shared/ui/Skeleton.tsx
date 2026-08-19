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
