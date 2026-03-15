import type { NextApiRequest, NextApiResponse } from 'next';
import { mockBlogsStorage, mockLikesStorage } from '@/lib/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = Buffer.from(token, 'base64').toString().split(':');
    const userId = decoded[1];
    const { id } = req.query as { id: string };

    const blog = Object.values(mockBlogsStorage).find((b: any) => b.id === id);
    if (!blog || !(blog as any).isPublished) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (req.method === 'POST') {
      const likeKey = `${userId}_${id}`;
      if (mockLikesStorage[likeKey]) {
        return res.status(400).json({ message: 'Already liked' });
      }

      mockLikesStorage[likeKey] = true;
      (blog as any).likes = (blog as any).likes || 0;
      (blog as any).likes++;

      return res.status(200).json({ message: 'Liked' });
    }

    if (req.method === 'DELETE') {
      const likeKey = `${userId}_${id}`;
      if (!mockLikesStorage[likeKey]) {
        return res.status(400).json({ message: 'Not liked' });
      }

      delete mockLikesStorage[likeKey];
      (blog as any).likes = Math.max(0, ((blog as any).likes || 1) - 1);

      return res.status(200).json({ message: 'Unliked' });
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
