import apiClient from './client';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from '../types/auth.types';
import {ApiResponse} from '../types/common.types';

/**
 * Login with email and password
 */
export const login = async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
  return response.data;
};

/**
 * Register a new customer account
 */
export const register = async (
  data: RegisterRequest,
): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    '/auth/register',
    data,
  );
  return response.data;
};

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<ApiResponse<User>> => {
  const response = await apiClient.get<ApiResponse<User>>('/auth/profile');
  return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (
  data: Partial<Pick<User, 'fullName' | 'phone' | 'avatar'>>,
): Promise<ApiResponse<User>> => {
  const response = await apiClient.put<ApiResponse<User>>('/auth/profile', data);
  return response.data;
};

/**
 * Change password
 */
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}): Promise<ApiResponse<{message: string}>> => {
  const response = await apiClient.put<ApiResponse<{message: string}>>(
    '/auth/change-password',
    data,
  );
  return response.data;
};

/**
 * Request password reset
 */
export const forgotPassword = async (data: {
  email: string;
}): Promise<ApiResponse<{message: string}>> => {
  const response = await apiClient.post<ApiResponse<{message: string}>>(
    '/auth/forgot-password',
    data,
  );
  return response.data;
};
