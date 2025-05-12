import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../../app';
import { config } from '../../config';
import 'express-session';

export const updateAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Get the first admin
    const admin = await prisma.admin.findFirst();
    console.log('Current admin:', admin);
    
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, config.security.bcryptSaltRounds);
    console.log('New hashed password:', hashedPassword);

    // Update admin
    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data: {
        email,
        password: hashedPassword
      }
    });
    console.log('Updated admin:', updatedAdmin);

    // Delete all existing sessions
    await prisma.session.deleteMany({
      where: { adminId: admin.id }
    });

    res.json({ 
      message: 'Admin credentials updated successfully',
      email: updatedAdmin.email
    });
  } catch (error) {
    console.error('Update admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if any admin exists
    const adminCount = await prisma.admin.count();
    if (adminCount > 0) {
      return res.status(403).json({ error: 'Registration is disabled. Admin already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, config.security.bcryptSaltRounds);

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword
      }
    });

    // Set admin ID in session
    req.session.adminId = admin.id;

    // Create session record
    await prisma.session.create({
      data: {
        adminId: admin.id,
        expiresAt: new Date(Date.now() + config.session.ttl * 1000)
      }
    });

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log('Login attempt with email:', email);

  try {
    const admin = await prisma.admin.findUnique({
      where: { email }
    });
    console.log('Found admin:', admin);

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set admin ID in session
    req.session.adminId = admin.id;

    // Create session record
    await prisma.session.create({
      data: {
        adminId: admin.id,
        expiresAt: new Date(Date.now() + config.session.ttl * 1000)
      }
    });

    res.json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    if (req.session.adminId) {
      // Delete all sessions for this admin
      await prisma.session.deleteMany({
        where: { adminId: req.session.adminId }
      });
    }

    // Destroy session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.status(500).json({ error: 'Failed to logout' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout successful' });
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCurrentAdmin = async (req: Request, res: Response) => {
  if (!req.admin) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  res.json({
    id: req.admin.id,
    email: req.admin.email
  });
}; 