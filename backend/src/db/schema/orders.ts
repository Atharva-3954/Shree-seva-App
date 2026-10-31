import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  numeric,
  json,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { orderStatusEnum } from './enums';
import { users } from './users';
import { products } from './products';
import { productVariants } from './productVariants';
import { coupons } from './coupons';

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  orderNumber: varchar('order_number', { length: 50 }).unique().notNull(),
  status: orderStatusEnum('status').default('pending').notNull(),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
  discount: numeric('discount', { precision: 10, scale: 2 }).default('0'),
  deliveryCharge: numeric('delivery_charge', { precision: 10, scale: 2 }).default('0'),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  shippingAddress: json('shipping_address').$type<ShippingAddress>().notNull(),
  notes: text('notes'),
  couponId: integer('coupon_id').references(() => coupons.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  coupon: one(coupons, {
    fields: [orders.couponId],
    references: [coupons.id],
  }),
  items: many(orderItems),
  payments: many(payments),
}));

export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  variantId: integer('variant_id').references(() => productVariants.id),
  productName: varchar('product_name', { length: 255 }).notNull(),
  variantName: varchar('variant_name', { length: 100 }),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  quantity: integer('quantity').notNull(),
  total: numeric('total', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

import { payments } from './payments';
