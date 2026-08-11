import { useEffect, useState, type RefObject } from "react";

const SCROLL_OFFSET_GAP = 16;

export function useHeaderOffset(
  mobileNavRef: RefObject<HTMLDivElement | null>,
) {
  const [siteHeaderHeight, setSiteHeaderHeight] = useState(0);
  const [mobileNavHeight, setMobileNavHeight] = useState(0);

  useEffect(() => {
    const headerEl = document.getElementById("site-header");
    if (!headerEl) return;

    const update = () =>
      setSiteHeaderHeight(headerEl.getBoundingClientRect().height);
    update();

    const observer = new ResizeObserver(update);
    observer.observe(headerEl);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = mobileNavRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      setMobileNavHeight(entries[0].contentRect.height);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [mobileNavRef]);

  return {
    localNavTop: siteHeaderHeight,
    sectionScrollMargin: siteHeaderHeight + mobileNavHeight + SCROLL_OFFSET_GAP,
    siteHeaderHeight,
    mobileNavHeight,
  };
}
