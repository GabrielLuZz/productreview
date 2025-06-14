import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

export const formatDate = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), {
      addSuffix: true,
      locale: ptBR,
    });
  } catch {
    return "Data inválida";
  }
};

export const renderStars = (rating: number, id: string) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star
        key={`stars-${id}-${i}`}
        className="w-4 h-4 fill-yellow-400 text-yellow-400"
      />
    );
  }

  if (hasHalfStar) {
    stars.push(
      <Star
        key={`half-star-${id}`}
        className="w-4 h-4 fill-yellow-400/50 text-yellow-400"
      />
    );
  }

  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star key={`empty-stars-${id}-${i}`} className="w-4 h-4 text-gray-300" />
    );
  }

  return stars;
};
