'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { fetchHaikuById } from '../lib/api';

export default function ExportHaiku() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const haikuId = Number(searchParams.get('haikuId'));
  const [selectedHaiku, setSelectedHaiku] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const FIXED_BACKGROUND_COLOR = '#FFF7ED'; // amber-50

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
          if (haikuId) {
            const haiku = await fetchHaikuById(haikuId);
            if (haiku && !haiku.is_draft) { // Only export non-draft haikus
              setSelectedHaiku(haiku);
            } else {
              setError('Haiku not found or is a draft');
            }
          } else {
            setError('No haiku specified for export');
          }
        } catch (err) {
          setError((err as any).response?.data?.detail || 'Failed to load haiku');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [authLoading, isAuthenticated, router, haikuId]);

  useEffect(() => {
    if (selectedHaiku && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Set canvas size (Instagram square post size: 1080x1080)
      canvas.width = 1080;
      canvas.height = 1080;

      if (ctx) {
        // Fill background
        ctx.fillStyle = FIXED_BACKGROUND_COLOR;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw haiku text
        ctx.font = '48px monospace';
        ctx.fillStyle = '#374151'; // gray-700
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const lines = selectedHaiku.text.split('\n');
        const lineHeight = 60;
        const startY = canvas.height / 2 - (lines.length - 1) * lineHeight / 2;
        lines.forEach((line : any, index : any) => {
          ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
        });

        // Draw author
        ctx.font = '32px monospace';
        ctx.fillStyle = '#6B7280'; // gray-500
        ctx.fillText(`— ${selectedHaiku.owner.username}`, canvas.width / 2, canvas.height - 100);
      }
    }
  }, [selectedHaiku]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `haiku-${selectedHaiku.id}.png`;
      link.href = canvasRef.current.toDataURL('image/png');
      link.click();
    }
  };

  const handleCopyText = () => {
    const text = `${selectedHaiku.text}\n— ${selectedHaiku.owner.username}`;
    navigator.clipboard.writeText(text).then(() => {
      alert('Haiku text copied to clipboard!');
    });
  };

  if (authLoading || loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gradient-to-br from-amber-50 via-rose-50 to-teal-50">
      <Navbar />
      <div className="max-w-4xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-gray-700 text-2xl font-mono mb-8">Export Haiku</h1>
        {error && <p className="text-rose-600 text-lg font-mono mb-4">{error}</p>}

        {/* Canvas Preview */}
        {selectedHaiku && (
          <div className="mb-8 flex justify-center">
            <canvas ref={canvasRef} className="border border-gray-200/50 shadow-sm rounded-sm" />
          </div>
        )}

        {/* Actions */}
        {selectedHaiku && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleDownload}
              className="px-4 py-2 text-sm text-gray-600 bg-amber-100/80 hover:bg-amber-200/80 rounded-sm shadow-sm border border-gray-200/50 font-mono transition-all"
            >
              Download Image
            </button>
            <button
              onClick={handleCopyText}
              className="px-4 py-2 text-sm text-gray-600 bg-amber-100/80 hover:bg-amber-200/80 rounded-sm shadow-sm border border-gray-200/50 font-mono transition-all"
            >
              Copy Text
            </button>
          </div>
        )}
      </div>
    </div>
  );
}