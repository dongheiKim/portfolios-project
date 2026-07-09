import { BrowserRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "./providers";
import { AppRouter } from "./router";
import { ErrorBoundary } from "./error-boundary/ErrorBoundary";
import "./styles/global.css";

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {/* 키보드 접근성: 본문 바로가기 */}
          <a href="#main-content" className="skip-to-main">
            본문 바로가기
          </a>
          <AppRouter />
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
