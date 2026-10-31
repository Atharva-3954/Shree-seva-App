import { Router, Request, Response } from 'express';
import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '../config/database';
import {
  orders,
  orderItems,
  products,
  productVariants,
  payments,
  coupons,
  cart,
  cartItems,
  inventory,
} from '../db/schema/index';
import { authenticate, authorizeOwner } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler, AppError } from '../middleware/errorHandler';
import { createOrderSchema, updateOrderStatusSchema } from '../validation/order.validation';
import { generateOrderNumber, paginate } from '../utils/helpers';

const router = Router();

// All order routes require authentication
router.use(authenticate);

/**
 * GET /api/orders
 * Get current user's orders with pagination.
 */
router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string;
    const { offset, limit: perPage } = paginate(page, limit);

    const conditions = [eq(orders.userId, req.user!.id)];
    if (status) {
      conditions.push(eq(orders.status, status as any));
    }

    const userOrders = await db
      .select()
      .from(orders)
      .where(and(...conditions))
      .orderBy(desc(orders.createdAt))
      .limit(perPage)
      .offset(offset);

    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(and(...conditions));

    // Get items for each order
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));
        return { ...order, items };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        orders: ordersWithItems,
        pagination: {
          page,
          limit: perPage,
          total: Number(countResult.count),
          totalPages: Math.ceil(Number(countResult.count) / perPage),
        },
      },
    });
  })
);

/**
 * GET /api/orders/:id
 * Get a single order by ID.
 */
router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.id, 10);

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

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    const orderPayments = await db
      .select()
      .from(payments)
      .where(eq(payments.orderId, order.id));

    res.status(200).json({
      success: true,
      data: {
        order: {
          ...order,
          items,
          payments: orderPayments,
        },
      },
    });
  })
);

/**
 * POST /api/orders
 * Create a new order.
 */
router.post(
  '/',
  validate(createOrderSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const { items, shippingAddress, paymentMethod, couponCode, notes } = req.body;

    let subtotal = 0;
    let discount = 0;
    let couponId: number | null = null;

    // Validate items and calculate prices
    const orderItemsData: Array<{
      productId: number;
      variantId: number | null;
      productName: string;
      variantName: string | null;
      price: string;
      quantity: number;
      total: string;
    }> = [];

    for (const item of items) {
      const [product] = await db
        .select()
        .from(products)
        .where(
          and(eq(products.id, item.productId), eq(products.isActive, true), eq(products.status, 'published'))
        )
        .limit(1);

      if (!product) {
        throw new AppError(`Product with ID ${item.productId} not found or not available`, 400);
      }

      let price = parseFloat(product.basePrice);
      let variantName: string | null = null;

      if (item.variantId) {
        const [variant] = await db
          .select()
          .from(productVariants)
          .where(
            and(
              eq(productVariants.id, item.variantId),
              eq(productVariants.productId, item.productId),
              eq(productVariants.isActive, true),
            )
          )
          .limit(1);

        if (!variant) {
          throw new AppError(`Variant with ID ${item.variantId} not found`, 400);
        }

        price = parseFloat(variant.price);
        variantName = variant.name;
      }

      // Check inventory
      const inventoryConditions = [eq(inventory.productId, item.productId)];
      if (item.variantId) {
        inventoryConditions.push(eq(inventory.variantId, item.variantId));
      }

      const [inv] = await db
        .select()
        .from(inventory)
        .where(and(...inventoryConditions))
        .limit(1);

      if (inv && inv.stock < item.quantity) {
        throw new AppError(
          `Insufficient stock for ${product.name}. Available: ${inv.stock}`,
          400
        );
      }

      const total = price * item.quantity;
      subtotal += total;

      orderItemsData.push({
        productId: item.productId,
        variantId: item.variantId || null,
        productName: product.name,
        variantName,
        price: price.toFixed(2),
        quantity: item.quantity,
        total: total.toFixed(2),
      });
    }

    // Apply coupon if provided
    if (couponCode) {
      const [coupon] = await db
        .select()
        .from(coupons)
        .where(and(eq(coupons.code, couponCode.toUpperCase()), eq(coupons.isActive, true)))
        .limit(1);

      if (!coupon) {
        throw new AppError('Invalid or expired coupon code', 400);
      }

      const now = new Date();
      if (now < new Date(coupon.validFrom) || now > new Date(coupon.validUntil)) {
        throw new AppError('Coupon has expired', 400);
      }

      if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new AppError('Coupon usage limit reached', 400);
      }

      const minOrder = parseFloat(coupon.minOrderAmount || '0');
      if (subtotal < minOrder) {
        throw new AppError(`Minimum order amount for this coupon is ₹${minOrder}`, 400);
      }

      if (coupon.discountType === 'percentage') {
        discount = (subtotal * parseFloat(coupon.discountValue)) / 100;
        const maxDiscount = coupon.maxDiscountAmount
          ? parseFloat(coupon.maxDiscountAmount)
          : Infinity;
        discount = Math.min(discount, maxDiscount);
      } else {
        discount = parseFloat(coupon.discountValue);
      }

      couponId = coupon.id;
    }

    const deliveryCharge = 0; // Free delivery; can be made configurable
    const totalAmount = subtotal - discount + deliveryCharge;
    const orderNumber = generateOrderNumber();

    // Create order
    const [newOrder] = await db
      .insert(orders)
      .values({
        userId: req.user!.id,
        orderNumber,
        status: 'pending',
        subtotal: subtotal.toFixed(2),
        discount: discount.toFixed(2),
        deliveryCharge: deliveryCharge.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        shippingAddress,
        notes,
        couponId,
      })
      .returning();

    // Create order items
    await db.insert(orderItems).values(
      orderItemsData.map((item) => ({
        ...item,
        orderId: newOrder.id,
      }))
    );

    // Create payment record
    await db.insert(payments).values({
      orderId: newOrder.id,
      method: paymentMethod,
      status: paymentMethod === 'cod' ? 'pending' : 'pending',
      amount: totalAmount.toFixed(2),
    });

    // Update inventory (reduce stock)
    for (const item of orderItemsData) {
      const inventoryConditions = [eq(inventory.productId, item.productId)];
      if (item.variantId) {
        inventoryConditions.push(eq(inventory.variantId, item.variantId));
      }

      await db
        .update(inventory)
        .set({
          stock: sql`${inventory.stock} - ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(and(...inventoryConditions));
    }

    // Update coupon usage count
    if (couponId) {
      await db
        .update(coupons)
        .set({
          usedCount: sql`${coupons.usedCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(coupons.id, couponId));
    }

    // Clear user's cart after order
    const [userCart] = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, req.user!.id))
      .limit(1);

    if (userCart) {
      await db.delete(cartItems).where(eq(cartItems.cartId, userCart.id));
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order: {
          ...newOrder,
          items: orderItemsData,
        },
      },
    });
  })
);

/**
 * PUT /api/orders/:id/status
 * Update order status (owner only).
 */
router.put(
  '/:id/status',
  authorizeOwner,
  validate(updateOrderStatusSchema),
  asyncHandler(async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.id, 10);
    const { status, notes } = req.body;

    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    const [updated] = await db
      .update(orders)
      .set({
        status,
        ...(notes && { notes }),
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: { order: updated },
    });
  })
);

/**
 * POST /api/orders/:id/cancel
 * Cancel an order (customer - only pending/confirmed orders).
 */
router.post(
  '/:id/cancel',
  asyncHandler(async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.id, 10);

    const [order] = await db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, req.user!.id)))
      .limit(1);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      throw new AppError('Order cannot be cancelled at this stage', 400);
    }

    // Restore inventory
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));

    for (const item of items) {
      const inventoryConditions = [eq(inventory.productId, item.productId)];
      if (item.variantId) {
        inventoryConditions.push(eq(inventory.variantId, item.variantId));
      }

      await db
        .update(inventory)
        .set({
          stock: sql`${inventory.stock} + ${item.quantity}`,
          updatedAt: new Date(),
        })
        .where(and(...inventoryConditions));
    }

    const [updated] = await db
      .update(orders)
      .set({ status: 'cancelled', updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: { order: updated },
    });
  })
);

export default router;
