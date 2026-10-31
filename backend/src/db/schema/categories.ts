import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  slug: varchar('slug', { length: 120 }).unique().notNull(),
  description: text('description'),
  image: text('image'),
  isActive: boolean('is_active').default(true).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));
