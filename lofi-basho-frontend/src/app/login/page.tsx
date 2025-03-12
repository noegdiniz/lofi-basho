'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    interface LoginFormElements extends HTMLFormControlsCollection {
        email: HTMLInputElement;
        password: HTMLInputElement;
    }

    interface LoginFormElement extends HTMLFormElement {
        readonly elements: LoginFormElements;
    }

    const handleSubmit = async (e: React.FormEvent<LoginFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-amber-50 via-rose-50 to-teal-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white/70 p-6 rounded-sm shadow-sm border border-gray-200/50 backdrop-blur-sm">
          <h2 className="text-center text-2xl font-mono text-gray-700">Welcome Back</h2>
          {error && <p className="text-center text-sm text-rose-600 font-mono">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-mono text-gray-600">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full bg-white/70 outline-none text-gray-700 text-sm font-mono rounded-sm shadow-sm p-2 border border-gray-200/50 backdrop-blur-sm focus:ring-amber-600 focus:border-amber-600"
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-mono text-gray-600">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full bg-white/70 outline-none text-gray-700 text-sm font-mono rounded-sm shadow-sm p-2 border border-gray-200/50 backdrop-blur-sm focus:ring-amber-600 focus:border-amber-600"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>
            <button
                type="submit"
                className="w-full px-4 py-2 text-sm text-gray-600 bg-amber-100/80 hover:bg-amber-200/80 rounded-sm shadow-sm border border-gray-200/50 font-mono transition-all flex items-center justify-center"
                disabled={loading}
                >
                {loading && (
                    <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mr-2" />
                )}

              Login
            </button>
          </form>

          <p className="text-center text-sm font-mono text-gray-600">
            Don't have an account? <Link href="/register" className="text-amber-600 hover:text-amber-700">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}