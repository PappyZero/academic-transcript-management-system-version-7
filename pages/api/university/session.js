import { getSession } from '../../../lib/session';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Checking session...');

    // Get the session data
    const session = await getSession(req);
    console.log('Session data:', session);

    if (!session) {
      console.error('No active session found');
      return res.status(401).json({ message: 'No active session' });
    }

    // If the session is valid, return a success response
    res.status(200).json({ message: 'Session is valid', user: { address: session.address } });
  } catch (error) {
    console.error('Session check error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}