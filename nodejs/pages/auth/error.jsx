import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const AuthErrorPage = () => {
  const router = useRouter();
  const { error } = router.query;
  const { data: session, status } = useSession();

  const errorMessages = {
    Configuration: 'Server configuration error - please contact support',
    AccessDenied: 'You don\'t have permission to access this resource',
    Verification: 'Verification token expired or invalid',
    CredentialsSignin: 'Invalid wallet connection or role mismatch',
    SessionRequired: 'Authentication required - please sign in',
    Default: 'An unexpected authentication error occurred'
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/auth/signin');
      toast.success('Successfully signed out');
    } catch (error) {
      toast.error('Error during sign out');
    }
  };

  // Clear error on component unmount
  useEffect(() => {
    return () => router.replace('/auth/error', undefined, { shallow: true });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
      <Navbar />
      
      <main className="flex-grow pt-20 p-6">
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-red-500 mb-4">
              🔐 Authentication Error
            </h1>
            <p className="text-gray-300 text-lg">
              {error ? errorMessages[error] : errorMessages.Default}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-gray-700 rounded-lg">
              <code className="text-sm text-red-300 font-mono">
                Error Code: {error}
              </code>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {status === 'authenticated' ? (
              <>
                <button
                  onClick={handleSignOut}
                  className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Sign Out & Retry
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Return Home
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  Try Sign In Again
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full py-3 px-6 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Return to Homepage
                </button>
              </>
            )}
          </div>

          <div className="mt-8 text-center text-sm text-gray-400">
            <p>Need help? Contact our support team:</p>
            <a 
              href="mailto:support@atms.com" 
              className="text-green-500 hover:text-green-400"
            >
              support@atms.com
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthErrorPage;