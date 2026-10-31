import { Router } from 'express';

const router = Router();

// GET  /api/notifications - Get current user notifications (authenticated)
// PUT  /api/notifications/:id/read - Mark notification as read
// PUT  /api/notifications/read-all - Mark all notifications as read

export default router;

