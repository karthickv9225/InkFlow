import type { NextApiRequest, NextApiResponse } from 'next';
import { mockBlogsStorage } from '@/lib/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { slug } = req.query as { slug: string };
    const blog = Object.values(mockBlogsStorage).find(
      (b: any) => b.slug === slug && b.isPublished
    );

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
