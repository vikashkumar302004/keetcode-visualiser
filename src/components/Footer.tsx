import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-10 border-t border-white/10 py-12 px-6 max-w-7xl mx-auto text-center text-xs text-gray-500 font-sans">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p 
          style={{ fontFamily: "'Playfair Display', serif", letterSpacing: '-0.02em' }} 
          className="text-xl text-gray-400 font-semibold"
        >
          Keetcode<sup className="text-xs font-sans ml-0.5 font-normal">®</sup> Systems
        </p>

        <p className="text-gray-400 font-normal">
          © {new Date().getFullYear()} Keetcode Inc. All rights reserved. Designed for deep thinkers and competitive programmers.
        </p>

        <div className="flex items-center space-x-6 text-gray-400 font-medium">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
};
