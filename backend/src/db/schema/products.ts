import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  boolean,
  numeric,
  json,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { productStatusEnum } from './enums';
import { categories } from './categories';
import { productVariants } from './productVariants';
import { inventory } from './inventory';
import { reviews } from './reviews';
import { productVerificationHistory } from './productVerificationHistory';

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => categories.id),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 280 }).unique().notNull(),
  description: text('description'),
  basePrice: numeric('base_price', { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric('compare_at_price', { precision: 10, scale: 2 }),
  images: json('images').$type<string[]>().default([]),
  status: productStatusEnum('status').default('draft').notNull(),
  rejectionReason: text('rejection_reason'),
  isActive: boolean('is_active').default(true).notNull(),
  tags: json('tags').$type<string[]>().default([]),
  unit: varchar('unit', { length: 50 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  inventoryItems: many(inventory),
  reviews: many(reviews),
  verificationHistory: many(productVerificationHistory),
}));
