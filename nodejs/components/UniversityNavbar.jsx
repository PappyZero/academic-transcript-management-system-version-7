import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';
import { FaWallet } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

export default function UniversityNavbar() {
  const { data: session } = useSession();
  const userAddress = session?.user?.walletAddress || '';
  
  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/'
      });
      localStorage.clear();
      window.location.href = '/auth/signin';
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const truncateAddress = (address) => {
    if (!address) return 'Not connected';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-black fixed w-full z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand Name */}
          <div className="flex items-center">
            <Link href="/">
              <span className="flex-shrink-0 flex items-center space-x-2">
                <Image
                  src="/skull-icon.png"
                  alt="Pappy Tech Logo"
                  width={70}
                  height={30}
                  className="light-invert hover:rotate-12 transition-transform duration-300"
                  priority
                />
                <span className="hidden md:block text-white text-xl font-bold tracking-tight">
                  ATMS
                </span>
              </span>
            </Link>
          </div>

          {/* Navigation Links - Centered */}
          <div className="flex-1 flex justify-center items-center">
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/university/universityDashboard">
                <span className="text-white hover:bg-gradient-to-r from-green-300 to-green-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-green-500 bg-green bg-opacity-75 cursor-pointer">
                  Dashboard
                </span>
              </Link>
              {/* <Link href="/about-us/about-us">
                <span className="text-white hover:bg-gradient-to-r from-green-300 to-green-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-green-500 bg-green bg-opacity-75 cursor-pointer">
                  About Us
                </span>
              </Link>
              <Link href="/contact-us/contact-us">
                <span className="text-white hover:bg-gradient-to-r from-green-300 to-green-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-green-500 bg-green bg-opacity-75 cursor-pointer">
                  Contact Us
                </span>
              </Link> */}
              <Link href="/university/upload-transcript">
                <span className="text-white hover:bg-gradient-to-r from-green-300 to-green-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-green-500 bg-green bg-opacity-75 cursor-pointer">
                  Upload Transcript
                </span>
              </Link>
              <Link href="/university/upload-transcript">
                <span className="text-white hover:bg-gradient-to-r from-green-300 to-green-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-green-500 bg-green bg-opacity-75 cursor-pointer">
                Transcript Share Request 
                </span>
              </Link>
            </div>
          </div>

          {/* Wallet Address and Logout Button - Aligned to End */}
          <div className="flex items-center space-x-8">
            {/* Wallet Address */}
            <div className="flex items-center gap-2">
              <span
                className="text-sm text-white flex items-center"
                data-tooltip-id="wallet-tooltip"
                data-tooltip-content={userAddress}
              >
                <FaWallet className="mr-2 text-green-500" />
                {truncateAddress(userAddress)}
              </span>
              <Tooltip
                id="wallet-tooltip"
                place="bottom"
                content={userAddress}
                className="!bg-gray-800 !text-white"
              />
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="text-white hover:bg-gradient-to-r from-green-300 to-green-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-green-500 bg-black bg-opacity-75 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}