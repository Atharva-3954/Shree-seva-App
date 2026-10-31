export type ProductStatus = 'active' | 'inactive' | 'draft' | 'out_of_stock';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  parentId: number | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  name: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  weight: number | null;
  weightUnit: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  altText: string | null;
  sortOrder: number;
  isPrimary: boolean;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  categoryId: number;
  category?: Category;
  status: ProductStatus;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  weight: number | null;
  weightUnit: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  averageRating: number;
  reviewCount: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  orderId: number;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerified: boolean;
  isApproved: boolean;
  user?: {
    id: number;
    fullName: string;
    avatar: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  categoryId?: number;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price' | 'name' | 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
