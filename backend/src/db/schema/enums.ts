import { pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['customer', 'owner']);

export const productStatusEnum = pgEnum('product_status', [
  'draft',
  'pending',
  'published',
  'rejected',
]);

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'cod',
  'upi',
  'card',
  'netbanking',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
  'refunded',
]);

export const discountTypeEnum = pgEnum('discount_type', ['percentage', 'fixed']);

export const notificationTypeEnum = pgEnum('notification_type', [
  'order',
  'promotion',
  'system',
  'product',
]);

