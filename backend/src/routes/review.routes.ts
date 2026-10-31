import { Router } from 'express';

const router = Router();

// GET  /api/reviews/product/:productId - Get reviews for a product (public)
// POST /api/reviews/product/:productId - Create a review for a purchased product (authenticated)
// PUT  /api/reviews/:id - Update user's review (authenticated)
// DELETE /api/reviews/:id - Delete user's review (authenticated)

export default router;

