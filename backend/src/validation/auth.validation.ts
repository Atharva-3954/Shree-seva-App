import { z } from 'zod';

export const registerSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be at most 128 characters'),
  fullName: z
    .string({ required_error: 'Full name is required' })
    .min(2, 'Full name must be at least 2 characters')
    .max(255, 'Full name must be at most 255 characters')
    .trim(),
  phone: z
    .string()
    .max(15, 'Phone number must be at most 15 characters')
    .regex(/^[+]?[\d\s-]+$/, 'Invalid phone number format')
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(1, 'Password is required'),
});

export const ownerSetupSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string({ required_error: 'Password is required' })
    .min(6, 'Password must be at least 6 characters')
    .max(128, 'Password must be at most 128 characters'),
  fullName: z
    .string({ required_error: 'Full name is required' })
    .min(2, 'Full name must be at least 2 characters')
    .max(255, 'Full name must be at most 255 characters')
    .trim(),
  phone: z
    .string()
    .max(15, 'Phone number must be at most 15 characters')
    .regex(/^[+]?[\d\s-]+$/, 'Invalid phone number format')
    .optional(),
  setupKey: z
    .string({ required_error: 'Setup key is required' })
    .min(1, 'Setup key is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OwnerSetupInput = z.infer<typeof ownerSetupSchema>;
