"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService } from "@/services/api";
import { ProductFormData } from "@/schemas/validationSchemas";
import { toast } from "sonner";
import { CreateProductRequest, Product } from "@/types";

export function useProductsMutations({
  onSuccessCreate,
  onSuccessUpdate,
  onSuccessDelete,
}: {
  onSuccessCreate?: () => void;
  onSuccessUpdate?: () => void;
  onSuccessDelete?: () => void;
} = {}) {
  const queryClient = useQueryClient();

  const createProduct = useMutation({
    mutationFn: (productData: CreateProductRequest) =>
      apiService.createProduct(productData),
    onSuccess: async (newProduct: Product) => {
      queryClient.setQueryData(["products"], (products: Product[]) => [
        ...products,
        newProduct,
      ]);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto criado com sucesso!");
      onSuccessCreate?.();
    },
    onError: () => {
      toast.error("Erro ao criar produto");
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormData }) =>
      apiService.updateProduct(id, data),
    onSuccess: async (newProduct: Product) => {
      queryClient.setQueryData(["products"], (products: Product[]) =>
        products.map((product) =>
          product._id === newProduct._id ? newProduct : product
        )
      );

      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto atualizado com sucesso!");
      onSuccessUpdate?.();
    },
    onError: () => {
      toast.error("Erro ao atualizar produto");
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => apiService.deleteProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto excluído com sucesso!");
      onSuccessDelete?.();
    },
    onError: () => {
      toast.error("Erro ao excluir produto");
    },
  });

  return {
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
