export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'cod' | 'upi' | 'card' | 'net_banking' | 'wallet';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  variantId: number | null;
  productName: string;
  variantName: string | null;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  image: string | null;
  product?: {
    id: number;
    name: string;
    slug: string;
    images: Array<{url: string; isPrimary: boolean}>;
  };
  createdAt: string;
}

export interface OrderAddress {
  id: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  landmark: string | null;
  isDefault: boolean;
}

export interface Payment {
  id: number;
  orderId: number;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transactionId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  userId: number;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  tax: number;
  total: number;
  couponCode: string | null;
  notes: string | null;
  items: OrderItem[];
  shippingAddress: OrderAddress | null;
  payment: Payment | null;
  estimatedDelivery: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  addressId: number;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  notes?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'total';
  sortOrder?: 'asc' | 'desc';
}
