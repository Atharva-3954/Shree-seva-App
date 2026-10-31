import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { userRoleEnum } from './enums';
import { addresses } from './addresses';
import { cart } from './cart';
import { orders } from './orders';
import { notifications } from './notifications';
import { reviews } from './reviews';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: text('password').notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 15 }),
  role: userRoleEnum('role').default('customer').notNull(),
  avatar: text('avatar'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  addresses: many(addresses),
  carts: many(cart),
  orders: many(orders),
  notifications: many(notifications),
  reviews: many(reviews),
}));
