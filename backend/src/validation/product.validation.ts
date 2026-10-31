import { z } from 'zod';

export const createProductSchema = z.object({
  categoryId: z.number().int().positive('Category ID must be a positive integer').optional(),
  name: z
    .string({ required_error: 'Product name is required' })
    .min(2, 'Product name must be at least 2 characters')
    .max(255, 'Product name must be at most 255 characters')
    .trim(),
  description: z.string().max(5000, 'Description must be at most 5000 characters').optional(),
  basePrice: z
    .number({ required_error: 'Base price is required' })
    .positive('Base price must be positive')
    .multipleOf(0.01, 'Price must have at most 2 decimal places'),
  compareAtPrice: z
    .number()
    .positive('Compare at price must be positive')
    .multipleOf(0.01, 'Price must have at most 2 decimal places')
    .optional(),
  images: z.array(z.string().url('Each image must be a valid URL')).optional(),
  tags: z.array(z.string().max(50, 'Each tag must be at most 50 characters')).optional(),
  unit: z.string().max(50, 'Unit must be at most 50 characters').optional(),
  variants: z
    .array(
      z.object({
        name: z
          .string({ required_error: 'Variant name is required' })
          .min(1, 'Variant name is required')
          .max(100),
        sku: z
          .string({ required_error: 'SKU is required' })
          .min(1, 'SKU is required')
          .max(100),
        price: z.number().positive('Variant price must be positive').multipleOf(0.01),
        compareAtPrice: z.number().positive().multipleOf(0.01).optional(),
        weight: z.number().positive().optional(),
      })
    )
    .optional(),
});

export const updateProductSchema = z.object({
  categoryId: z.number().int().positive().optional().nullable(),
  name: z.string().min(2).max(255).trim().optional(),
  description: z.string().max(5000).optional().nullable(),
  basePrice: z.number().positive().multipleOf(0.01).optional(),
  compareAtPrice: z.number().positive().multipleOf(0.01).optional().nullable(),
  images: z.array(z.string().url()).optional(),
  tags: z.array(z.string().max(50)).optional(),
  unit: z.string().max(50).optional().nullable(),
  isActive: z.boolean().optional(),
});

export const verifyProductSchema = z.object({
  status: z.enum(['published', 'rejected'], {
    required_error: 'Status is required',
    invalid_type_error: 'Status must be either "published" or "rejected"',
  }),
  reason: z
    .string()
    .max(1000, 'Reason must be at most 1000 characters')
    .optional(),
}).refine(
  (data) => {
    // Reason is required when rejecting
    if (data.status === 'rejected' && (!data.reason || data.reason.trim().length === 0)) {
      return false;
    }
    return true;
  },
  {
    message: 'Reason is required when rejecting a product',
    path: ['reason'],
  }
);

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type VerifyProductInput = z.infer<typeof verifyProductSchema>;
