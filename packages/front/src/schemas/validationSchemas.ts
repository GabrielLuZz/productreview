
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter pelo menos 3 caracteres'),
  description: z.string()
    .min(1, 'Descrição é obrigatória')
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  price: z.number()
    .min(0.01, 'Preço deve ser maior que zero'),
  category: z.string()
    .min(1, 'Categoria é obrigatória')
});

export const reviewSchema = z.object({
  author: z.string()
    .min(1, 'Nome do autor é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  rating: z.number()
    .min(1, 'Avaliação deve ser entre 1 e 5')
    .max(5, 'Avaliação deve ser entre 1 e 5'),
  comment: z.string()
    .min(1, 'Comentário é obrigatório')
    .min(5, 'Comentário deve ter pelo menos 5 caracteres')
});

export type ProductFormData = z.infer<typeof productSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
