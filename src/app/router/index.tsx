import { Navigate, Route, Routes, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense, type ReactNode } from "react";
import { MainLayout } from "@/app/layouts/MainLayout";
import { useAuthStore } from "@/features/auth/model/authStore";
import { PageTransition } from "@/app/ui/PageTransition";

const HomePage = lazy(() =>
  import("@/pages/home").then(({ HomePage }) => ({ default: HomePage })),
);
const ProductDetailPage = lazy(() =>
  import("@/pages/product-detail").then(({ ProductDetailPage }) => ({
    default: ProductDetailPage,
  })),
);
const SearchPage = lazy(() =>
  import("@/pages/search").then(({ SearchPage }) => ({ default: SearchPage })),
);
const CartPage = lazy(() =>
  import("@/pages/cart").then(({ CartPage }) => ({ default: CartPage })),
);
const CheckoutPage = lazy(() =>
  import("@/pages/checkout").then(({ CheckoutPage }) => ({
    default: CheckoutPage,
  })),
);
const MyPage = lazy(() =>
  import("@/pages/mypage").then(({ MyPage }) => ({ default: MyPage })),
);
const LoginPage = lazy(() =>
  import("@/pages/login").then(({ LoginPage }) => ({ default: LoginPage })),
);
const SignupPage = lazy(() =>
  import("@/pages/signup").then(({ SignupPage }) => ({ default: SignupPage })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/not-found").then(({ NotFoundPage }) => ({
    default: NotFoundPage,
  })),
);
const OrdersPage = lazy(() =>
  import("@/pages/orders").then(({ OrdersPage }) => ({ default: OrdersPage })),
);
const OrderDetailPage = lazy(() =>
  import("@/pages/orders").then(({ OrderDetailPage }) => ({
    default: OrderDetailPage,
  })),
);

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const location = useLocation();

  if (!hasHydrated) {
    return (
      <div
        className="flex min-h-[40vh] items-center justify-center bg-[#f4f7fb] px-4 text-sm text-[#64748b]"
        role="status"
        aria-live="polite"
      >
        로그인 상태를 확인하고 있습니다.
      </div>
    );
  }

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }
  return <>{children}</>;
}

function renderPage(page: ReactNode) {
  return (
    <Suspense
      fallback={
        <div
          className="flex min-h-[40vh] items-center justify-center bg-[#f4f7fb] px-4 text-sm text-[#64748b]"
          role="status"
        >
          페이지를 불러오는 중입니다.
        </div>
      }
    >
      <PageTransition>{page}</PageTransition>
    </Suspense>
  );
}

export function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route path="/" element={renderPage(<HomePage />)} />
          <Route
            path="/products/:id"
            element={renderPage(<ProductDetailPage />)}
          />
          <Route path="/search" element={renderPage(<SearchPage />)} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>{renderPage(<CartPage />)}</ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>{renderPage(<CheckoutPage />)}</ProtectedRoute>
            }
          />
          <Route
            path="/mypage"
            element={<ProtectedRoute>{renderPage(<MyPage />)}</ProtectedRoute>}
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>{renderPage(<OrdersPage />)}</ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>{renderPage(<OrderDetailPage />)}</ProtectedRoute>
            }
          />
        </Route>
        <Route path="/login" element={renderPage(<LoginPage />)} />
        <Route path="/signup" element={renderPage(<SignupPage />)} />
        <Route path="*" element={renderPage(<NotFoundPage />)} />
      </Routes>
    </AnimatePresence>
  );
}
