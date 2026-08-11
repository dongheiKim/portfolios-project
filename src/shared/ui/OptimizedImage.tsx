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

/**
 * 이미지 최적화 컴포넌트
 * - lazy loading (우선순위 높은 이미지는 eager)
 * - decoding="async" 로 메인 스레드 블로킹 방지
 * - fetchpriority로 LCP 이미지 힌트 제공
 */
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
      // @ts-expect-error - fetchpriority는 표준 속성이나 TS 타입에 미포함
      fetchpriority={priority ? "high" : "low"}
      className={clsx(
        objectFit === "cover" && "object-cover",
        objectFit === "contain" && "object-contain",
        objectFit === "fill" && "object-fill",
        className,
      )}
    />
  );
}
