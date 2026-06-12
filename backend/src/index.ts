import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import logger from './utils/logger';
import { initDatabase } from './database';
import { initRedis } from './cache/redis';
import { startDataIngestion } from './services/data-ingestion';
import { startEIAMonitor } from './services/eia-usda-monitor';
import { startCOTAnalyzer } from './services/cot-analyzer';
import { startNewsAggregator } from './services/news-aggregator';
import { startRadioStreamer } from './services/radio-streamer';

// Routes
import priceRoutes from './routes/prices';
import alertRoutes from './routes/alerts';
import cotRoutes from './routes/cot';
import newsRoutes from './routes/news';
import analyticsRoutes from './routes/analytics';
import healthRoutes from './routes/health';

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// WebSocket namespaces
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  socket.on('subscribe', (symbol: string) => {
    socket.join(`price:${symbol}`);
    logger.debug(`Client subscribed to ${symbol}`);
  });

  socket.on('unsubscribe', (symbol: string) => {
    socket.leave(`price:${symbol}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Expose io globally for services
declare global {
  var io: Server;
}
global.io = io;

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/cot', cotRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialization
async function start() {
  try {
    logger.info('🚀 Starting Commodities Trading Ecosystem...');

    // Initialize database
    await initDatabase();
    logger.info('✅ Database connected');

    // Initialize Redis
    await initRedis();
    logger.info('✅ Redis connected');

    // Start services
    await Promise.all([
      startDataIngestion(),
      process.env.ENABLE_EIA_MONITOR === 'true' && startEIAMonitor(),
      process.env.ENABLE_COT_ANALYSIS === 'true' && startCOTAnalyzer(),
      process.env.ENABLE_NEWS_AGGREGATION === 'true' && startNewsAggregator(),
      process.env.ENABLE_RADIO_STREAMING === 'true' && startRadioStreamer(),
    ].filter(Boolean));

    logger.info('✅ All services started');

    // Start HTTP server
    httpServer.listen(PORT, () => {
      logger.info(`🌾 Commodities Trading API running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

start();

export { httpServer, io };
