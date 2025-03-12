'use client';

import HaikuList from "@/components/HaikuList";
import Navbar from "@/components/Navbar";
import { fetchAllHaikus } from '@/app/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function AllHaikus() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [haikus, setHaikus] = useState([]);
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
              setHaikus(await fetchAllHaikus());
            } catch (err) {
              setError((err as any).response?.data?.detail || 'Failed to load haikus');
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
          <div className="max-w-4xl mx-auto w-full py-12 px-10">
            {loading ? (
            <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-rose-600 text-lg font-mono">{error}</p>
                </div>
            ) : (
                <HaikuList initialHaikus={haikus}/>
            )}
            </div>
        </div>
    );
}