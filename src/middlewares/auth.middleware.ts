import { Request, Response, NextFunction } from 'express';
import { prisma } from '../app';

declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: number;
        email: string;
      };
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.adminId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.session.adminId },
      select: { id: true, email: true }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Admin not found' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 