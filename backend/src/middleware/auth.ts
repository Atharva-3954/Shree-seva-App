import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface JwtPayload {
  id: number;
  email: string;
  role: 'customer' | 'owner';
}

/**
 * Authentication middleware - verifies JWT token from Authorization header or cookies.
 * Attaches decoded user payload to req.user.
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token: string | undefined;

    // Check Authorization header first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // Fallback to cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
      return;
    }

    next(error);
  }
};

/**
 * Authorization middleware - restricts access to owner role only.
 * Must be used after authenticate middleware.
 */
export const authorizeOwner = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
    return;
  }

  if (req.user.role !== 'owner') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Owner privileges required.',
    });
    return;
  }

  next();
};
