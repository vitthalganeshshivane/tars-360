import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Route imports
import authRoutes from './routes/authRoutes.js';
import photoRoutes from './routes/photoRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import tourRoutes from './routes/tourRoutes.js';
import galleryRoutes from './routes/galleryRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import miscRoutes from './routes/miscRoutes.js';
import systemRoutes from './routes/systemRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5000, message: { success: false, message: 'Too many requests' } });
app.use('/api', limiter);

// Body parsing — 50mb to handle large 360° panorama images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/tours', tourRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api', miscRoutes);
app.use('/api', systemRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'TARS 360° API is running', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

export default app;
