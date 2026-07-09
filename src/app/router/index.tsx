import { Navigate, Route, Routes, useLocation } from "react-router";
import { AnimatePresence } from "framer-motion";
import { HomePage } from "@/pages/home";
import { OrdersPage } from "@/pages/orders";
import { ProductDetailPage } from "@/pages/product-detail";
import { SignupPage } from "@/pages/signup";
import { LoginPage } from "@/pages/login";
import { NotFoundPage } from "@/pages/not-found";
import { CartPage } from "@/pages/cart";
import { OrderDetailPage } from "@/pages/orders";
import { useAuthStore } from "@/features/auth/model/authStore";
import { PageTransition } from "@/app/ui/PageTransition";
import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import type { ReactNode } from "react";
import "@/app/styles/global.css";

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
        <Route
          path="/"
          element={
            <PageTransition>
              <Header />
              <HomePage />
              <Footer />
            </PageTransition>
          }
        />
        <Route
          path="/products/:id"
          element={
            <PageTransition>
              <Header />
              <ProductDetailPage />
              <Footer />
            </PageTransition>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Header />
                <CartPage />
                <Footer />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Header />
                <OrdersPage />
                <Footer />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Header />
                <OrderDetailPage />
                <Footer />
              </PageTransition>
            </ProtectedRoute>
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
          path="/login"
          element={
            <PageTransition>
              <LoginPage />
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
