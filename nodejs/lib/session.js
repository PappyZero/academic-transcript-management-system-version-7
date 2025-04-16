import { sealData, unsealData } from 'iron-session';

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'uni-session',
  ttl: 60 * 60 * 24, // 24 hours
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function createSession(res, sessionData) {
  try {
    // Seal all session data including role and user ID
    const session = await sealData(sessionData, sessionOptions);
    
    res.setHeader(
      'Set-Cookie',
      `${sessionOptions.cookieName}=${session}; HttpOnly; Secure; Path=/; SameSite=Strict`
    );
    console.log('Session created for:', sessionData.address);
  } catch (error) {
    console.error('Session creation error:', error);
    throw error;
  }
}

export async function getSession(req) {
  try {
    const cookie = req.cookies[sessionOptions.cookieName];
    if (!cookie) return null;

    // Unseal all session data
    const session = await unsealData(cookie, sessionOptions);
    console.log('Session retrieved for:', session.address);
    return session;
  } catch (error) {
    console.error('Session retrieval error:', error);
    return null;
  }
}

export function destroySession(res) {
  res.setHeader(
    'Set-Cookie',
    `${sessionOptions.cookieName}=; Max-Age=0; HttpOnly; Secure; Path=/; SameSite=Strict`
  );
  console.log('Session destroyed');
}