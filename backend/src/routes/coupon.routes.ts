import { Router, Request, Response } from 'express';
import { eq, and, gte, lte } from 'drizzle-orm';
import { db } from '../config/database';
import { coupons } from '../db/schema/index';
import { authenticate, authorizeOwner } from '../middleware/auth';
import { asyncHandler, AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * POST /api/coupons/validate
 * Validate a coupon code (authenticated users).
 */
router.post(
  '/validate',
  authenticate,
  asyncHandler(async (req: Request, res: Response) => {
    const { code, orderAmount } = req.body;

    if (!code) {
      throw new AppError('Coupon code is required', 400);
    }

    const [coupon] = await db
      .select()
      .from(coupons)
      .where(and(eq(coupons.code, code.toUpperCase()), eq(coupons.isActive, true)))
      .limit(1);

    if (!coupon) {
      throw new AppError('Invalid coupon code', 404);
    }

    const now = new Date();
    if (now < new Date(coupon.validFrom) || now > new Date(coupon.validUntil)) {
      throw new AppError('Coupon has expired', 400);
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new AppError('Coupon usage limit reached', 400);
    }

    const minOrderAmount = parseFloat(coupon.minOrderAmount || '0');
    if (orderAmount && orderAmount < minOrderAmount) {
      throw new AppError(`Minimum order amount is ₹${minOrderAmount}`, 400);
    }

    // Calculate discount preview
    let discountAmount = 0;
    if (orderAmount) {
      if (coupon.discountType === 'percentage') {
        discountAmount = (orderAmount * parseFloat(coupon.discountValue)) / 100;
        const maxDiscount = coupon.maxDiscountAmount
          ? parseFloat(coupon.maxDiscountAmount)
          : Infinity;
        discountAmount = Math.min(discountAmount, maxDiscount);
      } else {
        discountAmount = parseFloat(coupon.discountValue);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Coupon is valid',
      data: {
        coupon: {
          id: coupon.id,
          code: coupon.code,
          description: coupon.description,
          discountType: coupon.discountType,
          discountValue: coupon.discountValue,
          minOrderAmount: coupon.minOrderAmount,
          maxDiscountAmount: coupon.maxDiscountAmount,
        },
        discountPreview: discountAmount,
      },
    });
  })
);

/**
 * GET /api/coupons
 * Get all coupons (owner only).
 */
router.get(
  '/',
  authenticate,
  authorizeOwner,
  asyncHandler(async (_req: Request, res: Response) => {
    const allCoupons = await db.select().from(coupons);

    res.status(200).json({
      success: true,
      data: { coupons: allCoupons },
    });
  })
);

/**
 * POST /api/coupons
 * Create a new coupon (owner only).
 */
router.post(
  '/',
  authenticate,
  authorizeOwner,
  asyncHandler(async (req: Request, res: Response) => {
    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      perUserLimit,
      validFrom,
      validUntil,
    } = req.body;

    if (!code || !discountType || !discountValue || !validFrom || !validUntil) {
      throw new AppError('Required fields: code, discountType, discountValue, validFrom, validUntil', 400);
    }

    // Check for duplicate code
    const [existing] = await db
      .select({ id: coupons.id })
      .from(coupons)
      .where(eq(coupons.code, code.toUpperCase()))
      .limit(1);

    if (existing) {
      throw new AppError('A coupon with this code already exists', 409);
    }

    const [newCoupon] = await db
      .insert(coupons)
      .values({
        code: code.toUpperCase(),
        description,
        discountType,
        discountValue: discountValue.toString(),
        minOrderAmount: minOrderAmount?.toString() || '0',
        maxDiscountAmount: maxDiscountAmount?.toString(),
        usageLimit,
        perUserLimit: perUserLimit || 1,
        validFrom: new Date(validFrom),
        validUntil: new Date(validUntil),
      })
      .returning();

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: { coupon: newCoupon },
    });
  })
);

/**
 * PUT /api/coupons/:id
 * Update a coupon (owner only).
 */
router.put(
  '/:id',
  authenticate,
  authorizeOwner,
  asyncHandler(async (req: Request, res: Response) => {
    const couponId = parseInt(req.params.id, 10);

    const [existing] = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, couponId))
      .limit(1);

    if (!existing) {
      throw new AppError('Coupon not found', 404);
    }

    const {
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      usageLimit,
      perUserLimit,
      isActive,
      validFrom,
      validUntil,
    } = req.body;

    const [updated] = await db
      .update(coupons)
      .set({
        ...(description !== undefined && { description }),
        ...(discountType && { discountType }),
        ...(discountValue !== undefined && { discountValue: discountValue.toString() }),
        ...(minOrderAmount !== undefined && { minOrderAmount: minOrderAmount.toString() }),
        ...(maxDiscountAmount !== undefined && {
          maxDiscountAmount: maxDiscountAmount?.toString() ?? null,
        }),
        ...(usageLimit !== undefined && { usageLimit }),
        ...(perUserLimit !== undefined && { perUserLimit }),
        ...(isActive !== undefined && { isActive }),
        ...(validFrom && { validFrom: new Date(validFrom) }),
        ...(validUntil && { validUntil: new Date(validUntil) }),
        updatedAt: new Date(),
      })
      .where(eq(coupons.id, couponId))
      .returning();

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: { coupon: updated },
    });
  })
);

/**
 * DELETE /api/coupons/:id
 * Delete a coupon (owner only).
 */
router.delete(
  '/:id',
  authenticate,
  authorizeOwner,
  asyncHandler(async (req: Request, res: Response) => {
    const couponId = parseInt(req.params.id, 10);

    const [existing] = await db
      .select({ id: coupons.id })
      .from(coupons)
      .where(eq(coupons.id, couponId))
      .limit(1);

    if (!existing) {
      throw new AppError('Coupon not found', 404);
    }

    await db.delete(coupons).where(eq(coupons.id, couponId));

    res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  })
);

export default router;
