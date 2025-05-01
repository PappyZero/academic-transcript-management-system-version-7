import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function ProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(router.asPath)}`);
    } else if (status === 'authenticated' && !allowedRoles.includes(session.user.role)) {
      // Redirect to role-specific dashboard if trying to access wrong route
      const redirectMap = {
        university: '/university/universityDashboard',
        student: '/student/studentDashboard',
        verifier: '/verifier/verifierDashboard'
      };
      router.push(redirectMap[session.user.role] || '/auth/signin');
    }
  }, [status, session, allowedRoles, router]);

  if (status === 'authenticated' && allowedRoles.includes(session.user.role)) {
    return children;
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-white text-lg">Verifying permissions...</div>
    </div>
  );
}