import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { Outlet } from "react-router";

export function MainLayout() {
  return (
    <div className="app-container">
      <Header />
      <div className="content">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
