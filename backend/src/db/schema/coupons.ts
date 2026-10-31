import {
  pgTable,
  serial,
  varchar,
  text,
  numeric,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { discountTypeEnum } from './enums';

export const coupons = pgTable('coupons', {
  id: serial('id').primaryKey(),
  code: varchar('code', { length: 50 }).unique().notNull(),
  description: text('description'),
  discountType: discountTypeEnum('discount_type').notNull(),
  discountValue: numeric('discount_value', { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: numeric('min_order_amount', { precision: 10, scale: 2 }).default('0'),
  maxDiscountAmount: numeric('max_discount_amount', { precision: 10, scale: 2 }),
  usageLimit: integer('usage_limit'),
  usedCount: integer('used_count').default(0).notNull(),
  perUserLimit: integer('per_user_limit').default(1),
  isActive: boolean('is_active').default(true).notNull(),
  validFrom: timestamp('valid_from', { withTimezone: true }).notNull(),
  validUntil: timestamp('valid_until', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});
