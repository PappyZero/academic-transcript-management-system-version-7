import { getSession } from '../../../lib/session';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get the session data
    const session = await getSession(req);

    if (!session) {
      return res.status(401).json({ 
        message: 'No active session',
        code: 'UNAUTHENTICATED'
      });
    }

    // Return full session details including role
    res.status(200).json({
      message: 'Session is valid',
      user: {
        address: session.address,
        role: session.role,
        userId: session.userId,
        institution: session.institution
      }
    });

  } catch (error) {
    console.error('Session check error:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      code: 'SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}