import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export default function ProtectedRoute({ children }) {
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      try {
        console.log('Verifying session...');
        const res = await fetch('/api/university/session');

        // If the session check fails, redirect to the login page
        if (!res.ok) {
          const errorData = await res.json();
          console.error('Session check failed:', errorData);
          toast.error('Please login to access this page');
          router.push('/university/universityLogin');
          return;
        }

        // If the session is valid, do nothing (allow access to the protected route)
        const data = await res.json();
        console.log('Session is valid:', data);
      } catch (error) {
        console.error('Error verifying session:', error);
        toast.error('An error occurred while verifying your session. Please try again.');
        router.push('/university/universityLogin');
      }
    };

    // Call the session verification function
    verifySession();

    // Cleanup function (optional, but good practice)
    return () => {
      // Any cleanup logic (if needed)
    };
  }, [router]); // Add `router` to the dependency array

  // Render the children if the session is valid
  return <>{children}</>;
}