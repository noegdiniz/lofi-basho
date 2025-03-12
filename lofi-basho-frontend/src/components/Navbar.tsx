// Navbar.jsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, loading } = useAuth();

  if (loading) return null; // Or a loading spinner

  return (
    <nav className="w-full max-w-4xl mx-auto w-full px-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between bg-white/70 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        {/* Brand/Title */}
        <div className="text-gray-700 text-lg font-mono font-bold font">Bashō - Haiku</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
        {isAuthenticated ? (
            <>
                <a
                    href="/haikus"
                    className="text-gray-600 hover:text-amber-600 text-sm font-mono transition-colors"
                >
                    All Haikus
                </a>
                <a
                    href="/profile"
                    className="text-gray-600 hover:text-amber-600 text-sm font-mono transition-colors"
                >
                    Profile
                </a>
                <a
                    href="/"
                    className="text-gray-600 hover:text-amber-600 text-sm font-mono transition-colors"
                >
                    Editor
                </a>

                <button
                onClick={logout}
                className="text-gray-600 hover:text-amber-600 text-sm font-mono transition-colors"
                >
                    Logout
                </button>  

            </>
            ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-amber-600 text-sm font-mono transition-colors">
                Login
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-amber-600 text-sm font-mono transition-colors">
                Register
              </Link>
            </>
            )}
            </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-gray-600 hover:text-amber-600 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden px-4 py-2 bg-white/70 border-t border-gray-200/50">
        {isAuthenticated ? (
            <>
                <a
                    href="/haikus"
                    className="block py-2 text-gray-600 hover:text-amber-600 text-sm font-mono transition-colors"
                >
                    All Haikus
                </a>
                <a
                    href="/profile"
                    className="block py-2 text-gray-600 hover:text-amber-600 text-sm font-mono transition-colors"
                >
                    Profile
                </a>
        
                <a
                    href="/"
                    className="text-gray-600 hover:text-amber-600 text-sm font-mono transition-colors"
                >
                    Editor
                </a>
        
            </>
        ) : (
            <>
            <Link href="/login" className="block py-2 text-gray-600 hover:text-amber-600 text-sm font-mono transition-colors">
                Login
              </Link>
              <Link href="/register" className="block py-2 text-gray-600 hover:text-amber-600 text-sm font-mono transition-colors">
                Register
              </Link>
            </>
        )}
        </div>
      )}
    </nav>
  );
}