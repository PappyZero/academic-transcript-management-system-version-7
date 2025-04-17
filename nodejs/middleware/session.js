import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Redirect to signin for all protected routes
  const protectedRoutes = ['/university', '/student', '/verifier'];
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
    
    // Role-based routing
    const rolePathMap = {
      university: '/university',
      student: '/student',
      verifier: '/verifier'
    };
    
    if (!pathname.startsWith(rolePathMap[token.role])) {
      return NextResponse.redirect(new URL(rolePathMap[token.role], req.url));
    }
  }

  return NextResponse.next();
}