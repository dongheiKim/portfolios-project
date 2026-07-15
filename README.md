# 카피 쿠팡

[라이브 데모](url) · [스크린샷](#)

## 기술 스택

| 영역        | 기술                                   |
| ----------- | -------------------------------------- |
| UI          | React 19, TypeScript 6, Tailwind CSS 4 |
| 라우팅      | React Router v7                        |
| 상태/서버   | Zustand 5, TanStack Query 5            |
| 실시간      | Socket.io, simple-peer                 |
| 인터랙션    | Framer Motion 12, @hello-pangea/dnd    |
| UI 컴포넌트 | Radix UI, lucide-react                 |
| 빌드        | Vite 8                                 |

## 시작하기

```bash
npm install
npm run dev
```

## FSD 주요 폴더 구조

```
src/
├── app/ # 앱 초기화, 라우팅, 전역 스타일, providers
├── processes/ # (선택) 여러 페이지/기능을 아우르는 장기 플로우
├── pages/ # 라우트 단위 페이지 컴포지션
├── widgets/ # 페이지를 구성하는 독립 UI 블록
├── features/ # 사용자 시나리오 단위 기능 (예: 장바구니 추가)
├── entities/ # 핵심 도메인 엔티티 (예: user, product)
└── shared/ # 재사용 자원 (ui, lib, api, config, types)
```
