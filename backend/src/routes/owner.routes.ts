import { Router } from 'express';
import { authenticate, authorizeOwner } from '../middleware/auth';

const router = Router();

// Protect all owner routes with authentication & owner role check
router.use(authenticate, authorizeOwner);

// Owner Dashboard Analytics & Statistics
// GET  /api/owner/stats - Revenue, orders count, inventory status

// Product Management & Verification Lifecycle (Draft -> Pending -> Published / Rejected)
// GET    /api/owner/products - List all products (all statuses)
// POST   /api/owner/products - Create new product (starts as draft or pending)
// PUT    /api/owner/products/:id - Update product
// DELETE /api/owner/products/:id - Soft-delete / deactivate product
// POST   /api/owner/products/:id/verify - Verify product (Draft/Pending -> Published or Rejected)
// GET    /api/owner/products/:id/verification-history - View audit trail

// Inventory Management
// GET  /api/owner/inventory - Check stock levels, low-stock alerts
// PUT  /api/owner/inventory/:id - Update stock quantities

// Order Management
// GET  /api/owner/orders - List all customer orders
// PUT  /api/owner/orders/:id/status - Update order status (pending, confirmed, processing, shipped, delivered, cancelled)

// Category & Coupon Management
// POST /api/owner/categories - Add category
// PUT  /api/owner/categories/:id - Update category
// POST /api/owner/coupons - Create coupon
// PUT  /api/owner/coupons/:id - Update coupon

export default router;
