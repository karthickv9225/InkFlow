import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const app: Express = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Mock storage
const mockUsersStorage: any = {};
const mockBlogsStorage: any = {};
const mockLikesStorage: any = {};
const mockCommentsStorage: any = {};

// Auth Routes
app.post('/auth/register', (req: Request, res: Response): void => {
  try {
    const { email, username, password } = req.body;
    
    if (!email || !username || !password) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    if (mockUsersStorage[email]) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const userId = `user_${Date.now()}`;
    mockUsersStorage[email] = {
      id: userId,
      email,
      username,
      password,
    };

    const token = Buffer.from(`${email}:${userId}`).toString('base64');

    res.json({
      user: { id: userId, email, username },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/auth/login', (req: Request, res: Response): void => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const user = mockUsersStorage[email];
    if (!user || user.password !== password) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = Buffer.from(`${email}:${user.id}`).toString('base64');

    res.json({
      user: { id: user.id, email: user.email, username: user.username },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Public Routes
app.get('/public/feed', (req: Request, res: Response): void => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const blogs = Object.values(mockBlogsStorage)
      .filter((blog: any) => blog.isPublished)
      .sort((a: any, b: any) => b.createdAt - a.createdAt);
    
    const total = blogs.length;
    const start = (page - 1) * limit;
    const paginatedBlogs = blogs.slice(start, start + limit);

    res.json({
      data: paginatedBlogs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/public/blogs/:slug', (req: Request, res: Response): void => {
  try {
    const blog = Object.values(mockBlogsStorage).find(
      (b: any) => b.slug === req.params.slug && b.isPublished
    );

    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Blogs Routes (Protected)
app.post('/blogs', (req: Request, res: Response): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decoded = Buffer.from(token, 'base64').toString().split(':');
    const userId = decoded[1];

    const { title, slug, content, isPublished } = req.body;
    const blogId = `blog_${Date.now()}`;

    mockBlogsStorage[blogId] = {
      id: blogId,
      title,
      slug,
      content,
      isPublished: isPublished || false,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      likes: 0,
      comments: [],
    };

    res.status(201).json(mockBlogsStorage[blogId]);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/blogs', (req: Request, res: Response): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decoded = Buffer.from(token, 'base64').toString().split(':');
    const userId = decoded[1];

    const blogs = Object.values(mockBlogsStorage).filter(
      (b: any) => b.userId === userId
    );

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.patch('/blogs/:id', (req: Request, res: Response): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decoded = Buffer.from(token, 'base64').toString().split(':');
    const userId = decoded[1];

    const blog = mockBlogsStorage[req.params.id];
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    if (blog.userId !== userId) {
      res.status(403).json({ message: 'You can only update your own blogs' });
      return;
    }

    Object.assign(blog, req.body, { updatedAt: Date.now() });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/blogs/:id', (req: Request, res: Response): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decoded = Buffer.from(token, 'base64').toString().split(':');
    const userId = decoded[1];

    const blog = mockBlogsStorage[req.params.id];
    if (!blog) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    if (blog.userId !== userId) {
      res.status(403).json({ message: 'You can only delete your own blogs' });
      return;
    }

    delete mockBlogsStorage[req.params.id];
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Like Routes
app.post('/public/blogs/:id/like', (req: Request, res: Response): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decoded = Buffer.from(token, 'base64').toString().split(':');
    const userId = decoded[1];

    const blog = Object.values(mockBlogsStorage).find((b: any) => b.id === req.params.id);
    if (!blog || !(blog as any).isPublished) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    const likeKey = `${userId}_${req.params.id}`;
    if (mockLikesStorage[likeKey]) {
      res.status(400).json({ message: 'Already liked' });
      return;
    }

    mockLikesStorage[likeKey] = true;
    (blog as any).likes = (blog as any).likes || 0;
    (blog as any).likes++;

    res.json({ message: 'Liked' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Comments Routes
app.post('/public/blogs/:id/comments', (req: Request, res: Response): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const decoded = Buffer.from(token, 'base64').toString().split(':');
    const userId = decoded[1];
    const { content } = req.body;

    const blog = Object.values(mockBlogsStorage).find((b: any) => b.id === req.params.id);
    if (!blog || !(blog as any).isPublished) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    const comment = {
      id: `comment_${Date.now()}`,
      userId,
      content,
      createdAt: Date.now(),
    };

    (blog as any).comments = (blog as any).comments || [];
    (blog as any).comments.push(comment);

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/public/blogs/:id/comments', (req: Request, res: Response): void => {
  try {
    const blog = Object.values(mockBlogsStorage).find((b: any) => b.id === req.params.id);
    if (!blog || !(blog as any).isPublished) {
      res.status(404).json({ message: 'Blog not found' });
      return;
    }

    res.json((blog as any).comments || []);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req: Request, res: Response): void => {
  res.json({ status: 'ok' });
});

export default app;
