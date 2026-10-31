import apiClient from './client';
import {
  Product,
  Category,
  Review,
  ProductFilters,
} from '../types/product.types';
import {ApiResponse, PaginatedResponse} from '../types/common.types';

/**
 * Get paginated list of products with optional filters
 */
export const getProducts = async (
  filters?: ProductFilters,
): Promise<PaginatedResponse<Product>> => {
  const response = await apiClient.get<PaginatedResponse<Product>>('/products', {
    params: filters,
  });
  return response.data;
};

/**
 * Get a single product by ID or slug
 */
export const getProduct = async (
  idOrSlug: number | string,
): Promise<ApiResponse<Product>> => {
  const response = await apiClient.get<ApiResponse<Product>>(
    `/products/${idOrSlug}`,
  );
  return response.data;
};

/**
 * Get all active categories
 */
export const getCategories = async (): Promise<ApiResponse<Category[]>> => {
  const response = await apiClient.get<ApiResponse<Category[]>>('/categories');
  return response.data;
};

/**
 * Get a single category by ID
 */
export const getCategory = async (
  categoryId: number,
): Promise<ApiResponse<Category>> => {
  const response = await apiClient.get<ApiResponse<Category>>(
    `/categories/${categoryId}`,
  );
  return response.data;
};

/**
 * Search products by query string
 */
export const searchProducts = async (
  query: string,
  page: number = 1,
  limit: number = 20,
): Promise<PaginatedResponse<Product>> => {
  const response = await apiClient.get<PaginatedResponse<Product>>(
    '/products/search',
    {
      params: {q: query, page, limit},
    },
  );
  return response.data;
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (): Promise<ApiResponse<Product[]>> => {
  const response = await apiClient.get<ApiResponse<Product[]>>(
    '/products/featured',
  );
  return response.data;
};

/**
 * Get product reviews
 */
export const getProductReviews = async (
  productId: number,
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResponse<Review>> => {
  const response = await apiClient.get<PaginatedResponse<Review>>(
    `/products/${productId}/reviews`,
    {
      params: {page, limit},
    },
  );
  return response.data;
};

/**
 * Submit a product review
 */
export const submitReview = async (
  productId: number,
  data: {
    orderId: number;
    rating: number;
    title?: string;
    comment?: string;
  },
): Promise<ApiResponse<Review>> => {
  const response = await apiClient.post<ApiResponse<Review>>(
    `/products/${productId}/reviews`,
    data,
  );
  return response.data;
};
