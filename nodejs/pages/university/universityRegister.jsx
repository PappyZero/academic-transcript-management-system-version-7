import { useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';

export default function UniversityRegister() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    walletAddress: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/university/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      toast.success('Registration successful!');
      router.push('/university/universityDashboard');
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-green-500 mb-6 text-center">
            University Registration
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="University Name"
                required
                className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 border border-gray-700"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Official Email"
                required
                className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 border border-gray-700"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Academic Exam Officer's Wallet Address"
                required
                className="w-full p-3 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-green-500 border border-gray-700"
                onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-lg transition-all ${
                loading ? 'bg-gray-700 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
              } text-white font-medium flex items-center justify-center gap-2`}
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
                  Processing...
                </>
              ) : (
                'Register University'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            <p>Already have an account?</p>
            <button
              onClick={() => router.push('/auth/signin')}
              className="text-green-500 hover:text-green-400 font-medium mt-1 underline"
            >
              Login instead
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}