import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';

export default function UniversityLogin() {
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();

  // Check if the user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/university/session');
        if (res.ok) {
          router.push('/university/universityDashboard');
        }
      } catch (error) {
        toast.error('Session check failed');
      } finally {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [router]);

  // Handle MetaMask connection and login
  const handleConnect = async () => {
    setLoading(true);
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        toast.error('Please install MetaMask to connect.');
        return;
      }

      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const userAddress = accounts[0];

      // Get a signature from the user
      const message = 'Please sign this message to verify your identity.';
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);

      console.log('Wallet Address:', userAddress);
      console.log('Signature:', signature);

      // Send the address and signature to the backend for verification
      const response = await fetch('/api/university/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: userAddress, signature, message }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login API Error:', errorData);
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('Login API Response:', data);
      toast.success('Login successful!');
      router.push('/university/universityDashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Login error:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking session
  if (checkingSession) {
    return(
      <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 p-6">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
            <p className="text-black">Checking session...</p>
          </div>
        </main>
      </div>
      );
  }

  // Render the login page
  return (
    <div className="min-h-screen text-white">
      <Navbar />
      {/* Background Decoration */}
      <div className="blob top-right"></div>
      <div className="blob top-left animation-delay-2000"></div>

      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-white">Exam Officer Login</h1>
          <button
            onClick={handleConnect}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-600 transition-colors duration-200"
          >
            {loading ? 'Connecting...' : 'Connect MetaMask'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}