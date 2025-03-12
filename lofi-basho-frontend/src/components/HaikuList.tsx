'use client';

import React, { useState, useEffect, useRef } from 'react';
import HaikuCard from '@/components/HaikuCard';
import { fetchAllHaikus } from '@/app/lib/api';


export default function HaikuList({ initialHaikus = [] }: HaikuListProps) {
  const [haikus, setHaikus] = useState<Haiku[]>(initialHaikus);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [page, setPage] = useState(1); // Start from page 1 since initialHaikus is page 0
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  const PAGE_SIZE = 10;
  const allTags = [...new Set(haikus.flatMap((haiku: Haiku) => haiku.tags))];

  // Filter haikus based on selected tags
  const filteredHaikus = selectedTags.length > 0
    ? haikus.filter((haiku: Haiku) => selectedTags.every(tag => haiku.tags.includes(tag)))
    : haikus;

  // Get tag suggestions based on input
  const tagSuggestions = tagInput
    ? allTags.filter(
        tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !selectedTags.includes(tag)
      )
    : [];

  // Add tag to selected tags and clear input
  const addTag = (tag: string) => {
    setSelectedTags([...selectedTags, tag]);
    setTagInput('');
  };

  // Remove tag from selected tags
  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  // Fetch more haikus and prevent duplicates
  const loadMoreHaikus = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const skip = page * PAGE_SIZE; // Calculate skip based on page
      const newHaikus = await fetchAllHaikus(skip, PAGE_SIZE);
      if (newHaikus.length < PAGE_SIZE) {
        setHasMore(false); // No more haikus to load
      }
      // Filter out duplicates by id
      setHaikus((prev: Haiku[]) => {
        const existingIds = new Set(prev.map(h => h.id));
        const uniqueNewHaikus = newHaikus.filter((h: Haiku) => !existingIds.has(h.id));
        return [...prev, ...uniqueNewHaikus];
      });
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Failed to load more haikus:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set up IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreHaikus();
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the target is visible
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, loading]); // Dependencies updated to avoid stale closures

  // Reset haikus when tags change and refetch from scratch
  useEffect(() => {
    const resetAndFetch = async () => {
      setLoading(true);
      try {
        const newHaikus = await fetchAllHaikus(0, PAGE_SIZE * page); // Fetch up to current page
        setHaikus(newHaikus.filter((h: Haiku, index: number, self: Haiku[]) => 
          self.findIndex(h2 => h2.id === h.id) === index)); // Ensure uniqueness
        setPage(1);
        setHasMore(newHaikus.length >= PAGE_SIZE * page);
      } catch (error) {
        console.error('Failed to reset haikus:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedTags.length > 0) {
      resetAndFetch();
    } else {
      setHaikus(initialHaikus);
      setPage(1);
      setHasMore(true);
    }
  }, [selectedTags, initialHaikus]);

  return (
    <div>
      {/* Tag filter section */}
      <div>
        <div className="mb-8">
          <h2 className="text-gray-700 text-lg font-mono mb-4">Filter by Tags</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedTags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-sm text-gray-600 bg-amber-100/80 rounded-sm font-mono flex items-center gap-1"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="relative">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              placeholder="Search tags..."
              className="w-full bg-white/70 outline-none text-gray-700 text-sm placeholder-gray-400 font-mono rounded-sm shadow-sm p-2 border border-gray-200/50 backdrop-blur-sm"
            />
            {tagSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white/90 rounded-sm shadow-md border border-gray-200/50">
                {tagSuggestions.map(tag => (
                  <button
                    key={tag}
                    className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-amber-100/80 font-mono transition-all"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Haikus grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHaikus.map((haiku: Haiku) => (
            <HaikuCard haiku={haiku} key={haiku.id} />
          ))}
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Sentinel element for infinite scroll */}
        {hasMore && (
          <div ref={observerRef} className="h-10" />
        )}

        {/* Empty state */}
        {!loading && filteredHaikus.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg font-mono">
              No haikus found with these tags...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}