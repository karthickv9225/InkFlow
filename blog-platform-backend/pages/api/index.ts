import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    message: 'InkFlow Blog Platform API',
    version: '1.0.0',
    endpoints: {
      auth: ['/api/auth/register', '/api/auth/login'],
      public: ['/api/public/feed', '/api/public/blogs/:slug'],
      blogs: ['/api/blogs', '/api/blogs/:id'],
      health: '/api/health'
    }
  });
}
