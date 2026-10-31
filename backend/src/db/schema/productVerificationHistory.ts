import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { products } from './products';
import { productStatusEnum } from './enums';
import { users } from './users';

export const productVerificationHistory = pgTable('product_verification_history', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id, { onDelete: 'cascade' }).notNull(),
  fromStatus: productStatusEnum('from_status'),
  toStatus: productStatusEnum('to_status').notNull(),
  reason: text('reason'),
  verifiedBy: integer('verified_by').references(() => users.id),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const productVerificationHistoryRelations = relations(productVerificationHistory, ({ one }) => ({
  product: one(products, {
    fields: [productVerificationHistory.productId],
    references: [products.id],
  }),
  verifier: one(users, {
    fields: [productVerificationHistory.verifiedBy],
    references: [users.id],
  }),
}));
