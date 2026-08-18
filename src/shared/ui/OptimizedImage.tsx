import { clsx } from "clsx";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill";
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  objectFit = "cover",
}: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
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
