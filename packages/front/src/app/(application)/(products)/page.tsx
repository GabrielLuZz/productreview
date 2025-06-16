import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { PageClient } from "./PageClient";
import { productGateway } from "@/services/api";

export default async function Home() {
  const products = await productGateway.getAll();
  console.log(products.length,products);

  return (
    <main className="wrapper">
      <AppBreadcrumb waysList={[{ label: "produtos" }]} />

      <PageClient initialProducts={products} />
    </main>
  );
}
