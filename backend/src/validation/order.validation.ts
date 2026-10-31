import { z } from 'zod';

const shippingAddressSchema = z.object({
  fullName: z
    .string({ required_error: 'Full name is required' })
    .min(2, 'Full name must be at least 2 characters')
    .max(255),
  phone: z
    .string({ required_error: 'Phone is required' })
    .max(15, 'Phone must be at most 15 characters'),
  addressLine1: z
    .string({ required_error: 'Address line 1 is required' })
    .min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z
    .string({ required_error: 'City is required' })
    .min(1, 'City is required')
    .max(100),
  state: z
    .string({ required_error: 'State is required' })
    .min(1, 'State is required')
    .max(100),
  pincode: z
    .string({ required_error: 'Pincode is required' })
    .min(1, 'Pincode is required')
    .max(10),
  label: z.string().max(50).optional(),
});

const orderItemSchema = z.object({
  productId: z.number().int().positive('Product ID must be a positive integer'),
  variantId: z.number().int().positive('Variant ID must be a positive integer').optional(),
  quantity: z
    .number()
    .int()
    .positive('Quantity must be a positive integer')
    .max(100, 'Quantity cannot exceed 100'),
});

export const createOrderSchema = z.object({
  items: z
    .array(orderItemSchema)
    .min(1, 'At least one item is required'),
  shippingAddress: shippingAddressSchema,
  addressId: z.number().int().positive().optional(),
  paymentMethod: z.enum(['cod', 'upi', 'card', 'netbanking'], {
    required_error: 'Payment method is required',
  }),
  couponCode: z.string().max(50).optional(),
  notes: z.string().max(500, 'Notes must be at most 500 characters').optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(
    ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    {
      required_error: 'Status is required',
      invalid_type_error: 'Invalid order status',
    }
  ),
  notes: z.string().max(500).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
