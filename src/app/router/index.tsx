import { Navigate, Route, Routes, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import { MainLayout } from "@/app/layouts/MainLayout";
import { HomePage } from "@/pages/home";
import { ProductDetailPage } from "@/pages/product-detail";
import { CartPage } from "@/pages/cart";
import { LoginPage } from "@/pages/login";
import { SignupPage } from "@/pages/signup";
import { NotFoundPage } from "@/pages/not-found";
import { OrdersPage, OrderDetailPage } from "@/pages/orders";
import { useAuthStore } from "@/features/auth/model/authStore";
import { PageTransition } from "@/app/ui/PageTransition";
import type { ReactNode } from "react";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/products/:id"
            element={
              <PageTransition>
                <ProductDetailPage />
              </PageTransition>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <CartPage />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <OrdersPage />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <OrderDetailPage />
                </PageTransition>
              </ProtectedRoute>
            }
          />
        </Route>
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <SignupPage />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFoundPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
