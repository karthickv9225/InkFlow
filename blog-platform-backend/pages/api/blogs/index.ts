import type { NextApiRequest, NextApiResponse } from 'next';
import { mockBlogsStorage } from '@/lib/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString().split(':');
    const userId = decoded[1];

    if (req.method === 'POST') {
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

      return res.status(201).json(mockBlogsStorage[blogId]);
    }

    if (req.method === 'GET') {
      const blogs = Object.values(mockBlogsStorage).filter(
        (b: any) => b.userId === userId
      );
      return res.status(200).json(blogs);
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
