import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // Check if admin exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: 'admin@example.com' }
  })

  if (!existingAdmin) {
    // Create an admin user
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@example.com',
        password: 'your_secure_password', // Make sure to hash this in production
      },
    })
    console.log('Admin user created')
  }

  // Check if projects exist
  const existingProjects = await prisma.project.findMany()
  if (existingProjects.length === 0) {
    // Create some projects
    const project1 = await prisma.project.create({
      data: {
        title: 'Portfolio Website',
        description: 'A modern portfolio website built with Next.js and Prisma',
        techStack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL'],
      },
    })

    const project2 = await prisma.project.create({
      data: {
        title: 'E-commerce Platform',
        description: 'Full-stack e-commerce solution',
        techStack: ['React', 'Node.js', 'MongoDB'],
      },
    })
    console.log('Projects created')
  }

  // Check if gallery items exist
  const existingGallery = await prisma.gallery.findMany()
  if (existingGallery.length === 0) {
    // Create some gallery items
    const gallery1 = await prisma.gallery.create({
      data: {
        title: 'Project Screenshot 1',
        description: 'Main dashboard view',
        imageUrl: 'https://example.com/image1.jpg',
      },
    })
    console.log('Gallery items created')
  }

  // Check if about me exists
  const existingAboutMe = await prisma.aboutMe.findFirst()
  if (!existingAboutMe) {
    // Create about me content
    const aboutMe = await prisma.aboutMe.create({
      data: {
        content: 'I am a full-stack developer passionate about creating modern web applications.',
      },
    })
    console.log('About me content created')
  }

  console.log('Seed data check completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 