import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { login, logout, getCurrentAdmin, register, updateAdmin } from '../controllers/admin/auth.controller';
import { 
  createProject, 
  updateProject, 
  deleteProject, 
  getProjects 
} from '../controllers/admin/projects.controller';

const router = Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getCurrentAdmin);
router.put('/update', updateAdmin);

// Project routes
router.get('/projects', requireAuth, getProjects);
router.post('/projects', requireAuth, createProject);
router.put('/projects/:id', requireAuth, updateProject);
router.delete('/projects/:id', requireAuth, deleteProject);

export default router; 