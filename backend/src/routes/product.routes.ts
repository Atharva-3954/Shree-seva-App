import { Router } from 'express';

const router = Router();

// GET  /api/products - List published products (public, paginated, filterable)
// GET  /api/products/:slug - Get product detail by slug (public, only published)
// GET  /api/products/search?q= - Search products (public)
// GET  /api/products/category/:categoryId - Products by category (public)

export default router;

