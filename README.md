# 카피 쿠팡

React와 TypeScript로 구현한 쿠팡 쇼핑몰 클론입니다. 상품 탐색부터 상품 상세, 장바구니, 체크아웃, 주문 상세, 마이페이지까지 주요 구매 흐름을 mock API로 확인할 수 있습니다.

## 기술 스택

| 영역        | 기술                                   |
| ----------- | -------------------------------------- |
| UI          | React 19, TypeScript 6, Tailwind CSS 4 |
| 라우팅      | React Router v7                        |
| 상태/서버   | Zustand 5, TanStack Query 5            |
| 인터랙션    | Framer Motion 12                       |
| UI 컴포넌트 | lucide-react                           |
| API mocking | MSW 2                                  |
| 빌드        | Vite 8                                 |

## 시작하기

```bash
npm install
npm run dev
npm test
npm run build
npm run lint
```

개발 서버에서는 MSW가 인증과 주문 API를 가로채므로 별도 백엔드 없이 다음 계정으로 로그인할 수 있습니다.

- 이메일: `test@example.com`
- 비밀번호: `password123`

## 구현 기능

- 홈 카테고리별 상품 탐색 및 상품 상세 이미지 갤러리
- 키워드 검색, 카테고리/가격 조건 기반 상품 필터, 정렬
- 장바구니 수량 변경, 삭제, 합계 계산
- 배송지 입력, 결제수단 선택, mock 주문 생성 및 주문 상세 이동
- 주문 상태별 주문 목록 필터
- 리뷰 mock 목록, 상품 찜 및 마이페이지 찜 목록
- 마이페이지 프로필과 배송지 추가/삭제/기본 배송지 설정
- 로그인/회원가입/주문 API mock 왕복

## 주요 경로

- `/`: 홈
- `/search`: 상품 검색 결과
- `/products/:id`: 상품 상세
- `/cart`: 장바구니
- `/checkout`: 체크아웃
- `/orders`: 주문 목록
- `/mypage`: 프로필, 배송지, 찜 목록

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
