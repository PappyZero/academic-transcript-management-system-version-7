import Link from 'next/link';
import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export default function Home({ children }) {
  return (
    <div className={`${inter.variable} antialiased flex flex-col`}>
      <Navbar />
      <main className="flex-grow">
        {children}
        <section className="relative py-20 md:py-32 overflow-hidden min-h-screen">
          {/* Background Decoration */}
          <div className="blob top-right"></div>
          <div className="blob top-left animation-delay-2000"></div>
          
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Text Content */}
              <div className="md:w-1/2 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-6">
                  Revolutionizing Academic Record Management with Blockchain
                </h1>
                <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto md:mx-0">
                  A secure and efficient platform for managing academic transcripts using blockchain technology.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/auth/signin" className="bg-gregit een-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 shadow-lg">
                    Explore ATMS
                  </Link>
                  <Link href="/learn-more" className="border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
                    Learn More
                  </Link>
                </div>
              </div>

              {/* Video Section */}
              <div className="md:w-1/2 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
                  <div className="relative aspect-video bg-gradient-to-tr from-green-100 to-indigo-100">
                    <video
                      src="/videos/ATMS_Video.mp4"
                      alt="Blockchain academic records management"
                      width={800}
                      height={600}
                      className="object-cover object-center"
                      controls
                    />
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-3 -left-6 bg-white p-4 rounded-xl shadow-lg w-48">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </div>
                      <span className="text-sm font-semibold">Secure Verification</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}