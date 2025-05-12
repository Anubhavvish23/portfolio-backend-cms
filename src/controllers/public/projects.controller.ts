import { Request, Response } from 'express';
import { createHash } from 'crypto';
import { prisma } from '../../app';

export const getPublicProjects = async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        ratings: {
          select: {
            score: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate average ratings
    const projectsWithRatings = projects.map(project => ({
      ...project,
      averageRating: project.ratings.length > 0
        ? project.ratings.reduce((acc, curr) => acc + curr.score, 0) / project.ratings.length
        : null,
      ratingCount: project.ratings.length
    }));

    res.json(projectsWithRatings);
  } catch (error) {
    console.error('Get public projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const submitRating = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { score } = req.body;
  const ip = req.ip;

  // Validate score
  if (!score || score < 1 || score > 5) {
    return res.status(400).json({ error: 'Invalid rating score' });
  }

  try {
    // Hash IP address for privacy
    const hashedIp = createHash('sha256')
      .update(ip ?? '')
      .digest('hex');

    // Check if user has already rated this project
    const existingRating = await prisma.rating.findFirst({
      where: {
        projectId: parseInt(id),
        userIp: hashedIp
      }
    });

    if (existingRating) {
      return res.status(400).json({ error: 'You have already rated this project' });
    }

    // Create new rating
    const rating = await prisma.rating.create({
      data: {
        projectId: parseInt(id),
        score,
        userIp: hashedIp
      }
    });

    res.status(201).json(rating);
  } catch (error) {
    console.error('Submit rating error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 