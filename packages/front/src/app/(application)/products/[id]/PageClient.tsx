"use client";

import ConfirmationModal from "@/components/ConfirmationModal";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import { Button } from "@/components/ui/button";
import { useProductReviewsMutations } from "@/hooks/useProductReviewsMutations";
import { useProductReviewsQuery } from "@/hooks/useProductReviewsQuery";
import { ReviewFormData } from "@/schemas/validationSchemas";
import { Product, Review } from "@/types";
import { Plus } from "lucide-react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { productGateway } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice, renderStars } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PageClientProps {
  productId: string;
  initialProductReviews: Review[];
  initialProductData: Product;
}

export const PageClient = ({
  productId,
  initialProductReviews,
  initialProductData,
}: PageClientProps) => {
  const [showForm, setShowForm] = React.useState(false);
  const [editingProductReview, setEditingProductReview] = React.useState<
    Review | undefined
  >();
  const [deletingReview, setDeletingReview] = React.useState<{
    reviewId: string;
    productId: string;
  } | null>(null);

  const { data: product } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => productGateway.getById(productId),
    initialData: initialProductData,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  React.useEffect(() => {
    if (product) {
      console.log('Client Product Data (from useQuery):', product);
    }
  }, [product]);

  const { data: productReviews } = useProductReviewsQuery(
    productId,
    initialProductReviews
  );

  console.log(productReviews);

  const { createProductReview, updateProductReview, deleteProductReview } =
    useProductReviewsMutations({
      onSuccessCreate: () => setShowForm(false),
      onSuccessUpdate: () => {
        setShowForm(false);
        setEditingProductReview(undefined);
      },
      onSuccessDelete: () => setDeletingReview(null),
    });

  // Funções de ação
  const handleCreateProductReview = (data: ReviewFormData) => {
    createProductReview.mutate({ ...data, productId });
  };

  const handleEditProductReview = (data: ReviewFormData) => {
    if (!editingProductReview) return;
    updateProductReview.mutate({ id: editingProductReview.id, data });
  };

  const handleDeleteProductReview = () => {
    if (!deletingReview) return;
    deleteProductReview.mutate(deletingReview);
  };

  const handleEdit = (review: Review) => {
    setEditingProductReview(review);
    setShowForm(true);
  };

  const handleDeleteClick = (reviewId: string, associatedProductId: string) => {
    setDeletingReview({
      reviewId,
      productId: associatedProductId,
    });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProductReview(undefined);
  };

 

  return (
    <>
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
                  {renderStars(product.averageRating, product.id)}
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

      <section className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
        <header className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Avaliações</h2>
          <Button
            onClick={() => setShowForm(true)}
            className="hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Avaliação
          </Button>
        </header>

        {productReviews?.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Ainda não há avaliações para este produto.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {productReviews?.map((review) => (
              <div
                key={review.id}
                className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
              >
                <ReviewCard
                  review={review}
                  onEdit={handleEdit}
                  onDelete={(reviewId) => handleDeleteClick(reviewId, productId)}
                />
              </div>
            ))}
          </div>
        )}

        {productId && (
          <ReviewForm
            productId={productId}
            review={editingProductReview}
            isOpen={showForm}
            onClose={handleCancelForm}
            onSubmit={
              editingProductReview
                ? handleEditProductReview
                : handleCreateProductReview
            }
            isLoading={
              editingProductReview
                ? updateProductReview.isPending
                : createProductReview.isPending
            }
          />
        )}

        <ConfirmationModal
          isOpen={!!deletingReview}
          onClose={() => setDeletingReview(null)}
          onConfirm={handleDeleteProductReview}
          title="Excluir Avaliação"
          description="Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita."
          confirmText="Excluir"
          cancelText="Cancelar"
        />
      </section>
    </>
  );
};
