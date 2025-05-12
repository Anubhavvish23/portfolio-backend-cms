import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { config } from '../src/config';
import { authRoutes } from '../src/routes/auth.routes';
import { projectRoutes } from '../src/routes/project.routes';
import { galleryRoutes } from '../src/routes/gallery.routes';
import { aboutMeRoutes } from '../src/routes/about-me.routes';

const prisma = new PrismaClient();
const app = express();

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.session.secure,
    maxAge: config.session.ttl * 1000
  }
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/about-me', aboutMeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export the Express API
export default app; 