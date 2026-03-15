import type { NextApiRequest, NextApiResponse } from 'next';
import { mockBlogsStorage } from '@/lib/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query as { id: string };
    const blog = Object.values(mockBlogsStorage).find((b: any) => b.id === id);

    if (!blog || !(blog as any).isPublished) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (req.method === 'GET') {
      return res.status(200).json((blog as any).comments || []);
    }

    if (req.method === 'POST') {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const decoded = Buffer.from(token, 'base64').toString().split(':');
      const userId = decoded[1];
      const { content } = req.body;

      const comment = {
        id: `comment_${Date.now()}`,
        userId,
        content,
        createdAt: Date.now(),
      };

      (blog as any).comments = (blog as any).comments || [];
      (blog as any).comments.push(comment);

      return res.status(201).json(comment);
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
