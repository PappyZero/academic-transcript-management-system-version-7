import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MagnifyingGlassIcon as SearchIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  return (
  <nav className="bg-black fixed w-full z-50 bg-transparent">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
      <div className="flex justify-between items-center h-17">
        {/* Logo and "ATMS" text */}
        <div className="flex items-center">
          <Link href="/">
            <span className="flex-shrink-0 flex items-center space-x-12">
              <Image
                src="/skull-icon.png"
                alt="Pappy Tech Logo"
                width={70}
                height={30}
                className="dark-invert hover:rotate-12 transition-transform duration-300"
                priority
              />
              <span className="hidden md:block text-white text-xl font-bold tracking-tight">
                ATMS
              </span>
            </span>
          </Link>
        </div>

        {/* Centered Navigation Links */}
        <div className="flex-1 flex justify-center items-center">
          <div className="hidden md:flex items-center space-x-8">
            {/* Regular Links */}
            <Link href="/home/home">
              <span className="text-white hover:bg-gradient-to-r from-green-300 to-green-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-green-500 bg-green bg-opacity-75">
                Home
              </span>
            </Link>
            <Link href="/about-us/about-us">
              <span className="text-white hover:bg-gradient-to-r from-green-300 to-green-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-green-500 bg-green bg-opacity-75">
                About
              </span>
            </Link>
            <Link href="/contact-us/contact-us">
              <span className="text-white hover:bg-gradient-to-r from-green-300 to-green-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 border-b-2 border-green-500 bg-green bg-opacity-75">
                Contact
              </span>
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="text-white hover:bg-gradient-to-r from-green-300 to-green-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-all duration-200 border-b-2 border-green-500 bg-green bg-opacity-75">
                Services
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 w-48 bg-black bg-opacity-90 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 
                invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
                <Link href="/services/verification">
                  <span className="hover:bg-gradient-to-r from-green-300 to-green-200 block px-4 py-2 text-sm text-white hover:text-black">Transcript Verification</span>
                </Link>
                <Link href="/services/issuance">
                  <span className="hover:bg-gradient-to-r from-green-300 to-green-200 block px-4 py-2 text-sm text-white hover:text-black">Digital Issuance</span>
                </Link>
                <Link href="/services/tracking">
                  <span className="hover:bg-gradient-to-r from-green-300 to-green-200 block px-4 py-2 text-sm text-white hover:text-black">Status Tracking</span>
                </Link>
              </div>
            </div>

            {/* More Dropdown */}
            <div className="relative group">
              <button className="text-white hover:bg-gradient-to-r from-green-300 to-green-200 hover:text-black px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1 transition-all duration-200 border-b-2 border-green-500 bg-green bg-opacity-75">
                More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 w-48 bg-black bg-opacity-90 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 
                invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
                <Link href="/about">
                  <span className="hover:bg-gradient-to-r from-green-300 to-green-200 block px-4 py-2 text-sm text-white hover:text-black">Lorem</span>
                </Link>
                <Link href="/contact">
                  <span className="hover:bg-gradient-to-r from-green-300 to-green-200 block px-4 py-2 text-sm text-white hover:text-black">Lorem</span>
                </Link>
                <Link href="/faq">
                  <span className="hover:bg-gradient-to-r from-green-300 to-green-200 block px-4 py-2 text-sm text-white hover:text-black">FAQs</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar and Connect Wallet Button - Aligned to End */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-white/10 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="Search transcripts..."
              className="px-4 py-2 bg-transparent text-white placeholder-white focus:outline-none w-64"
            />
            <button className="p-2 bg-green-300 hover:bg-black transition-colors duration-200">
              <SearchIcon className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Connect Wallet Button */}
          <Link href="/auth/signin">
            <button className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200">
              Connect Wallet
            </button>
          </Link>
        </div>
      </div>
    </div>
  </nav>
  );
};

export default Navbar;