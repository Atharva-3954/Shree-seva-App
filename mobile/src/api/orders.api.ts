import apiClient from './client';
import {
  Order,
  CreateOrderRequest,
  OrderFilters,
} from '../types/order.types';
import {ApiResponse, PaginatedResponse} from '../types/common.types';

/**
 * Create a new order from the current cart
 */
export const createOrder = async (
  data: CreateOrderRequest,
): Promise<ApiResponse<Order>> => {
  const response = await apiClient.post<ApiResponse<Order>>('/orders', data);
  return response.data;
};

/**
 * Get paginated list of user's orders
 */
export const getOrders = async (
  filters?: OrderFilters,
): Promise<PaginatedResponse<Order>> => {
  const response = await apiClient.get<PaginatedResponse<Order>>('/orders', {
    params: filters,
  });
  return response.data;
};

/**
 * Get a single order by ID
 */
export const getOrder = async (
  orderId: number,
): Promise<ApiResponse<Order>> => {
  const response = await apiClient.get<ApiResponse<Order>>(
    `/orders/${orderId}`,
  );
  return response.data;
};

/**
 * Cancel an order
 */
export const cancelOrder = async (
  orderId: number,
  reason?: string,
): Promise<ApiResponse<Order>> => {
  const response = await apiClient.put<ApiResponse<Order>>(
    `/orders/${orderId}/cancel`,
    {reason},
  );
  return response.data;
};

/**
 * Reorder - create a new cart from an existing order's items
 */
export const reorder = async (
  orderId: number,
): Promise<ApiResponse<{message: string}>> => {
  const response = await apiClient.post<ApiResponse<{message: string}>>(
    `/orders/${orderId}/reorder`,
  );
  return response.data;
};

/**
 * Get order tracking info
 */
export const getOrderTracking = async (
  orderId: number,
): Promise<
  ApiResponse<{
    status: string;
    timeline: Array<{
      status: string;
      timestamp: string;
      description: string;
    }>;
  }>
> => {
  const response = await apiClient.get(
    `/orders/${orderId}/tracking`,
  );
  return response.data;
};
