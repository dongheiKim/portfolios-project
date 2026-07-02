import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { ProductList } from "@/widgets/product-list";

export function HomePage() {
  return (
    <div>
      <Header />
      <ProductList />
      <Footer />
    </div>
  );
}
