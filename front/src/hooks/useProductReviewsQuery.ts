"use client";

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { Review } from "@/types";

export function useProductReviewsQuery(
  productId: string,
  initialData?: Review[]
) {
  return useQuery<Review[]>({
    queryKey: ["productReviews", productId],
    queryFn: () => apiService.getProductReviews(productId),
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
  });
}
