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
    const { id } = req.query as { id: string };

    const blog = mockBlogsStorage[id];
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (req.method === 'PATCH') {
      if (blog.userId !== userId) {
        return res.status(403).json({ message: 'You can only update your own blogs' });
      }

      Object.assign(blog, req.body, { updatedAt: Date.now() });
      return res.status(200).json(blog);
    }

    if (req.method === 'DELETE') {
      if (blog.userId !== userId) {
        return res.status(403).json({ message: 'You can only delete your own blogs' });
      }

      delete mockBlogsStorage[id];
      return res.status(200).json({ message: 'Blog deleted' });
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
