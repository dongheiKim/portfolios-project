export const LOGIN_PAGE_COPY = {
  badge: "PORTFOLIOS STORE",
  titleLine1: "다시 오신 것을 환영합니다.",
  titleLine2: "로그인하고 쇼핑을 이어가세요.",
  description:
    "최근 본 상품과 장바구니, 주문 내역을 계정과 함께 안전하게 보관합니다.",
  formTitle: "로그인",
  formDescription: "이메일과 비밀번호를 입력해 계정에 접속하세요.",
  switchDescription: "처음 오셨나요?",
  switchAction: "회원가입하기",
} as const;

export const LOGIN_PAGE_STYLES = {
  page: "min-h-screen bg-[radial-gradient(circle_at_top,_#eef4ff_0%,_#f8fbff_42%,_#ffffff_100%)] px-4 py-12",
  wrapper:
    "mx-auto flex w-full max-w-5xl flex-col gap-8 md:flex-row md:items-center md:justify-between",
  hero: "max-w-xl space-y-4",
  badge:
    "inline-flex rounded-full bg-[#e8efff] px-4 py-1 text-xs font-bold tracking-[0.08em] text-[#2750d6]",
  heading: "text-3xl font-extrabold leading-tight text-[#0f172a] md:text-4xl",
  description: "text-sm leading-6 text-[#475569] md:text-base",
  panel:
    "w-full max-w-md rounded-3xl border border-[#e2e8f0] bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] md:p-8",
  panelHeader: "mb-6",
  panelTitle: "text-2xl font-bold text-[#0f172a]",
  panelDescription: "mt-2 text-sm text-[#64748b]",
  switchText: "mt-6 text-center text-sm text-[#64748b]",
  switchLink: "font-semibold text-[#346aff] hover:underline",
} as const;
