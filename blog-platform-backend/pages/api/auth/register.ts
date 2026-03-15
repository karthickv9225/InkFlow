import type { NextApiRequest, NextApiResponse } from 'next';
import { mockUsersStorage } from '@/lib/storage';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, username, password } = req.body;
    
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (mockUsersStorage[email]) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userId = `user_${Date.now()}`;
    mockUsersStorage[email] = {
      id: userId,
      email,
      username,
      password,
    };

    const token = Buffer.from(`${email}:${userId}`).toString('base64');

    res.status(201).json({
      user: { id: userId, email, username },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
