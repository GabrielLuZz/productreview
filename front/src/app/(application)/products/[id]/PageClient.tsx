"use client";

import ConfirmationModal from "@/components/ConfirmationModal";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";
import { Button } from "@/components/ui/button";
import { useProductReviewsMutations } from "@/hooks/useProductReviewsMutations";
import { useProductReviewsQuery } from "@/hooks/useProductReviewsQuery";
import { ReviewFormData } from "@/schemas/validationSchemas";
import { Review } from "@/types";
import { Plus } from "lucide-react";
import React from "react";

interface PageClientProps {
  productId: string;
  initialProductReviews: Review[];
}

export const PageClient = ({
  productId,
  initialProductReviews,
}: PageClientProps) => {
  const [showForm, setShowForm] = React.useState(false);
  const [editingProductReview, setEditingProductReview] = React.useState<
    Review | undefined
  >();
  const [deletingProductReviewId, setDeletingProductReviewId] = React.useState<
    string | null
  >(null);

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
      onSuccessDelete: () => setDeletingProductReviewId(null),
    });

  // Funções de ação
  const handleCreateProductReview = (data: ReviewFormData) => {
    const newProductReview = {
      ...data,
      productId,
    };
    createProductReview.mutate(newProductReview);
  };

  const handleEditProductReview = (data: ReviewFormData) => {
    if (!editingProductReview) return;
    updateProductReview.mutate({ id: editingProductReview._id, data });
  };

  const handleDeleteProductReview = () => {
    if (!deletingProductReviewId) return;
    deleteProductReview.mutate(deletingProductReviewId);
  };

  const handleEdit = (productReview: Review) => {
    setEditingProductReview(productReview);
    setShowForm(true);
  };

  const handleDeleteClick = (productReviewId: string) => {
    setDeletingProductReviewId(productReviewId);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProductReview(undefined);
  };

  return (
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
          {productReviews?.map((review, index) => (
            <div
              key={review._id}
              className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500"
            >
              <ReviewCard
                review={review}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
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
        isOpen={!!deletingProductReviewId}
        onClose={() => setDeletingProductReviewId(null)}
        onConfirm={handleDeleteProductReview}
        title="Excluir Avaliação"
        description="Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </section>
  );
};
