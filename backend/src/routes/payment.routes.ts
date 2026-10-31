import { Router, Request, Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../config/database';
import { payments, orders } from '../db/schema/index';
import { authenticate, authorizeOwner } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();

// All payment routes require authentication
router.use(authenticate);

/**
 * GET /api/payments/order/:orderId
 * Get payment details for an order.
 */
router.get(
  '/order/:orderId',
  asyncHandler(async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.orderId, 10);

    // Verify user owns the order (or is owner)
    const [order] = await db
      .select()
      .from(orders)
      .where(
        req.user!.role === 'owner'
          ? eq(orders.id, orderId)
          : and(eq(orders.id, orderId), eq(orders.userId, req.user!.id))
      )
      .limit(1);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const orderPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, orderId));

    res.status(200).json({
      success: true,
      data: { payments: orderPayments },
    });
  })
);

/**
 * PUT /api/payments/:id/status
 * Update payment status (owner only).
 */
router.put(
  '/:id/status',
  authorizeOwner,
  asyncHandler(async (req: Request, res: Response) => {
    const paymentId = parseInt(req.params.id, 10);
    const { status, transactionId } = req.body;

    if (!status) {
      throw new AppError('Payment status is required', 400);
    }

    const validStatuses = ['pending', 'completed', 'failed', 'refunded'];
    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid payment status', 400);
    }

    const [existing] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, paymentId))
      .limit(1);

    if (!existing) {
      throw new AppError('Payment not found', 404);
    }

    const [updated] = await db
      .update(payments)
      .set({
        status,
        ...(transactionId && { transactionId }),
        ...(status === 'completed' && { paidAt: new Date() }),
        updatedAt: new Date(),
      })
      .where(eq(payments.id, paymentId))
      .returning();

    res.status(200).json({
      success: true,
      message: 'Payment status updated',
      data: { payment: updated },
    });
  })
);

export default router;
