import { QueryClient } from "@tanstack/react-query";

// 앱 전역에서 사용하는 React Query 기본 동작을 정의합니다.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 요청 실패 시 재시도
      retry: 3,
      // 5분 동안 fresh 상태를 유지해 불필요한 재요청을 줄임
      staleTime: 1000 * 60 * 5,
      // 탭 포커스 복귀 시 자동 재요청 비활성화
      refetchOnWindowFocus: false,
    },
    mutations: {
      // mutation 에러를 공통 포맷으로 로깅
      onError: (error: unknown) => {
        const message =
          error instanceof Error ? error.message : "오류가 발생했습니다.";
        console.error("[Mutation Error]", message);
      },
    },
  },
});
