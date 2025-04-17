import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SignInPage() {
  const [selectedRole, setSelectedRole] = useState('university');
  const [isConnecting, setIsConnecting] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setIsConnecting(true);
    try {
      if (!window.ethereum) throw new Error("Install MetaMask");
  
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = ethers.getAddress(accounts[0]); // Normalize the address
  
      console.log("Wallet Address:", address); // Debugging log
  
      const result = await signIn("credentials", {
        redirect: false,
        walletAddress: address,
        role: selectedRole,
      });
  
      if (result?.error) throw new Error(result.error);
  
      const redirectMap = {
        university: "/university/universityDashboard",
        student: "/student/studentDashboard",
        verifier: "/verifier/verifierDashboard",
      };
  
      router.push(redirectMap[selectedRole]);
      toast.success(`Signed in as ${selectedRole}`);
    } catch (error) {
      console.error("Sign-in error:", error); // Debugging log
      toast.error(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      {/* Blob Background Decorations */}
      <div className="blob top-right"></div>
      <div className="blob top-left animation-delay-2000"></div>
      
      <div className="flex-grow flex flex-col items-center justify-center p-4 z-10">
        <div className="w-full max-w-md bg-gray-900 rounded-xl shadow-2xl p-8 border border-gray-800">
          <div className="text-center mb-8 p-8 rounded-xl w-96">
            <h1 className="text-3xl font-bold text-green-500 mb-2">Sign In</h1>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-lg p-3"
                >
                  <option value="university">University</option>
                  <option value="student">Student</option>
                  <option value="verifier">Verifier</option>
                </select>
              </div>

              <button
                onClick={handleSignIn}
                disabled={isConnecting}
                className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg font-medium py-3 rounded-lg
                          disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>

              <div className="mt-4 text-center">
                {selectedRole === 'university' && (
                  <>
                    <p className="text-gray-400 text-sm">Academic institution administrators</p>
                    <div className="mt-6 text-center text-sm text-gray-400">
                      <p>Don't have an institutional account?</p>
                      <button
                        onClick={() => router.push('/university/universityRegister')}
                        className="text-green-500 hover:text-green-400 font-medium mt-1 underline"
                      >
                        Register your university
                      </button>
                    </div>
                  </>
                )}
                {selectedRole === 'student' && (
                  <p className="text-gray-400 text-sm">Students can view transcripts and request sharing</p>
                )}
                {selectedRole === 'verifier' && (
                  <p className="text-gray-400 text-sm">Verified organizations can validate documents</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}