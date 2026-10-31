import {create} from 'zustand';
import {CartItem} from '../types/cart.types';

interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  isLoading: boolean;
  couponCode: string | null;
  discount: number;

  // Actions
  setCart: (items: CartItem[], subtotal: number) => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  updateItemQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setCoupon: (code: string | null, discount: number) => void;
}

const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  subtotal: 0,
  itemCount: 0,
  isLoading: false,
  couponCode: null,
  discount: 0,

  setCart: (items, subtotal) => {
    set({
      items,
      subtotal,
      itemCount: calculateItemCount(items),
    });
  },

  addItem: (item) => {
    const {items} = get();
    const existingIndex = items.findIndex(
      i =>
        i.productId === item.productId && i.variantId === item.variantId,
    );

    let updatedItems: CartItem[];
    if (existingIndex >= 0) {
      updatedItems = items.map((i, idx) =>
        idx === existingIndex
          ? {...i, quantity: i.quantity + item.quantity, total: (i.quantity + item.quantity) * i.price}
          : i,
      );
    } else {
      updatedItems = [...items, item];
    }

    set({
      items: updatedItems,
      subtotal: calculateSubtotal(updatedItems),
      itemCount: calculateItemCount(updatedItems),
    });
  },

  removeItem: (itemId) => {
    const {items} = get();
    const updatedItems = items.filter(i => i.id !== itemId);
    set({
      items: updatedItems,
      subtotal: calculateSubtotal(updatedItems),
      itemCount: calculateItemCount(updatedItems),
    });
  },

  updateItemQuantity: (itemId, quantity) => {
    const {items} = get();
    if (quantity <= 0) {
      const updatedItems = items.filter(i => i.id !== itemId);
      set({
        items: updatedItems,
        subtotal: calculateSubtotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      });
      return;
    }

    const updatedItems = items.map(i =>
      i.id === itemId ? {...i, quantity, total: quantity * i.price} : i,
    );
    set({
      items: updatedItems,
      subtotal: calculateSubtotal(updatedItems),
      itemCount: calculateItemCount(updatedItems),
    });
  },

  clearCart: () => {
    set({
      items: [],
      subtotal: 0,
      itemCount: 0,
      couponCode: null,
      discount: 0,
    });
  },

  setLoading: (loading) => {
    set({isLoading: loading});
  },

  setCoupon: (code, discount) => {
    set({couponCode: code, discount});
  },
}));
