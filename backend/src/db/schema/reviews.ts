import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  json,
  boolean,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';
import { users } from './users';
import { orders } from './orders';

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  orderId: integer('order_id').references(() => orders.id),
  rating: integer('rating').notNull(),
  title: varchar('title', { length: 255 }),
  comment: text('comment'),
  images: json('images').$type<string[]>().default([]),
  isVerifiedPurchase: boolean('is_verified_purchase').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  productUserOrderIdx: uniqueIndex('reviews_product_user_order_idx').on(
    table.productId,
    table.userId,
    table.orderId,
  ),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
}));
