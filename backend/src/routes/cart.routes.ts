import { Router } from 'express';

const router = Router();

// GET    /api/cart - Get user's cart (authenticated)
// POST   /api/cart/items - Add item to cart
// PUT    /api/cart/items/:itemId - Update cart item quantity
// DELETE /api/cart/items/:itemId - Remove item from cart
// DELETE /api/cart - Clear entire cart

export default router;

