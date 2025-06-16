"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productGateway } from "@/services/api";
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
      productGateway.create(productData),
    onSuccess: async (newProduct: Product) => {
      queryClient.setQueryData(["products"], (products: Product[]) => [
        ...(products ?? []),
        newProduct,
      ]);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await fetch('/api/revalidate?tag=products');
      toast.success("Produto criado com sucesso!");
      onSuccessCreate?.();
    },
    onError: () => {
      toast.error("Erro ao criar produto");
    },
  });

  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProductFormData }) =>
      productGateway.update(id, data),
    onSuccess: async (newProduct: Product) => {
      queryClient.setQueryData(["products"], (products: Product[]) =>
        products.map((product) =>
          product.id === newProduct.id ? newProduct : product
        )
      );
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["product", newProduct.id] });
      await fetch('/api/revalidate?tag=products');
      await fetch(`/api/revalidate?tag=product-${newProduct.id}`);
      toast.success("Produto atualizado com sucesso!");
      onSuccessUpdate?.();
    },
    onError: () => {
      toast.error("Erro ao atualizar produto");
    },
  });

  const deleteProduct = useMutation({
    mutationFn: (id: string) => productGateway.delete(id),
    onSuccess: async (deletedProduct: Product) => {
      queryClient.setQueryData(["products"], (products: Product[]) =>
        products.filter((product) => product.id !== deletedProduct.id)
      );
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await queryClient.invalidateQueries({ queryKey: ["product", deletedProduct.id] });
      await fetch('/api/revalidate?tag=products');
      await fetch(`/api/revalidate?tag=product-${deletedProduct.id}`);
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
