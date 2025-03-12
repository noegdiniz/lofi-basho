// Profile.jsx
'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import HaikuList from '@/components/HaikuList';
import { fetchMyHaikus, fetchLikedHaikus, fetchDraftHaikus } from '@/app/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


export default function Profile() {
    const { isAuthenticated, loading: authLoading, user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('myHaikus');
    const [myHaikus, setMyHaikus] = useState([]);
    const [likedHaikus, setLikedHaikus] = useState([]);
    const [draftHaikus, setDraftHaikus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
      if (!authLoading && !isAuthenticated) {
        router.push('/login');
      } else if (isAuthenticated) {
        const fetchData = async () => {
          setLoading(true);
          setError('');
          try {
            const [myHaikusData, likedHaikusData, draftHaikusData] = await Promise.all([
              fetchMyHaikus(),
              fetchLikedHaikus(),
              fetchDraftHaikus(),
            ]);

            setMyHaikus(myHaikusData);
            setLikedHaikus(likedHaikusData);
            setDraftHaikus(draftHaikusData);
          } catch (err) {
            setError((err as any).response?.data?.detail || 'Failed to load profile data');
          } finally {
            setLoading(false);
          }
        };
        fetchData();
      }
    }, [authLoading, isAuthenticated, router]);
  
    if (authLoading) return <div className="flex justify-center items-center h-screen"><div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" /></div>;
    if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-amber-50 via-rose-50 to-teal-50">
      <Navbar />

      {/* Profile content */}
      <div className="max-w-4xl mx-auto w-full py-12 px-10">
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
          {/* Avatar */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/70 border border-gray-200/50 shadow-sm flex items-center justify-center overflow-hidden">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Profile info */}
          <div className="text-center sm:text-left">
            <h1 className="text-gray-700 text-2xl font-mono mb-2">Username</h1>
            <p className="text-gray-500 text-sm font-mono opacity-80">
              Joined {new Date().toLocaleDateString()}
            </p>
            <div className="mt-4 flex gap-4 justify-center sm:justify-start">
              <span className="text-gray-600 font-mono">
                Haikus: {myHaikus.length}
              </span>
              <span className="text-gray-600 font-mono">
                Likes: {likedHaikus.length}
              </span>
              <span className="text-gray-600 font-mono">
                Drafts: {draftHaikus.length}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-gray-200/50">
            <button
              className={`pb-2 px-4 text-sm font-mono transition-all ${
                activeTab === 'myHaikus'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
              onClick={() => setActiveTab('myHaikus')}
            >
              My Haikus
            </button>
            <button
              className={`pb-2 px-4 text-sm font-mono transition-all ${
                activeTab === 'likedHaikus'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
              onClick={() => setActiveTab('likedHaikus')}
            >
              Liked Haikus
            </button>
            <button
              className={`pb-2 px-4 text-sm font-mono transition-all ${
                activeTab === 'draftHaikus'
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
              onClick={() => setActiveTab('draftHaikus')}
            >
              Draft Haikus
            </button>
          </div>
        </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-rose-600 text-lg font-mono">{error}</p>
            </div>
          ) : (
            <>
              {activeTab === 'myHaikus' && <HaikuList initialHaikus={myHaikus} />}
              {activeTab === 'likedHaikus' && <HaikuList initialHaikus={likedHaikus} />}
              {activeTab === 'draftHaikus' && <HaikuList initialHaikus={draftHaikus} />}
            </>
          )}
      </div>
    </div>
  );
}
