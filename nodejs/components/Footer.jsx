import React from 'react';
import Image from 'next/image';

const Footer = () => {
  return (
    <div>
      <hr />
      <footer className="bg-gradient-to-r from-black to-black-700 shadow-xl text-white py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Builders Section */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Builders</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400 transition-colors">Tools</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Engineering blog</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400 transition-colors">Grants</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Events</a></li>
            </ul>
          </div>

          {/* Socials Section */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Socials</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400 transition-colors">X (Twitter)</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Discord</a></li>
            </ul>
          </div>

          {/* Base Section */}
          <div>
            <h3 className="font-bold mb-4 text-lg">Base</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-green-400 transition-colors">Terms of service</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors">Privacy policy</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-8 text-center">
          <a
            className="flex items-center gap-2 justify-center hover:text-green-400"
            href="https://www.veritas.edu.ng/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/logos/pappy_tech.jpg"
              alt="Veritas Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span>Copyright © 2025 Veritas : Software Engineering</span>
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Footer;