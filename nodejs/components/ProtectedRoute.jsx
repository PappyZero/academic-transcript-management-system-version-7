import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function ProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      try {
        setIsLoading(true);
        
        // Fetch session data
        const res = await fetch('/api/university/session');
        const data = await res.json();

        // Handle unauthorized access
        if (!res.ok || !allowedRoles.includes(data.user?.role)) {
          throw new Error(
            data.user?.role 
              ? 'Insufficient permissions' 
              : 'Please login to access this page'
          );
        }

        // If authorized, allow access
        setIsAuthorized(true);
        
      } catch (error) {
        // Handle errors and redirect
        console.error('Access denied:', error);
        toast.error(error.message);
        
        // Redirect based on current path
        const redirectPath = router.asPath !== '/' ? `/home/home?redirect=${encodeURIComponent(router.asPath)}` : '/home/home';
        router.push(redirectPath);
        
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Checking permissions...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Redirecting...</div>
      </div>
    );
  }

  return <>{children}</>;
}