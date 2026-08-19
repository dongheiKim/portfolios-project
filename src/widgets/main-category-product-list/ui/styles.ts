// MainCategoryProductList 레이아웃
export const MAIN_CATEGORY_PRODUCT_LIST_SECTION_CLASS =
  "mx-auto mt-10 max-w-[1400px] px-3 pb-12 md:px-6";

export const MAIN_CATEGORY_PRODUCT_LIST_GRID_CLASS =
  "md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6";

export const MAIN_CATEGORY_PRODUCT_LIST_CONTENT_CLASS =
  "space-y-8 md:space-y-10";

// CarouselSection 스타일
export const CAROUSEL_TITLE_CLASS =
  "text-sm font-black tracking-[-0.02em] text-[#0f172a] @sm/card:text-base";

export const CAROUSEL_ARROW_BUTTON_CLASS =
  "rounded-full border border-[#d6deec] bg-white p-2 text-[#334155] transition hover:border-[#a7bbdf] hover:text-[#1d4ed8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#346aff] focus-visible:ring-offset-2";

export const CAROUSEL_TRACK_CLASS =
  "flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

// CategorySidebarNav 스타일
export const SIDEBAR_WRAPPER_CLASS = `
  sticky z-10 -mx-3 mb-4 border-b border-[#e5ebf5] bg-white/95 px-3 py-2 backdrop-blur
  md:static md:z-auto md:mx-0 md:mb-0 md:h-fit md:border-b-0 md:bg-transparent
  md:rounded-2xl md:border md:border-[#dce5f2] md:bg-white md:p-4
  md:shadow-[0_10px_22px_rgba(15,23,42,0.06)] md:sticky
`;

export const SIDEBAR_MOBILE_CHIP_CONTAINER_CLASS =
  "flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:hidden";

export const SIDEBAR_MOBILE_CHIP_BASE_CLASS =
  "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition";

export const SIDEBAR_MOBILE_CHIP_ACTIVE_CLASS =
  "border-[#2563eb] bg-[#eef4ff] text-[#1d4ed8]";

export const SIDEBAR_MOBILE_CHIP_INACTIVE_CLASS =
  "border-[#d6deec] bg-white text-[#334155] hover:border-[#a7bbdf]";

export const SIDEBAR_DESKTOP_LIST_CLASS = "hidden space-y-2 md:block";

export const SIDEBAR_DESKTOP_ITEM_BASE_CLASS =
  "flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm font-semibold transition";

export const SIDEBAR_DESKTOP_ITEM_ACTIVE_CLASS =
  "border-[#2563eb] bg-[#eef4ff] text-[#1d4ed8]";

export const SIDEBAR_DESKTOP_ITEM_INACTIVE_CLASS =
  "border-transparent bg-[#f8fbff] text-[#334155] hover:border-[#d5deec] hover:bg-[#f1f6ff]";

export const SIDEBAR_COUNT_BADGE_CLASS =
  "rounded-full bg-white px-2 py-0.5 text-xs text-[#64748b]";

// CategorySidebarNav 스타일 헬퍼
export function getSidebarMobileChipClass(isActive: boolean) {
  return `${SIDEBAR_MOBILE_CHIP_BASE_CLASS} ${isActive ? SIDEBAR_MOBILE_CHIP_ACTIVE_CLASS : SIDEBAR_MOBILE_CHIP_INACTIVE_CLASS}`;
}

export function getSidebarDesktopItemClass(isActive: boolean) {
  return `${SIDEBAR_DESKTOP_ITEM_BASE_CLASS} ${isActive ? SIDEBAR_DESKTOP_ITEM_ACTIVE_CLASS : SIDEBAR_DESKTOP_ITEM_INACTIVE_CLASS}`;
}

// CategorySection 스타일
export const CATEGORY_SECTION_ROOT_CLASS = "space-y-3";

export const CATEGORY_SECTION_TITLE_CLASS =
  "text-lg font-black tracking-[-0.02em] text-[#0f172a] md:text-xl";

export const CATEGORY_SECTION_CARD_CLASS =
  "@container/card rounded-2xl border border-[#dce5f2] bg-white p-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)] sm:p-4 md:p-5";

export const CATEGORY_SECTION_CARD_INNER_CLASS =
  "flex flex-col gap-4 @5xl/card:flex-row @5xl/card:items-stretch";

export const CATEGORY_SECTION_FEATURED_WRAP_CLASS =
  "@5xl/card:w-[400px] @5xl/card:shrink-0";

export const CATEGORY_SECTION_GRID_WRAP_CLASS =
  "@container/grid flex-1 border-t border-[#eef2f6] pt-4 @5xl/card:border-t-0 @5xl/card:border-l @5xl/card:pl-4 @5xl/card:pt-0";

export const CATEGORY_SECTION_FEATURED_ITEM_CLASS =
  "w-full shrink-0 snap-center";

export const CATEGORY_SECTION_FEATURED_ARROWS_CLASS = "@sm/card:flex";

export const CATEGORY_SECTION_GRID_ITEM_CLASS =
  "shrink-0 snap-start basis-[calc(50%-6px)] @sm/grid:basis-[calc(33.333%-8px)] @lg/grid:basis-[calc(25%-9px)]";

export const CATEGORY_SECTION_GRID_ARROWS_CLASS = "@sm/grid:flex";
