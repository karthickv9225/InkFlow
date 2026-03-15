# Complete Setup Instructions

## Backend Setup (NestJS)

### 1. Install Dependencies

```bash
cd blog-platform-backend
npm install
```

### 2. Setup PostgreSQL Database

**Option A: Local PostgreSQL**
```bash
# macOS
brew install postgresql
brew services start postgresql

# Create database
createdb blog_platform

# Get connection string
postgresql://postgres:password@localhost:5432/blog_platform
```

**Option B: Supabase (Cloud)**
1. Go to https://supabase.com
2. Create new project
3. Copy connection string from Settings → Database

**Option C: Railway/Render**
- Create PostgreSQL database
- Copy connection string

### 3. Configure Environment

```bash
cp .env.example .env
```

Update `.env`:
```env
DATABASE_URL="postgresql://user:password@host:5432/blog_platform"
JWT_SECRET="your-super-secret-key"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

### 4. Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

### 5. Start Backend

```bash
npm run start:dev
```

Backend runs on: `http://localhost:3001`

---

## Frontend Setup (Next.js 15)

### 1. Create Next.js Project

```bash
npx create-next-app@latest blog-platform-frontend \
  --typescript \
  --tailwind \
  --app \
  --no-eslint
```

### 2. Install Dependencies

```bash
cd blog-platform-frontend
npm install axios zustand next-auth
```

### 3. Create API Client

Create `lib/api.ts`:
```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### 4. Create Auth Store

Create `lib/store.ts`:
```typescript
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));
```

### 5. Create Pages

**app/page.tsx** - Home/Feed
```typescript
'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await api.get('/public/feed');
        setBlogs(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Blog Feed</h1>
      <div className="space-y-4">
        {blogs.map((blog: any) => (
          <div key={blog.id} className="border p-4 rounded">
            <h2 className="text-2xl font-bold">{blog.title}</h2>
            <p className="text-gray-600">By {blog.author.username}</p>
            <p className="mt-2">{blog.summary || blog.content.substring(0, 100)}...</p>
            <div className="mt-2 flex gap-4 text-sm text-gray-500">
              <span>❤️ {blog._count.likes}</span>
              <span>💬 {blog._count.comments}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**app/auth/register/page.tsx** - Register
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function Register() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', formData);
      setAuth(data.user, data.access_token);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
```

### 6. Start Frontend

```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## Deployment

### Backend Deployment (Railway)

1. Push code to GitHub
2. Go to https://railway.app
3. Create new project
4. Connect GitHub repository
5. Add PostgreSQL database
6. Set environment variables
7. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Go to https://vercel.com
3. Import project
4. Set `NEXT_PUBLIC_API_URL` to backend URL
5. Deploy

---

## Testing

### Backend

```bash
npm run test
npm run test:cov
```

### Frontend

```bash
npm run test
```

---

## API Documentation

### Authentication

**Register**
```bash
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}

Response:
{
  "access_token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "username": "username"
  }
}
```

**Login**
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Blogs

**Create Blog**
```bash
POST /blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Blog",
  "slug": "my-blog",
  "content": "Blog content...",
  "summary": "Summary...",
  "isPublished": true
}
```

**Get User Blogs**
```bash
GET /blogs
Authorization: Bearer <token>
```

**Update Blog**
```bash
PATCH /blogs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "isPublished": true
}
```

**Delete Blog**
```bash
DELETE /blogs/:id
Authorization: Bearer <token>
```

### Public

**Get Feed**
```bash
GET /public/feed?page=1&limit=10
```

**Get Blog by Slug**
```bash
GET /public/blogs/:slug
```

**Like Blog**
```bash
POST /public/blogs/:id/like
Authorization: Bearer <token>
```

**Unlike Blog**
```bash
DELETE /public/blogs/:id/like
Authorization: Bearer <token>
```

**Add Comment**
```bash
POST /public/blogs/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great blog!"
}
```

**Get Comments**
```bash
GET /public/blogs/:id/comments?page=1&limit=10
```

---

## Next Steps

1. ✅ Setup backend with NestJS
2. ✅ Setup PostgreSQL database
3. ✅ Create Next.js frontend
4. ✅ Implement authentication pages
5. ✅ Create blog management dashboard
6. ✅ Create public feed page
7. ✅ Implement like/comment features
8. ✅ Deploy to production

---

## Troubleshooting

### Backend won't start

```bash
# Check if port 3001 is in use
lsof -i :3001

# Check database connection
psql $DATABASE_URL

# Regenerate Prisma client
npm run prisma:generate
```

### Frontend can't connect to backend

- Check `NEXT_PUBLIC_API_URL` environment variable
- Ensure backend is running on correct port
- Check CORS settings in backend

### Database errors

```bash
# Reset database (development only)
npx prisma migrate reset

# View database
npm run prisma:studio
```

---

## Support

For issues, check:
- Backend README.md
- Prisma documentation: https://www.prisma.io/docs
- NestJS documentation: https://docs.nestjs.com
- Next.js documentation: https://nextjs.org/docs
