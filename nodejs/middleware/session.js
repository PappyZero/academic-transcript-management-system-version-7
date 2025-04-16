import { getSession } from '../lib/session';

export const withSession = (handler, allowedRoles = []) => async (req, res) => {
  try {
    const session = await getSession(req);
    
    // Session validation
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Role-based access control
    if (allowedRoles.length > 0 && !allowedRoles.includes(session.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    // Attach user context to request
    req.user = {
      id: session.user.id,
      role: session.user.role,
      address: session.user.address,
      institution: session.user.institution
    };

    return handler(req, res);
  } catch (error) {
    console.error('Session middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};