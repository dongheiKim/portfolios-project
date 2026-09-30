import { BrowserRouter } from "react-router";
import { lazy, Suspense, useEffect, useRef } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/model/authStore";
import { useCartStore } from "@/features/cart/add-to-cart";
import { useWishlistStore } from "@/features/product/wishlist";
import { queryClient } from "./providers";
import { AppRouter } from "./router";
import { ErrorBoundary } from "./error-boundary/ErrorBoundary";
import { shouldClearUserScopedState } from "./model/accountTransition";
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
  const userId = useAuthStore((state) => state.user?.id ?? null);
  const previousToken = useRef(token);
  const previousUserId = useRef(userId);

  useEffect(() => {
    const accountChanged = shouldClearUserScopedState(
      previousUserId.current,
      userId,
    );
    const loggedOut = previousToken.current !== null && token === null;

    if (accountChanged) {
      useCartStore.getState().clearCart();
      useWishlistStore.getState().clearWishlist();
    }

    if (accountChanged || loggedOut) {
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
    previousUserId.current = userId;
  }, [token, userId]);

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
