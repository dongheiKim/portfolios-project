import type { ReactNode } from "react";
import { clsx } from "clsx";

interface StatusPanelProps {
  title: string;
  description?: string;
  icon: ReactNode;
  action?: ReactNode;
  meta?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export function StatusPanel({
  title,
  description,
  icon,
  action,
  meta,
  className,
  contentClassName,
}: StatusPanelProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center rounded-[28px] border border-[#e4ebf3] bg-white px-6 py-16 text-center shadow-[0_18px_45px_rgba(15,23,42,0.05)]",
        className,
      )}
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#eef4ff] text-[#346aff]">
        {icon}
      </div>
      <div className={clsx("mt-6 max-w-xl", contentClassName)}>
        <p className="text-2xl font-black tracking-[-0.03em] text-[#111827]">
          {title}
        </p>
        {description && (
          <p className="mt-2 text-sm leading-6 text-[#64748b]">{description}</p>
        )}
        {meta && (
          <div className="mt-5 flex flex-wrap justify-center gap-2">{meta}</div>
        )}
      </div>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
