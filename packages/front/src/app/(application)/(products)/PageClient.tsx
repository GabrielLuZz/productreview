"use client";

import ConfirmationModal from "@/components/ConfirmationModal";
import ProductCard from "@/components/ProductCard";
import ProductForm from "@/components/ProductForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductsMutations } from "@/hooks/useProductsMutations";
import { useProductsQuery } from "@/hooks/useProductsQuery";
import { ProductFormData } from "@/schemas/validationSchemas";
import { Product } from "@/types";
import { Plus, Search } from "lucide-react";
import React from "react";

interface PageClientProps {
  initialProducts: Product[];
}

export const PageClient = ({ initialProducts }: PageClientProps) => {
  const [showForm, setShowForm] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [editingProduct, setEditingProduct] = React.useState<
    Product | undefined
  >();
  const [deletingProductId, setDeletingProductId] = React.useState<
    string | null
  >(null);

  const { data: products } = useProductsQuery(initialProducts);

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
console.log(initialProducts)
  console.log(products)
  

  const { createProduct, updateProduct, deleteProduct } = useProductsMutations({
    onSuccessCreate: () => setShowForm(false),
    onSuccessUpdate: () => {
      setShowForm(false);
      setEditingProduct(undefined);
    },
    onSuccessDelete: () => setDeletingProductId(null),
  });

  // Funções de ação
  const handleCreateProduct = (data: ProductFormData) => {
    createProduct.mutate(data);
  };

  const handleEditProduct = (data: ProductFormData) => {
    if (!editingProduct) return;
    updateProduct.mutate({ id: editingProduct.id, data });
  };

  const handleDeleteProduct = () => {
    if (!deletingProductId) return;
    deleteProduct.mutate(deletingProductId);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteClick = (productId: string) => {
    setDeletingProductId(productId);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProduct(undefined);
  };

  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Produtos</h1>
        <Button
          onClick={() => setShowForm(true)}
          className="hover:scale-105 transition-transform"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Produto
        </Button>
      </header>

      <section className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Pesquisar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </section>

      {filteredProducts?.length === 0 ? (
        <section className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm
              ? "Nenhum produto encontrado."
              : "Nenhum produto cadastrado."}
          </p>
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts?.map((product, index) => (
            <ProductCard
              key={`${product.id}-${index}`}
              product={product}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </section>
      )}

      <ProductForm
        product={editingProduct}
        isOpen={showForm}
        onClose={handleCancelForm}
        onSubmit={editingProduct ? handleEditProduct : handleCreateProduct}
        isLoading={
          editingProduct ? updateProduct.isPending : createProduct.isPending
        }
      />

      <ConfirmationModal
        isOpen={!!deletingProductId}
        onClose={() => setDeletingProductId(null)}
        onConfirm={handleDeleteProduct}
        title="Excluir Produto"
        description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
      />
    </>
  );
};
