import { Router } from 'express';

const router = Router();

// GET    /api/users/profile - Get user profile (authenticated)
// PUT    /api/users/profile - Update user profile
// PUT    /api/users/password - Change password
// GET    /api/users/addresses - Get user addresses
// POST   /api/users/addresses - Add new address
// PUT    /api/users/addresses/:id - Update address
// DELETE /api/users/addresses/:id - Delete address
// PUT    /api/users/addresses/:id/default - Set default address

export default router;

