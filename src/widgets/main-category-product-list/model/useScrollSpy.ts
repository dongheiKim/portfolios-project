import { useCallback, useEffect, useRef, useState } from "react";
import {
  SIDEBAR_CATEGORY_ORDER,
  type SidebarCategoryId,
} from "./sidebarCategories";

const PROGRAMMATIC_SCROLL_GUARD_MS = 600;

interface UseScrollSpyParams {
  siteHeaderHeight: number;
  mobileNavHeight: number;
}

export function useScrollSpy({
  siteHeaderHeight,
  mobileNavHeight,
}: UseScrollSpyParams) {
  const [activeCategory, setActiveCategory] = useState<SidebarCategoryId>(
    SIDEBAR_CATEGORY_ORDER[0],
  );

  const activeCategoryRef = useRef<SidebarCategoryId>(
    SIDEBAR_CATEGORY_ORDER[0],
  );
  const sectionRefs = useRef<Record<SidebarCategoryId, HTMLElement | null>>(
    {} as Record<SidebarCategoryId, HTMLElement | null>,
  );
  const sidebarChipRefs = useRef<
    Record<SidebarCategoryId, HTMLButtonElement | null>
  >({} as Record<SidebarCategoryId, HTMLButtonElement | null>);

  const isProgrammaticScroll = useRef(false);
  const programmaticScrollTimeout = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const updateActiveCategory = useCallback((category: SidebarCategoryId) => {
    if (activeCategoryRef.current === category) return;

    activeCategoryRef.current = category;
    setActiveCategory(category);
  }, []);

  const scrollToCategory = useCallback((category: SidebarCategoryId) => {
    const section = sectionRefs.current[category];
    if (!section) return;

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          const category = visible[0].target.getAttribute(
            "data-category",
          ) as SidebarCategoryId | null;
          if (category) updateActiveCategory(category);
        }
      },
      {
        rootMargin: `-${siteHeaderHeight + mobileNavHeight + 40}px 0px -50% 0px`,
        threshold: 0,
      },
    );

    SIDEBAR_CATEGORY_ORDER.forEach((category) => {
      const el = sectionRefs.current[category];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [mobileNavHeight, siteHeaderHeight, updateActiveCategory]);

  useEffect(() => {
    sidebarChipRefs.current[activeCategory]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeCategory]);

  useEffect(() => {
    return () => {
      if (programmaticScrollTimeout.current) {
        clearTimeout(programmaticScrollTimeout.current);
      }
    };
  }, []);

  const handleSidebarClick = useCallback(
    (category: SidebarCategoryId) => {
      updateActiveCategory(category);

      isProgrammaticScroll.current = true;
      if (programmaticScrollTimeout.current) {
        clearTimeout(programmaticScrollTimeout.current);
      }

      programmaticScrollTimeout.current = setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, PROGRAMMATIC_SCROLL_GUARD_MS);

      scrollToCategory(category);
    },
    [scrollToCategory, updateActiveCategory],
  );

  const setSectionRef = useCallback(
    (category: SidebarCategoryId, node: HTMLElement | null) => {
      sectionRefs.current[category] = node;
    },
    [],
  );

  const setSidebarChipRef = useCallback(
    (category: SidebarCategoryId, node: HTMLButtonElement | null) => {
      sidebarChipRefs.current[category] = node;
    },
    [],
  );

  return {
    activeCategory,
    handleSidebarClick,
    setSectionRef,
    setSidebarChipRef,
  };
}
