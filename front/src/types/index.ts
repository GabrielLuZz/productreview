
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: string;
  averageRating?: number;
  totalReviews?: number;
}

export interface Review {
  _id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface CreateReviewRequest {
  productId: string;
  author: string;
  rating: number;
  comment: string;
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}
export interface UpdateReviewRequest extends Partial<Omit<CreateReviewRequest, 'productId'>> {}
