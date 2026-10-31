// Extend Express Request interface to include user property from JWT

declare namespace Express {
  interface Request {
    user?: {
      id: number;
      email: string;
      role: 'customer' | 'owner';
    };
  }
}
