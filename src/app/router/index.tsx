import { HomePage } from "@/pages/home";
import { OrdersPage } from "@/pages/orders";
import { ProductDetailPage } from "@/pages/product-detail";
import { SignupPage } from "@/pages/signup";
import { LoginPage } from "@/pages/login";
import { NotFoundPage } from "@/pages/not-found";
import "@/app/styles/global.css";

export const AppRouters = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/orders",
    element: <OrdersPage />,
  },
  {
    path: "/product-detail",
    element: <ProductDetailPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/*",
    element: <NotFoundPage />,
  },
];
