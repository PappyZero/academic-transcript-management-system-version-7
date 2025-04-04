import { sealData, unsealData } from 'iron-session';

export const sessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD, // Ensure this is at least 32 characters long
  cookieName: 'uni-session',
  ttl: 60 * 60 * 24, // Session expires in 24 hours
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function createSession(res, address) {
  try {
    const session = await sealData({ address }, sessionOptions);
    res.setHeader(
      'Set-Cookie',
      `${sessionOptions.cookieName}=${session}; HttpOnly; Secure; Path=/; SameSite=Strict`
    );
    console.log('Session cookie set successfully');
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

export async function getSession(req) {
  try {
    const cookie = req.cookies[sessionOptions.cookieName];
    console.log('Session cookie:', cookie);

    if (!cookie) {
      console.error('No session cookie found');
      return null;
    }

    const session = await unsealData(cookie, sessionOptions);
    console.log('Decrypted session data:', session);
    return session;
  } catch (error) {
    console.error('Error retrieving session:', error);
    return null;
  }
}

export function destroySession(res) {
  res.setHeader(
    'Set-Cookie',
    `${sessionOptions.cookieName}=; Max-Age=0; HttpOnly; Secure; Path=/; SameSite=Strict`
  );
}