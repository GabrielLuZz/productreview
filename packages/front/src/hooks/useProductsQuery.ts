"use client";

import { useQuery } from "@tanstack/react-query";
import { productGateway } from "@/services/api";
import { Product } from "@/types";

export function useProductsQuery(initialData?: Product[]) {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: productGateway.getAll,
    initialData,
    staleTime: 0, // Sempre re-buscar no cliente para evitar hidratação inconsistente
    refetchOnWindowFocus: true,
  });
}
