import {
  pgTable,
  serial,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  label: varchar('label', { length: 50 }),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 15 }).notNull(),
  addressLine1: text('address_line_1').notNull(),
  addressLine2: text('address_line_2'),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  pincode: varchar('pincode', { length: 10 }).notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));
