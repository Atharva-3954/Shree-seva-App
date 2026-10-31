import {
  pgTable,
  serial,
  integer,
  varchar,
  numeric,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';
import { inventory } from './inventory';

export const productVariants = pgTable('product_variants', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  sku: varchar('sku', { length: 100 }).unique().notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: numeric('compare_at_price', { precision: 10, scale: 2 }),
  weight: numeric('weight', { precision: 8, scale: 2 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const productVariantsRelations = relations(productVariants, ({ one, many }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
  inventoryItems: many(inventory),
}));
