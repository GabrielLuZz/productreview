import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, renderStars } from "@/lib/utils";
import { apiService } from "@/services/api";
import { Product } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageClient } from "./PageClient";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const products: Product[] = await apiService.getProducts();

  return products.map((product) => ({
    id: product._id,
  }));
}

export default async function Page({ params }: { params: { id: string } }) {
  const product = await apiService.getProduct(params.id);

  if (!product) {
    notFound();
  }

  const productReviews = await apiService.getProductReviews(params.id);

  console.log(productReviews);

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card className="animate-in fade-in-0 slide-in-from-left-4 duration-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <Badge variant="secondary">{product.category}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{product.description}</p>
            <div className="text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </div>
            {product.averageRating !== undefined && (
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  {renderStars(product.averageRating, product._id)}
                </div>
                <span className="text-lg font-medium">
                  {product.averageRating.toFixed(1)}
                </span>
                <span className="text-muted-foreground">
                  ({product.totalReviews} avaliações)
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <PageClient
        productId={params.id}
        initialProductReviews={productReviews}
      />
    </main>
  );
}
