import React, { useEffect } from "react";
import { Review } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reviewSchema, ReviewFormData } from "@/schemas/validationSchemas";

interface ReviewFormProps {
  productId: string;
  review?: Review;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewFormData & { productId: string }) => void;
  isLoading?: boolean;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  review,
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      author: "",
      rating: 5,
      comment: "",
    },
  });

  useEffect(() => {
    if (review) {
      reset({
        author: review.author,
        rating: review.rating,
        comment: review.comment,
      });
    }
  }, [review, reset]);

  useEffect(() => {
    if (isOpen === false) {
      reset({
        author: "",
        rating: 5,
        comment: "",
      });
    }
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: ReviewFormData) => {
    await onSubmit({ ...data, productId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="animate-in fade-in-0 zoom-in-95 duration-300 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {review ? "Editar Avaliação" : "Nova Avaliação"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="author">Nome do Avaliador</Label>
            <Input
              id="author"
              {...register("author")}
              placeholder="Digite seu nome"
            />
            {errors.author && (
              <p className="text-sm text-red-600">{errors.author.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Avaliação</Label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className="focus:outline-none"
                      onClick={() => field.onChange(rating)}
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          rating <= field.value
                            ? "fill-yellow-400 text-yellow-400 hover:fill-yellow-500 hover:text-yellow-500"
                            : "text-gray-300 hover:text-yellow-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({field.value} de 5 estrelas)
                  </span>
                </div>
              )}
            />
            {errors.rating && (
              <p className="text-sm text-red-600">{errors.rating.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comentário</Label>
            <Textarea
              id="comment"
              {...register("comment")}
              placeholder="Compartilhe sua experiência com o produto"
              rows={4}
            />
            {errors.comment && (
              <p className="text-sm text-red-600">{errors.comment.message}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : "Salvar Avaliação"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewForm;
