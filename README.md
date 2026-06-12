기술 스택 - React+TypeScript+Tailwind

## React 기반의 커머스 또는 콘텐츠 플랫폼

- **설명**: 검색 엔진 최적화(SEO)와 초기 로딩 속도가 중요한 **반응형 온라인 쇼핑몰**.
- **핵심 기술**: React Router, SSR/SSG 활용, TanStack Query (React Query).
- **보여줄 역량**: SEO 최적화, 웹 접근성 준수, 복잡한 필터링 및 페이지네이션 구현.

## 사용자 경험(UX) 중심의 대화형/엔터테인먼트 서비스

- **설명**: **인터랙티브한 기능**이 강조된 서비스.
- **핵심 기술**: WebSockets (Socket.io), WebRTC, Tailwind CSS, Framer Motion.
- **보여줄 역량**: 실시간 양방향 데이터 통신 처리, 애니메이션 최적화, 모바일 반응형 디자인.

## 프로젝트 핵심 구조

- **아키텍처**: FSD(Feature-Sliced Design) 기반으로 기능 중심 구조를 적용해 유지보수성과 확장성을 강화.
- **라우팅/데이터**: React Router v7 + TanStack Query로 페이지 전환과 서버 상태 관리를 최적화.
- **상태/실시간**: Zustand로 전역 상태를 단순화하고, Socket.io + simple-peer로 실시간/P2P 기능 구현.
- **UI/인터랙션**: Tailwind CSS와 Framer Motion(react-intersection-observer 포함)으로 반응형 UI와 인터랙션 구성.
- **개발 생산성**: Vite + TypeScript, 환경 변수 관리로 안정적 개발 환경 유지.

## FSD 주요 폴더 구조

```
src/
├── app/             # 앱 초기화, 라우팅, 전역 스타일, providers
├── processes/       # (선택) 여러 페이지/기능을 아우르는 장기 플로우
├── pages/           # 라우트 단위 페이지 컴포지션
├── widgets/         # 페이지를 구성하는 독립 UI 블록
├── features/        # 사용자 시나리오 단위 기능 (예: 장바구니 추가)
├── entities/        # 핵심 도메인 엔티티 (예: user, product)
└── shared/          # 재사용 자원 (ui, lib, api, config, types)
```
