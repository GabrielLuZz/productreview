"use client";

import { useQuery } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { Product } from "@/types";

export function useProductsQuery(initialData?: Product[]) {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: apiService.getProducts,
    initialData,
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
  });
}
