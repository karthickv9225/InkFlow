import type { NextApiRequest, NextApiResponse } from 'next';
import { mockBlogsStorage } from '@/lib/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const blogs = Object.values(mockBlogsStorage)
      .filter((blog: any) => blog.isPublished)
      .sort((a: any, b: any) => b.createdAt - a.createdAt);
    
    const total = blogs.length;
    const start = (page - 1) * limit;
    const paginatedBlogs = blogs.slice(start, start + limit);

    res.status(200).json({
      data: paginatedBlogs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
