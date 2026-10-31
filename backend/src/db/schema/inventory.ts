import {
  pgTable,
  serial,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';
import { productVariants } from './productVariants';

export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  variantId: integer('variant_id').references(() => productVariants.id, { onDelete: 'cascade' }),
  stock: integer('stock').default(0).notNull(),
  lowStockThreshold: integer('low_stock_threshold').default(5).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  productVariantIdx: uniqueIndex('inventory_product_variant_idx').on(table.productId, table.variantId),
}));

export const inventoryRelations = relations(inventory, ({ one }) => ({
  product: one(products, {
    fields: [inventory.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [inventory.variantId],
    references: [productVariants.id],
  }),
}));
