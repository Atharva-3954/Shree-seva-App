import apiClient from './client';
import {Cart, AddToCartRequest, UpdateCartItemRequest} from '../types/cart.types';
import {ApiResponse} from '../types/common.types';

/**
 * Get current user's cart
 */
export const getCart = async (): Promise<ApiResponse<Cart>> => {
  const response = await apiClient.get<ApiResponse<Cart>>('/cart');
  return response.data;
};

/**
 * Add an item to the cart
 */
export const addToCart = async (
  data: AddToCartRequest,
): Promise<ApiResponse<Cart>> => {
  const response = await apiClient.post<ApiResponse<Cart>>('/cart/items', data);
  return response.data;
};

/**
 * Update a cart item quantity
 */
export const updateCartItem = async (
  itemId: number,
  data: UpdateCartItemRequest,
): Promise<ApiResponse<Cart>> => {
  const response = await apiClient.put<ApiResponse<Cart>>(
    `/cart/items/${itemId}`,
    data,
  );
  return response.data;
};

/**
 * Remove an item from the cart
 */
export const removeCartItem = async (
  itemId: number,
): Promise<ApiResponse<Cart>> => {
  const response = await apiClient.delete<ApiResponse<Cart>>(
    `/cart/items/${itemId}`,
  );
  return response.data;
};

/**
 * Clear all items from the cart
 */
export const clearCart = async (): Promise<ApiResponse<{message: string}>> => {
  const response = await apiClient.delete<ApiResponse<{message: string}>>(
    '/cart',
  );
  return response.data;
};

/**
 * Apply a coupon to the cart
 */
export const applyCoupon = async (
  couponCode: string,
): Promise<ApiResponse<Cart & {discount: number}>> => {
  const response = await apiClient.post<ApiResponse<Cart & {discount: number}>>(
    '/cart/coupon',
    {couponCode},
  );
  return response.data;
};

/**
 * Remove applied coupon from the cart
 */
export const removeCoupon = async (): Promise<ApiResponse<Cart>> => {
  const response = await apiClient.delete<ApiResponse<Cart>>('/cart/coupon');
  return response.data;
};
