import { BrowserRouter } from "react-router";
import { lazy, Suspense, useEffect, useRef } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/model/authStore";
import { queryClient } from "./providers";
import { AppRouter } from "./router";
import { ErrorBoundary } from "./error-boundary/ErrorBoundary";
import "./styles/global.css";

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then(
        ({ ReactQueryDevtools }) => ({
          default: ReactQueryDevtools,
        }),
      ),
    )
  : null;

export function App() {
  const token = useAuthStore((state) => state.token);
  const previousToken = useRef(token);

  useEffect(() => {
    if (previousToken.current && !token) {
      queryClient.removeQueries({
        predicate: ({ queryKey }) => {
          const rootKey = queryKey[0];
          return (
            rootKey === "orders" ||
            rootKey === "order" ||
            rootKey === "header-orders-preview" ||
            rootKey === "cart-products" ||
            rootKey === "checkout-products"
          );
        },
      });
    }

    previousToken.current = token;
  }, [token]);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
        {ReactQueryDevtools && (
          <Suspense fallback={null}>
            <ReactQueryDevtools initialIsOpen={false} />
          </Suspense>
        )}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
