import { clsx } from "clsx";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill";
}

export function OptimizedImage({
  src,
  alt,
  className,
  priority = false,
  objectFit = "cover",
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "low"}
      className={clsx(
        objectFit === "cover" && "object-cover",
        objectFit === "contain" && "object-contain",
        objectFit === "fill" && "object-fill",
        className,
      )}
    />
  );
}
