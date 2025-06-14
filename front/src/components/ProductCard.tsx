import React from "react";
import { Product } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatPrice, renderStars } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  index: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  index,
}) => {
  const router = useRouter();

  return (
    <Card className="h-full flex flex-col animate-in fade-in-0 slide-in-from-bottom-4 duration-500 hover:shadow-lg transition-all hover:-translate-y-1">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <Badge variant="secondary">{product.category}</Badge>
        </div>
        <CardDescription className="line-clamp-2">
          {product.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="space-y-2">
          <div className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </div>

          {product.averageRating !== undefined && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(product.averageRating, product._id)}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.averageRating.toFixed(1)} ({product.totalReviews}{" "}
                avaliações)
              </span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 justify-between">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
          onClick={() => router.push(`/products/${product._id}`)}
        >
          <Eye className="w-4 h-4 mr-1" />
          Ver
        </Button>
        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 transition-colors"
            onClick={() => onEdit(product)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
            onClick={() => onDelete(product._id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
