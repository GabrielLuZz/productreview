"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
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
      apiService.createReview(productReviewData),
    onSuccess: async (newProductReview: Review) => {
      queryClient.setQueryData(
        ["productReviews", newProductReview.productId],
        (reviews: Review[]) => [...(reviews ?? []), newProductReview]
      );
      await queryClient.invalidateQueries({ queryKey: ["productReviews"] });
      toast.success("Avaliação criada com sucesso!");
      onSuccessCreate?.();
    },
    onError: () => {
      toast.error("Erro ao criar avaliação");
    },
  });

  const updateProductReview = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReviewFormData }) =>
      apiService.updateReview(id, data),
    onSuccess: async (newProductReview: Review) => {
      queryClient.setQueryData(
        ["productReviews", newProductReview.productId],
        (productReviews: Review[]) =>
          productReviews?.map((productReview) =>
            productReview._id === newProductReview._id
              ? newProductReview
              : productReview
          )
      );

      await queryClient.invalidateQueries({ queryKey: ["productReviews"] });
      toast.success("Avaliação atualizado com sucesso!");
      onSuccessUpdate?.();
    },
    onError: () => {
      toast.error("Erro ao atualizar avaliação");
    },
  });

  const deleteProductReview = useMutation({
    mutationFn: (id: string) => apiService.deleteReview(id),
    onSuccess: async (deletedProductReview: Review) => {
      await queryClient.invalidateQueries({
        queryKey: ["productReviews", deletedProductReview.productId],
      });
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
