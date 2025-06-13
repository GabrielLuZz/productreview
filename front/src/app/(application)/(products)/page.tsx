import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { PageClient } from "./PageClient";
import { apiService } from "@/services/api";

export default async function Home() {
  const products = await apiService.getProducts();

  return (
    <main className="wrapper">
      <AppBreadcrumb waysList={[{ label: "produtos" }]} />

      <PageClient initialProducts={products} />
    </main>
  );
}
