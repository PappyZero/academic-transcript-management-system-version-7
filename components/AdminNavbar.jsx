import Link from 'next/link';
import Image from 'next/image';

export default function AdminNavbar() {
  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-700 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="flex-shrink-0 flex items-center space-x-2">
                <Image
                  src="/pappy_tech.svg"
                  alt="ATMS Admin Logo"
                  width={70}
                  height={30}
                  className="dark:invert hover:rotate-12 transition-transform duration-300"
                  priority
                />
                <span className="hidden md:block text-white text-xl font-bold tracking-tight">
                  ATMS Admin
                </span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/admin/adminIndex">
              <span className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Dashboard
              </span>
            </Link>
            <Link href="/about-us/about-us">
              <span className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                About Us
              </span>
            </Link>
            <Link href="/contact-us/contact-us">
              <span className="text-gray-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                Contact Us
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 