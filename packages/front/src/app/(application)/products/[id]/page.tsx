import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { Button } from "@/components/ui/button";
import { productGateway, reviewGateway } from "@/services/api";
import { Product, Review } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageClient } from "./PageClient";
import { notFound } from "next/navigation";

// export async function generateStaticParams() {
//   const products: Product[] = await productGateway.getAll();

//   return products.map((product) => ({
//     id: product.id,
//   }));
// }

export default async function Page({ params }: { params: { id: string } }) {
  let product: Product;
  let productReviews: Review[];

  try {
    product = await productGateway.getById(params.id);
    console.log("Server Product Data:", product);
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }

  try {
    productReviews = await reviewGateway.getByProductId(params.id);
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    productReviews = [];
  }

  return (
    <main className="wrapper">
      <AppBreadcrumb
        waysList={[{ label: "produtos", link: "/" }, { label: product.name }]}
      />

      <Link href="/" className="block mb-6">
        <Button variant="ghost" className="hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para produtos
        </Button>
      </Link>

      <PageClient
        productId={params.id}
        initialProductReviews={productReviews}
        initialProductData={product}
      />
    </main>
  );
}
