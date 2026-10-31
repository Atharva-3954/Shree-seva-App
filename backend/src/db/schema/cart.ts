import {
  pgTable,
  serial,
  integer,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { products } from './products';
import { productVariants } from './productVariants';

export const cart = pgTable('cart', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const cartRelations = relations(cart, ({ one, many }) => ({
  user: one(users, {
    fields: [cart.userId],
    references: [users.id],
  }),
  items: many(cartItems),
}));

export const cartItems = pgTable('cart_items', {
  id: serial('id').primaryKey(),
  cartId: integer('cart_id').references(() => cart.id, { onDelete: 'cascade' }).notNull(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  variantId: integer('variant_id').references(() => productVariants.id),
  quantity: integer('quantity').default(1).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  cartProductVariantIdx: uniqueIndex('cart_items_cart_product_variant_idx').on(
    table.cartId,
    table.productId,
    table.variantId,
  ),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(cart, {
    fields: [cartItems.cartId],
    references: [cart.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));
