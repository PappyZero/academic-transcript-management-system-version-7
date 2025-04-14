import { sealData, unsealData } from 'iron-session';

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'vuna-session',
  ttl: 60 * 60 * 24 * 7, // 1 week expiration
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  },
};

export async function createSession(res, userData) {
  try {
    // Validate required user data
    if (!userData?.userId || !userData?.role || !userData?.address) {
      throw new Error('Invalid user data for session creation');
    }

    // Create sealed session data
    const session = await sealData({
      user: {
        id: userData.userId,
        address: userData.address,
        role: userData.role,
        institution: userData.institution || null,
      },
      issuedAt: Date.now(),
    }, sessionOptions);

    // Set HTTP-only secure cookie
    res.setHeader(
      'Set-Cookie',
      `${sessionOptions.cookieName}=${session}; ` +
      `HttpOnly; Secure; Path=/; ` +
      `Max-Age=${sessionOptions.ttl}; ` +
      `SameSite=${sessionOptions.cookieOptions.sameSite}`
    );

    return session;
  } catch (error) {
    console.error('Session creation error:', error);
    throw new Error('Failed to create user session');
  }
}

export async function getSession(req) {
  try {
    const cookies = req.cookies;
    if (!cookies[sessionOptions.cookieName]) {
      return null;
    }

    const session = await unsealData(
      cookies[sessionOptions.cookieName],
      sessionOptions
    );

    // Validate session structure
    if (!session.user?.id || !session.user?.role) {
      console.warn('Invalid session structure');
      return null;
    }

    return session;
  } catch (error) {
    console.error('Session decryption error:', error);
    return null;
  }
}

export function destroySession(res) {
  res.setHeader(
    'Set-Cookie',
    `${sessionOptions.cookieName}=; ` +
    `HttpOnly; Secure; Path=/; ` +
    `Expires=Thu, 01 Jan 1970 00:00:00 GMT; ` +
    `SameSite=${sessionOptions.cookieOptions.sameSite}`
  );
}