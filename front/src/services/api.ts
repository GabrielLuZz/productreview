
import { Product, Review, CreateProductRequest, CreateReviewRequest, UpdateProductRequest, UpdateReviewRequest } from '@/types';

const API_BASE_URL = 'http://localhost:3000/api';

// Mock data for demonstration
const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Smartphone Samsung Galaxy S23',
    description: 'Smartphone de alta qualidade com câmera profissional',
    price: 2999.99,
    category: 'Eletrônicos',
    createdAt: new Date().toISOString(),
    averageRating: 4.5,
    totalReviews: 12
  },
  {
    _id: '2',
    name: 'Notebook Dell Inspiron',
    description: 'Notebook para trabalho e estudos',
    price: 3499.99,
    category: 'Informática',
    createdAt: new Date().toISOString(),
    averageRating: 4.2,
    totalReviews: 8
  }
];

const mockReviews: Review[] = [
  {
    _id: '1',
    productId: '1',
    author: 'João Silva',
    rating: 5,
    comment: 'Excelente produto, recomendo!',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    productId: '1',
    author: 'Maria Santos',
    rating: 4,
    comment: 'Muito bom, mas poderia ser mais barato.',
    createdAt: new Date().toISOString()
  }
];

class ApiService {
  // Products
  async getProducts(): Promise<Product[]> {
    // Simula uma chamada de API
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockProducts]), 500);
    });
  }

  async getProduct(id: string): Promise<Product> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const product = mockProducts.find(p => p._id === id);
        if (product) {
          resolve(product);
        } else {
          reject(new Error('Product not found'));
        }
      }, 300);
    });
  }

  async createProduct(product: CreateProductRequest): Promise<Product> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProduct: Product = {
          _id: Date.now().toString(),
          ...product,
          createdAt: new Date().toISOString(),
          averageRating: 0,
          totalReviews: 0
        };
        mockProducts.push(newProduct);
        resolve(newProduct);
      }, 300);
    });
  }

  async updateProduct(id: string, updates: UpdateProductRequest): Promise<Product> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockProducts.findIndex(p => p._id === id);
        if (index !== -1) {
          mockProducts[index] = { ...mockProducts[index], ...updates };
          resolve(mockProducts[index]);
        } else {
          reject(new Error('Product not found'));
        }
      }, 300);
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockProducts.findIndex(p => p._id === id);
        if (index !== -1) {
          mockProducts.splice(index, 1);
        }
        resolve();
      }, 300);
    });
  }

  // Reviews
  async getProductReviews(productId: string): Promise<Review[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reviews = mockReviews.filter(r => r.productId === productId);
        resolve(reviews);
      }, 300);
    });
  }

  async createReview(review: CreateReviewRequest): Promise<Review> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newReview: Review = {
          _id: Date.now().toString(),
          ...review,
          createdAt: new Date().toISOString()
        };
        mockReviews.push(newReview);
        resolve(newReview);
      }, 300);
    });
  }

  async updateReview(id: string, updates: UpdateReviewRequest): Promise<Review> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockReviews.findIndex(r => r._id === id);
        if (index !== -1) {
          mockReviews[index] = { ...mockReviews[index], ...updates };
          resolve(mockReviews[index]);
        } else {
          reject(new Error('Review not found'));
        }
      }, 300);
    });
  }

  async deleteReview(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockReviews.findIndex(r => r._id === id);
        if (index !== -1) {
          mockReviews.splice(index, 1);
        }
        resolve();
      }, 300);
    });
  }

  async getProductAverageRating(productId: string): Promise<{ average: number; total: number }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const reviews = mockReviews.filter(r => r.productId === productId);
        const total = reviews.length;
        const average = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
        resolve({ average: Math.round(average * 10) / 10, total });
      }, 200);
    });
  }
}

export const apiService = new ApiService();
