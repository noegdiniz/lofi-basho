'use client';

import HaikuInfo from '@/components/HaikuInfo';
import { useRouter } from 'next/navigation';

const HaikuCard: React.FC<HaikuInfoProps> = ({ haiku }) => {
  const router = useRouter();

  const handleExport = () => {
    router.push(`/export-haiku?haikuId=${haiku.id}`);
  };

  return (
    <div
      className={`${haiku.color} p-4 rounded-sm shadow-sm border border-gray-200/50 backdrop-blur-sm hover:shadow-md transition-all flex flex-col`}
    >
      <div className="flex-1 min-h-0">
        <p className="text-gray-700 text-base font-mono whitespace-pre-line mb-3">
          {haiku.text}
        </p>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {haiku.tags.map(tag => (
          <span
            key={tag}
            className="px-2 py-1 text-xs text-gray-600 bg-amber-100/80 rounded-sm font-mono"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs font-mono opacity-80">
          {new Date(haiku.date).toLocaleDateString()}
        </p>
        <button
          onClick={handleExport}
          className="text-gray-600 hover:text-amber-600 text-sm font-mono transition-colors"
        >
          Export
        </button>
      </div>
      <HaikuInfo haiku={haiku} />
    </div>
  );
};

export default HaikuCard;