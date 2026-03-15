import type { NextApiRequest, NextApiResponse } from 'next';
import { mockUsersStorage } from '@/lib/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = mockUsersStorage[email];
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = Buffer.from(`${email}:${user.id}`).toString('base64');

    res.status(200).json({
      user: { id: user.id, email: user.email, username: user.username },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
