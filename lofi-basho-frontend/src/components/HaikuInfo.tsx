'use client';

import { useState, useEffect } from 'react';
import { toggleLikeHaiku, isHaikuLiked } from '@/app/lib/api';
import Link from 'next/link';

export default function HaikuInfo({ haiku }: HaikuInfoProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(haiku.likes_count || 0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const liked = await isHaikuLiked(haiku.id);
        setIsLiked(liked);
      } catch (err) {
        setError('Failed to load like status');
      } finally {
        setLoading(false);
      }
    };
    checkLikeStatus();
  }, [haiku.id]);

  const handleLike = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await toggleLikeHaiku(Number(haiku.id));
      setIsLiked(result.liked);
      setLikesCount(prev => result.liked ? prev + 1 : prev - 1);
    } catch (err) {
      setError('Failed to toggle like');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white/70 border border-gray-200/50 shadow-sm flex items-center justify-center overflow-hidden">
          <img
            src={haiku.owner.avatar || 'https://via.placeholder.com/150'} // Assume avatar field or fallback
            alt={`${haiku.owner.username}'s avatar`}
            className="w-full h-full object-cover"
          />
        </div>
        <Link href={`/users/${haiku.owner.id}`} className="text-gray-600 text-sm font-mono hover:text-amber-600 transition-colors">
          {haiku.owner.username}
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {error && <span className="text-rose-600 text-xs font-mono">{error}</span>}
        <span className="text-gray-500 text-xs font-mono">{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
        {loading ? (
          <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <button onClick={handleLike} className="focus:outline-none relative">
            <svg
              className={`w-5 h-5 transition-all duration-300 ${
                isLiked ? 'text-amber-600 scale-110' : 'text-gray-400 hover:text-amber-400'
              }`}
              fill={isLiked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {isLiked && (
              <span className="absolute -top-1 -right-1 w-5 h-5 text-amber-600 animate-heart-burst">
                <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
