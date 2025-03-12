'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import HaikuList from '@/components/HaikuList';
import { fetchUserProfile, fetchUserHaikus } from '@/app/lib/api';

export default function AuthorProfile() {
  const router = useRouter();
  const { userId } = useParams();

  const [user, setUser] = useState<User | null>(null);
  const [haikus, setHaikus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [userData, haikusData] = await Promise.all([
          fetchUserProfile(userId),
          fetchUserHaikus(userId),
        ]);
        setUser(userData);
        setHaikus(haikusData);
      } catch (err) {
        setError(( err as any).response?.data?.detail || 'Failed to load author profile');
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-amber-50 via-rose-50 to-teal-50">
      <Navbar />
      <div className="max-w-4xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-rose-600 text-lg font-mono">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-amber-50 via-rose-50 to-teal-50">
      <Navbar />
      <div className="max-w-4xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/70 border border-gray-200/50 shadow-sm flex items-center justify-center overflow-hidden">
            {user && (
              <img
                src={user.avatar || 'https://via.placeholder.com/150'}
                alt={`${user.username}'s avatar`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-gray-700 text-2xl font-mono mb-2">{user?.username}</h1>
            <p className="text-gray-500 text-sm font-mono opacity-80">Joined {new Date().toLocaleDateString()}</p>
            <div className="mt-4 flex gap-4 justify-center sm:justify-start">
              <span className="text-gray-600 font-mono">Haikus: {haikus.length}</span>
            </div>
          </div>
        </div>
        <HaikuList initialHaikus={haikus} />
      </div>
    </div>
  );
}