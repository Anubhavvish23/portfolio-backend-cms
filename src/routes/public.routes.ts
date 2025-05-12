import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { config } from '../config';
import { 
  getPublicProjects,
  submitRating 
} from '../controllers/public/projects.controller';

const router = Router();

// Rate limiter for ratings
const ratingLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: 5, // 5 ratings per window
  message: { error: 'Too many rating submissions, please try again later' }
});

// Public project routes
router.get('/projects', getPublicProjects);
router.post('/projects/:id/rate', ratingLimiter, submitRating);

export default router; 