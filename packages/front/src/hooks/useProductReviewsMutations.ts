"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewGateway } from "@/services/api";
import { toast } from "sonner";
import { CreateReviewRequest, Review } from "@/types";
import { ReviewFormData } from "@/schemas/validationSchemas";

export function useProductReviewsMutations({
  onSuccessCreate,
  onSuccessUpdate,
  onSuccessDelete,
}: {
  onSuccessCreate?: () => void;
  onSuccessUpdate?: () => void;
  onSuccessDelete?: () => void;
} = {}) {
  const queryClient = useQueryClient();

  const createProductReview = useMutation({
    mutationFn: (productReviewData: CreateReviewRequest) =>
      reviewGateway.create(productReviewData),
    onSuccess: async (newProductReview: Review) => {
      queryClient.setQueryData(
        ["productReviews", newProductReview.productId],
        (reviews: Review[]) => [...(reviews ?? []), newProductReview]
      );
      await queryClient.invalidateQueries({ queryKey: ["productReviews", newProductReview.productId] });
      await queryClient.invalidateQueries({ queryKey: ["product", newProductReview.productId] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await fetch('/api/revalidate?tag=products');
      await fetch(`/api/revalidate?tag=product-${newProductReview.productId}`);
      await fetch(`/api/revalidate?tag=product-${newProductReview.productId}-reviews`);
      toast.success("Avaliação criada com sucesso!");
      onSuccessCreate?.();
    },
    onError: () => {
      toast.error("Erro ao criar avaliação");
    },
  });

  const updateProductReview = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReviewFormData }) =>
      reviewGateway.update(id, data),
    onSuccess: async (newProductReview: Review) => {
      queryClient.setQueryData(
        ["productReviews", newProductReview.productId],
        (productReviews: Review[]) =>
          productReviews?.map((productReview) =>
            productReview.id === newProductReview.id
              ? newProductReview
              : productReview
          )
      );

      await queryClient.invalidateQueries({ queryKey: ["productReviews", newProductReview.productId] });
      await queryClient.invalidateQueries({ queryKey: ["product", newProductReview.productId] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await fetch('/api/revalidate?tag=products');
      await fetch(`/api/revalidate?tag=product-${newProductReview.productId}`);
      await fetch(`/api/revalidate?tag=product-${newProductReview.productId}-reviews`);
      toast.success("Avaliação atualizado com sucesso!");
      onSuccessUpdate?.();
    },
    onError: () => {
      toast.error("Erro ao atualizar avaliação");
    },
  });

  const deleteProductReview = useMutation({
    mutationFn: ({ reviewId, productId }: { reviewId: string; productId: string }) =>
      reviewGateway.delete(reviewId, productId),
    onSuccess: async (_, { productId, reviewId }) => {
      await queryClient.invalidateQueries({ queryKey: ["productReviews", productId] });
      await queryClient.invalidateQueries({ queryKey: ["product", productId] });
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await fetch('/api/revalidate?tag=products');
      await fetch(`/api/revalidate?tag=product-${productId}`);
      await fetch(`/api/revalidate?tag=product-${productId}-reviews`);
      await fetch(`/api/revalidate?tag=review-${reviewId}`);
      toast.success("Avaliação excluída com sucesso!");
      onSuccessDelete?.();
    },
    onError: () => {
      toast.error("Erro ao excluir avaliação");
    },
  });

  return {
    createProductReview,
    updateProductReview,
    deleteProductReview,
  };
}
