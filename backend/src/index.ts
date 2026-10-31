import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { testConnection } from './config/database';
import { globalErrorHandler } from './middleware/errorHandler';
import routes from './routes/index';

const app = express();

// --------------- Middleware ---------------
app.use(helmet());
app.use(cors({
  origin: env.NODE_ENV === 'production'
    ? ['https://your-frontend-domain.com']
    : ['http://localhost:3000', 'http://localhost:8081', 'http://localhost:19006'],
  credentials: true,
}));
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --------------- Health Check ---------------
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// --------------- API Routes ---------------
app.use('/api', routes);

// --------------- 404 Handler ---------------
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// --------------- Global Error Handler ---------------
app.use(globalErrorHandler);

// --------------- Start Server ---------------
const startServer = async () => {
  // Test database connection
  await testConnection();

  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

export default app;
