'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { createHaiku } from '@/app/lib/api';

export default function Home() {
  const [text, setText] = useState('');
  const [history, setHistory] = useState([text]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-white/70'); // Default color
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Predefined colors
  // Predefined colors (10 options)
  const colors = [
    { name: 'White', class: 'bg-white/70' },
    { name: 'Amber', class: 'bg-amber-100/70' },
    { name: 'Rose', class: 'bg-rose-100/70' },
    { name: 'Teal', class: 'bg-teal-100/70' },
    { name: 'Indigo', class: 'bg-indigo-100/70' },
    { name: 'Emerald', class: 'bg-emerald-100/70' },
    { name: 'Sky', class: 'bg-sky-100/70' },
  ];

  // Word counter
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

  // Update history when text changes
  const handleTextChange = (newValue : any) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newValue);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setText(newValue);
  };

  // Undo function
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
    }
  };

  // Redo function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setText(history[newIndex]);
    }
  };

  // Handle tag input
  const handleTagInput = (e: any) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (index : any) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handlePublish = async (isDraft = false) => {
    setLoading(true);
    setError('');

    try {
      await createHaiku({
        text: text.trim(),
        color: selectedColor,
        tags: tags,
        is_draft: isDraft,
      });
      setText('');
      setHistory(['']);
      setHistoryIndex(0);
      setTags([]);
      setSelectedColor('bg-white/70');
    } catch (error) {
      setError((error as any).response?.data?.detail || 'Failed to publish haiku');
    } finally {
      setLoading(false);
    }
  };

  // Keyboard shortcuts for undo (Ctrl+Z) and redo (Ctrl+Y or Ctrl+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e : any) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gradient-to-br from-amber-50 via-rose-50 to-teal-50">
      <Navbar />

      {/* Editor with lo-fi haiku styling */}
      <div className="flex-1 max-w-4xl mx-auto w-full py-12 px-10">
        <textarea
          className={`${selectedColor} w-full h-full outline-none resize-none text-gray-700 text-lg placeholder-gray-400 font-mono rounded-sm shadow-sm p-4 border border-gray-200/50 backdrop-blur-sm`}
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={["Silent wind whispers...", 
            "Gentle rain falls...", 
            "Stars shine brightly...", 
            "Leaves rustle softly...",
            "Moonlight glows faintly...",
            "River flows quietly...",
            "Clouds drift slowly...",
            "Dawn breaks gently...",
            "Mist settles calmly...",
            "Waves crash softly...",
            "Forest hums alive...",
            "Snow falls silently...",
            "Sun sets peacefully...",
            "Breeze carries dreams...",
            "Twilight fades away..."][Math.floor(Math.random() * 15)]}
          
          disabled={loading}
        />
        {/* Word count, tags, and color selection */}
        <div className="mt-3 space-y-3">
          <div className="text-gray-500 text-sm font-mono opacity-80 flex items-center gap-2">
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
          
          {/* Color selection */}
          <div className="flex flex-wrap gap-2">
            {colors.map(color => (
              <button
                key={color.name}
                className={`w-6 h-6 rounded-sm border border-gray-200/50 shadow-sm ${color.class} ${
                  selectedColor === color.class ? 'ring-2 ring-amber-600' : ''
                }`}
                onClick={() => setSelectedColor(color.class)}
                disabled={loading}
                title={color.name}
              />
            ))}
          </div>
          </div>
          

          {/* Tags input and display */}
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInput}
              placeholder="Add a tag (press Enter)..."
              className="w-full bg-white/70 outline-none text-gray-700 text-sm placeholder-gray-400 font-mono rounded-sm shadow-sm p-2 border border-gray-200/50 backdrop-blur-sm"
              disabled={loading}
            />
          </div>
          {error && <p className="text-rose-600 text-sm font-mono">{error}</p>}
        </div>
      </div>

      {/* Action buttons */}
      <div className="max-w-4xl mx-auto w-full pb-6 flex justify-between space-x-3 py-12 px-10">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-sm text-gray-600 bg-amber-100/80 rounded-sm font-mono flex items-center gap-1"
            >
              {tag}
              <button
                onClick={() => removeTag(index)}
                className="text-gray-500 hover:text-gray-700"
                disabled={loading}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="px-3 py-1 text-sm text-gray-600 bg-white/60 hover:bg-amber-100/80 rounded-sm shadow-sm border border-gray-200/50 font-mono disabled:opacity-40 transition-all"
            onClick={handleUndo}
            disabled={historyIndex === 0 || loading}
          >
            Undo
          </button>
          <button
            className="px-3 py-1 text-sm text-gray-600 bg-white/60 hover:bg-amber-100/80 rounded-sm shadow-sm border border-gray-200/50 font-mono disabled:opacity-40 transition-all"
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1 || loading}
          >
            Redo
          </button>
          <button
            className="px-3 py-1 text-sm text-gray-600 bg-white/60 hover:bg-amber-100/80 rounded-sm shadow-sm border border-gray-200/50 font-mono transition-all"
            onClick={() => {
              const newValue = '';
              setText(newValue);
              setHistory([newValue]);
              setHistoryIndex(0);
              setTags([]);
              setSelectedColor('bg-white/70'); // Reset to default color
              handlePublish(true);
            }}
            disabled={loading}
          >
            New
          </button>
          <button 
            className="px-3 py-1 text-sm text-gray-600 bg-white/60 hover:bg-amber-100/80 rounded-sm shadow-sm border border-gray-200/50 font-mono transition-all"
            onClick={() => handlePublish(false)}
            disabled={loading}
            >
            {loading ? (
              <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            ) : null}
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}