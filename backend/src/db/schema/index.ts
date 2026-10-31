// Re-export all schema tables, relations, and enums

export * from './enums';
export { users, usersRelations } from './users';
export { addresses, addressesRelations } from './addresses';
export { categories, categoriesRelations } from './categories';
export { products, productsRelations } from './products';
export { productVariants, productVariantsRelations } from './productVariants';
export { productVerificationHistory, productVerificationHistoryRelations } from './productVerificationHistory';
export { inventory, inventoryRelations } from './inventory';
export { cart, cartRelations, cartItems, cartItemsRelations } from './cart';
export { orders, ordersRelations, orderItems, orderItemsRelations } from './orders';
export type { ShippingAddress } from './orders';
export { payments, paymentsRelations } from './payments';
export { coupons } from './coupons';
export { notifications, notificationsRelations } from './notifications';
export type { NotificationData } from './notifications';
export { reviews, reviewsRelations } from './reviews';
