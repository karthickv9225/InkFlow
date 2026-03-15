# Blog Platform Backend

Production-ready blog platform backend built with NestJS, PostgreSQL, and Prisma.

## Features

- ✅ User authentication (JWT-based)
- ✅ Blog management (CRUD)
- ✅ Public blog feed with pagination
- ✅ Like system with duplicate prevention
- ✅ Comment system
- ✅ Proper error handling
- ✅ Input validation
- ✅ Database constraints

## Tech Stack

- **Framework**: NestJS 10
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT + Passport
- **Validation**: class-validator

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

Update `DATABASE_URL` with your PostgreSQL connection string.

### 3. Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 4. Start Development Server

```bash
npm run start:dev
```

Server will run on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Blogs (Protected)

- `POST /blogs` - Create blog
- `GET /blogs` - Get user's blogs
- `GET /blogs/:id` - Get blog details
- `PATCH /blogs/:id` - Update blog
- `DELETE /blogs/:id` - Delete blog

### Public

- `GET /public/feed?page=1&limit=10` - Get published blogs feed
- `GET /public/blogs/:slug` - Get blog by slug
- `POST /public/blogs/:id/like` - Like blog (protected)
- `DELETE /public/blogs/:id/like` - Unlike blog (protected)
- `POST /public/blogs/:id/comments` - Add comment (protected)
- `GET /public/blogs/:id/comments?page=1&limit=10` - Get comments

## Architecture

### Folder Structure

```
src/
├── auth/              # Authentication module
│   ├── dto/          # Data transfer objects
│   ├── guards/       # JWT guard
│   ├── strategies/   # Passport strategies
│   ├── auth.service.ts
│   ├── auth.controller.ts
│   └── auth.module.ts
├── blogs/            # Blogs module
│   ├── dto/
│   ├── blogs.service.ts
│   ├── blogs.controller.ts
│   └── blogs.module.ts
├── public/           # Public endpoints module
│   ├── public.service.ts
│   ├── public.controller.ts
│   └── public.module.ts
├── prisma/           # Prisma module
│   ├── prisma.service.ts
│   └── prisma.module.ts
├── app.module.ts
└── main.ts
```

### Database Schema

**User**
- id (primary key)
- email (unique)
- username (unique)
- passwordHash
- createdAt
- updatedAt

**Blog**
- id (primary key)
- userId (foreign key)
- title
- slug (unique)
- content
- summary (nullable)
- isPublished
- createdAt
- updatedAt

**Like**
- id (primary key)
- userId (foreign key)
- blogId (foreign key)
- createdAt
- Constraint: unique(userId, blogId)

**Comment**
- id (primary key)
- blogId (foreign key)
- userId (foreign key)
- content
- createdAt
- updatedAt

## Security

- ✅ Password hashing with bcrypt
- ✅ JWT-based authentication
- ✅ Input validation with class-validator
- ✅ Ownership verification for blog operations
- ✅ Duplicate like prevention with DB constraint
- ✅ Proper error responses (no sensitive data)

## Performance

- ✅ Optimized Prisma queries (no N+1)
- ✅ Pagination support
- ✅ Database indexes on frequently queried fields
- ✅ Efficient relationships loading

## Testing

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## Deployment

### Environment Variables

Set these in your deployment platform:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend.com
```

### Build

```bash
npm run build
npm run start:prod
```

### Recommended Platforms

- **Backend**: Railway, Render, Fly.io
- **Database**: Neon, Supabase, Railway

## Scaling to 1M Users

### Database Optimization

1. **Connection Pooling**: Use PgBouncer or Prisma connection pooling
2. **Read Replicas**: Set up read replicas for public feed queries
3. **Caching**: Implement Redis for frequently accessed data
4. **Sharding**: Shard by userId for large datasets

### API Optimization

1. **Rate Limiting**: Implement rate limiting on public endpoints
2. **Caching**: Cache public feed with CDN
3. **Async Jobs**: Use Bull/BullMQ for background tasks
4. **Load Balancing**: Use load balancer for multiple instances

### Infrastructure

1. **Horizontal Scaling**: Run multiple backend instances
2. **CDN**: Cache static content
3. **Monitoring**: Use APM tools (New Relic, DataDog)
4. **Logging**: Structured logging with ELK stack

## Bonus Features

### Rate Limiting

```typescript
// Implement with express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use('/public/feed', limiter);
```

### Async Jobs

```typescript
// Implement with Bull/BullMQ
import { Queue } from 'bull';

const blogQueue = new Queue('blog-processing');

blogQueue.process(async (job) => {
  // Generate summary, send notifications, etc.
});
```

### Structured Logging

```typescript
// Implement with Pino
import pino from 'pino';

const logger = pino();
logger.info({ userId, action: 'blog_created' });
```

## Troubleshooting

### Database Connection Error

```bash
# Check DATABASE_URL format
# postgresql://user:password@host:port/database

# Test connection
psql $DATABASE_URL
```

### JWT Errors

- Ensure JWT_SECRET is set
- Check token expiration
- Verify Authorization header format: `Bearer <token>`

### Prisma Issues

```bash
# Regenerate Prisma client
npm run prisma:generate

# Reset database (development only)
npx prisma migrate reset
```

## Contributing

1. Create feature branch
2. Make changes
3. Run tests
4. Submit PR

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
