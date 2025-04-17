import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { signIn, getSession } from 'next-auth/react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';

export default function UniversityLogin() {
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        const session = await getSession();
        if (session?.user?.role === 'university') {
          router.push('/university/universityDashboard');
        }
      } catch (error) {
        console.error('Session check error:', error);
        toast.error('Failed to verify session');
      } finally {
        setCheckingSession(false);
      }
    };

    checkExistingSession();
  }, [router]);

  const handleMetaMaskLogin = async () => {
    setLoading(true);
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask extension not detected');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0].toLowerCase();

      if (!ethers.isAddress(address)) {
        throw new Error('Invalid Ethereum address');
      }

      const result = await signIn('credentials', {
        redirect: false,
        walletAddress: address,
        role: 'university'
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success('Login successful!');
      router.push('/university/universityDashboard');
    } catch (error) {
      console.error('Authentication failed:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 p-6">
          <div className="max-w-md mx-auto bg-gray-900 rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-400">Verifying session...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      
      {/* Blob Background Decorations */}
      <div className="blob top-right"></div>
      <div className="blob top-left animation-delay-2000"></div>

      <div className="flex-grow flex flex-col items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-800">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-green-500 mb-2">
              University Login
            </h1>
            <p className="text-gray-400">
              Connect your institutional wallet to continue
            </p>
          </div>

          <button
            onClick={handleMetaMaskLogin}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-lg transition-all
              ${loading 
                ? 'bg-gray-800 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'}`}
          >
            {loading ? (
              <>
                <svg 
                  className="animate-spin h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-6 h-6"
                >
                  <path d="M20.5 14.26a1 1 0 0 0-1 1v4.74a1 1 0 0 1-1 1H4.5a1 1 0 0 1-1-1V9.48a1 1 0 0 1 1-1h4.74a1 1 0 0 0 0-2H4.5a3 3 0 0 0-3 3v10.52a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-4.74a1 1 0 0 0-1-1Z"/>
                  <path d="M8.5 14.26a1 1 0 0 0 1-1v-.52a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.52a1 1 0 0 0 2 0v-.52a4 4 0 0 0-4-4h-8a4 4 0 0 0-4 4v.52a1 1 0 0 0 1 1ZM22.5 4.5a2.5 2.5 0 0 0-5 0 1 1 0 0 0 2 0  .5.5 0 0 1 1 0 1 1 0 0 0 2 0Z"/>
                </svg>
                <span>Connect MetaMask Wallet</span>
              </>
            )}
          </button>

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Don't have an institutional account?</p>
            <button
              onClick={() => router.push('/university/universityRegister')}
              className="text-green-500 hover:text-green-400 font-medium mt-1 underline"
            >
              Register your university
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}