// Adapter HTTP genérico usando fetch
const API_BASE_URL = "http://back:8081/v1";

interface HttpRequest {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
  tag?: string;
}

interface HttpResponse<T = any> {
  status: number;
  data: T;
}

const fetchHttpAdapter = async <T>({
  url,
  method,
  body,
  headers,
  tag,
}: HttpRequest): Promise<HttpResponse<T>> => {
  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    next: tag ? { tags: [tag] } : undefined,
  });

  const data = response.status !== 204 ? await response.json() : undefined;

  // Se a resposta for erro (status >= 400) ou tiver statusCode, lança erro
  if (
    !response.ok ||
    (data && typeof data === "object" && "statusCode" in data)
  ) {
    throw {
      status: response.status,
      ...(typeof data === "object" ? data : { message: response.statusText }),
    };
  }

  return { status: response.status, data };
};

// Gateways
import {
  Product,
  Review,
  CreateProductRequest,
  CreateReviewRequest,
  UpdateProductRequest,
  UpdateReviewRequest,
} from "@/types";

// Product Gateway
interface ProductGateway {
  getAll(): Promise<Product[]>;
  getById(id: string): Promise<Product>;
  create(product: CreateProductRequest): Promise<Product>;
  update(id: string, updates: UpdateProductRequest): Promise<Product>;
  delete(id: string): Promise<Product>;
}

class ProductApiGateway implements ProductGateway {
  async getAll(): Promise<Product[]> {
    const { data } = await fetchHttpAdapter<Product[]>({
      url: `${API_BASE_URL}/products`,
      method: "GET",
      tag: "products",
    });
    return data;
  }
  async getById(id: string): Promise<Product> {
    const { data } = await fetchHttpAdapter<Product>({
      url: `${API_BASE_URL}/products/${id}`,
      method: "GET",
      tag: `product-${id}`,
    });
    return data;
  }
  async create(product: CreateProductRequest): Promise<Product> {
    const { data } = await fetchHttpAdapter<Product>({
      url: `${API_BASE_URL}/products`,
      method: "POST",
      body: product,
      tag: "products",
    });
    return data;
  }
  async update(id: string, updates: UpdateProductRequest): Promise<Product> {
    const { data } = await fetchHttpAdapter<Product>({
      url: `${API_BASE_URL}/products/${id}`,
      method: "PATCH",
      body: updates,
      tag: `product-${id}`,
    });
    return data;
  }
  async delete(id: string): Promise<Product> {
    const { data } = await fetchHttpAdapter<Product>({
      url: `${API_BASE_URL}/products/${id}`,
      method: "DELETE",
      tag: `product-${id}`,
    });
    return data;
  }
}

// Review Gateway
interface ReviewGateway {
  getAll(): Promise<Review[]>;
  getById(id: string): Promise<Review>;
  getByProductId(productId: string): Promise<Review[]>;
  create(review: CreateReviewRequest): Promise<Review>;
  update(id: string, updates: UpdateReviewRequest): Promise<Review>;
  delete(reviewId: string, productId: string): Promise<void>;
}

class ReviewApiGateway implements ReviewGateway {
  async getAll(): Promise<Review[]> {
    const { data } = await fetchHttpAdapter<Review[]>({
      url: `${API_BASE_URL}/reviews`,
      method: "GET",
      tag: "reviews",
    });
    return data;
  }
  async getById(id: string): Promise<Review> {
    const { data } = await fetchHttpAdapter<Review>({
      url: `${API_BASE_URL}/reviews/${id}`,
      method: "GET",
      tag: `review-${id}`,
    });
    return data;
  }
  async getByProductId(productId: string): Promise<Review[]> {
    const { data } = await fetchHttpAdapter<Review[]>({
      url: `${API_BASE_URL}/products/${productId}/reviews`,
      method: "GET",
      tag: `product-${productId}-reviews`,
    });
    return data;
  }
  async create(review: CreateReviewRequest): Promise<Review> {
    const { data } = await fetchHttpAdapter<Review>({
      url: `${API_BASE_URL}/reviews`,
      method: "POST",
      body: review,
      tag: `product-${review.productId}-reviews`,
    });
    return data;
  }
  async update(id: string, updates: UpdateReviewRequest): Promise<Review> {
    const { data } = await fetchHttpAdapter<Review>({
      url: `${API_BASE_URL}/reviews/${id}`,
      method: "PATCH",
      body: updates,
      tag: `review-${id}`,
    });
    return data;
  }
  async delete(reviewId: string): Promise<void> {
    await fetchHttpAdapter<void>({
      url: `${API_BASE_URL}/reviews/${reviewId}`,
      method: "DELETE",
      tag: `review-${reviewId}`,
    });
  }
}

// Factory
class ApiGatewayFactory {
  static createProductGateway(): ProductGateway {
    return new ProductApiGateway();
  }
  static createReviewGateway(): ReviewGateway {
    return new ReviewApiGateway();
  }
}

// Instâncias prontas para uso
export const productGateway = ApiGatewayFactory.createProductGateway();
export const reviewGateway = ApiGatewayFactory.createReviewGateway();
