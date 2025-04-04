import { destroySession } from '../../../lib/session';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Destroy the session
    destroySession(res);

    // Clear client-side cache
    res.setHeader('Cache-Control', 'no-store, max-age=0');

    // Return a success response
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}