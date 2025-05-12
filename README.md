# Portfolio CMS Backend

A robust backend system for managing portfolio content, built with Express.js, TypeScript, and PostgreSQL.

## Features

- Admin authentication and authorization
- Project management
- Gallery management
- About me section
- Rating system for projects
- Session management
- Rate limiting
- CORS enabled
- Secure password handling

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Express Session
- Helmet (Security)
- CORS

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
   JWT_SECRET="your-secret-key"
   PORT=3003
   FRONTEND_URL="http://localhost:5173"
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Admin Routes
- POST `/api/admin/register` - Register new admin
- POST `/api/admin/login` - Admin login
- PUT `/api/admin/update` - Update admin credentials

### Public Routes
- GET `/api/projects` - Get all projects
- POST `/api/projects` - Create new project
- GET `/api/gallery` - Get gallery items
- POST `/api/gallery` - Add gallery item
- GET `/api/about` - Get about me content
- PUT `/api/about` - Update about me content

## Development

The project uses TypeScript for type safety and better development experience. The codebase is structured as follows:

- `src/` - Source code
  - `controllers/` - Route controllers
  - `routes/` - API routes
  - `middleware/` - Custom middleware
  - `config/` - Configuration files
  - `app.ts` - Main application file

## License

MIT 