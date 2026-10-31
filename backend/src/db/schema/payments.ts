import {
  pgTable,
  serial,
  integer,
  varchar,
  numeric,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { paymentMethodEnum, paymentStatusEnum } from './enums';
import { orders } from './orders';

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  method: paymentMethodEnum('method').notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),
  transactionId: varchar('transaction_id', { length: 255 }),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));
