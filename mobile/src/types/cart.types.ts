export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  variantId: number | null;
  quantity: number;
  price: number;
  total: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    stock: number;
    images: Array<{url: string; isPrimary: boolean}>;
  };
  variant?: {
    id: number;
    name: string;
    price: number;
    stock: number;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: number;
  variantId?: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}
