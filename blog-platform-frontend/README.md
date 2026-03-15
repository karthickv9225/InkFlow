# Blog Platform Frontend

Modern blog platform frontend built with Next.js 15, TypeScript, and Tailwind CSS.

## Features

- ✅ User authentication (register/login)
- ✅ Create, edit, delete blogs
- ✅ Public blog feed with pagination
- ✅ Like system
- ✅ Comment system
- ✅ Responsive design
- ✅ Real-time updates

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **UI Components**: Lucide React
- **Notifications**: React Hot Toast

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Update `NEXT_PUBLIC_API_URL` if backend is on different port.

### 3. Start Development Server

```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

## Project Structure

```
app/
├── page.tsx                 # Home/Feed page
├── layout.tsx              # Root layout
├── globals.css             # Global styles
├── auth/
│   ├── login/page.tsx      # Login page
│   └── register/page.tsx   # Register page
├── dashboard/
│   ├── page.tsx            # Dashboard
│   └── create/page.tsx     # Create blog
├── blog/
│   └── [slug]/page.tsx     # Blog detail
lib/
├── api.ts                  # API client
└── store.ts                # Auth store
```

## Pages

### Public Pages
- `/` - Blog feed
- `/auth/login` - Login
- `/auth/register` - Register
- `/blog/[slug]` - Blog detail

### Protected Pages
- `/dashboard` - User dashboard
- `/dashboard/create` - Create blog
- `/dashboard/edit/[id]` - Edit blog

## API Integration

### Authentication

```typescript
// Register
POST /auth/register
{
  email: string
  username: string
  password: string
}

// Login
POST /auth/login
{
  email: string
  password: string
}
```

### Blogs

```typescript
// Create
POST /blogs
{
  title: string
  slug: string
  content: string
  summary?: string
  isPublished?: boolean
}

// Get user blogs
GET /blogs

// Update
PATCH /blogs/:id

// Delete
DELETE /blogs/:id
```

### Public

```typescript
// Get feed
GET /public/feed?page=1&limit=10

// Get blog
GET /public/blogs/:slug

// Like
POST /public/blogs/:id/like
DELETE /public/blogs/:id/like

// Comments
POST /public/blogs/:id/comments
GET /public/blogs/:id/comments
```

## State Management

### Auth Store (Zustand)

```typescript
const { user, token, setAuth, logout } = useAuthStore();
```

## Building

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project on Vercel
3. Set `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Environment Variables

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Troubleshooting

### Can't connect to backend
- Check `NEXT_PUBLIC_API_URL`
- Ensure backend is running
- Check CORS settings

### Authentication not working
- Clear localStorage
- Check token in browser DevTools
- Verify backend is returning token

### Styles not loading
- Clear `.next` folder
- Reinstall dependencies
- Restart dev server

## Performance

- ✅ Image optimization
- ✅ Code splitting
- ✅ Lazy loading
- ✅ Caching strategies

## Security

- ✅ JWT token storage
- ✅ Protected routes
- ✅ Input validation
- ✅ CORS enabled

## Contributing

1. Create feature branch
2. Make changes
3. Test locally
4. Submit PR

## License

MIT

## Support

For issues, check:
- Backend README
- API documentation
- Next.js docs: https://nextjs.org/docs
