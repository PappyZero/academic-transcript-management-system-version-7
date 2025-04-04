import Link from 'next/link';
import { Inter } from 'next/font/google';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export default function Home({ children }) {
  return (
    <div className={`${inter.variable} antialiased`}>
      <Navbar />
      {children}
      {/* Background Decoration */}
      <div className="blob top-right"></div>
      <div className="blob top-left animation-delay-2000"></div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl text-white font-bold mb-8">Academic Transcript Management System</h1>
        <div className="space-x-4">
          {/* <Link href="/admin/adminIndex">
            <span className="bg-blue-500 text-white px-4 py-2 rounded">Admin</span>
          </Link> */}
          <Link href="/university/universityLogin">
            <span className="bg-green-500 hover:bg-green-700 text-white px-6 py-4 rounded">University</span>
          </Link>
          <Link href="/student/studentDashboard">
            <span className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded">Student</span>
          </Link>
          <Link href="/verifier/verifierDashboard">
            <span className="bg-green-500 hover:bg-green-700 text-white px-6 py-4 rounded">Verifier</span>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}