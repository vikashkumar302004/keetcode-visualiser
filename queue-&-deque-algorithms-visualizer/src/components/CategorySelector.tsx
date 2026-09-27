import React from 'react';
import { Layers, RotateCw, GitCommit, MoveHorizontal, RefreshCcw, Cpu } from 'lucide-react';
import { QUEUE_PROBLEMS } from '../data/queueProblems';

interface CategorySelectorProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Standard & Circular Queues': <Layers className="w-3.5 h-3.5 text-blue-500" />,
  'Circular Deques': <MoveHorizontal className="w-3.5 h-3.5 text-emerald-500" />,
  'Stack & Queue Interconversions': <RefreshCcw className="w-3.5 h-3.5 text-purple-500" />,
  'Sliding Window & Monotonic Deques': <RotateCw className="w-3.5 h-3.5 text-amber-500" />,
  'Streams & Cache Buffers': <GitCommit className="w-3.5 h-3.5 text-cyan-500" />,
  'Advanced Queue BFS & Scheduling': <Cpu className="w-3.5 h-3.5 text-rose-500" />,
};

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  // Get unique categories and their corresponding count of questions
  const categories = Array.from(new Set(QUEUE_PROBLEMS.map((p) => p.category)));

  const getCountForCategory = (cat: string) => {
    return QUEUE_PROBLEMS.filter((p) => p.category === cat).length;
  };

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 py-2 shrink-0 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Category switcher label */}
        <div className="hidden md:flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
            Structure Filter:
          </span>
        </div>

        {/* Categories capsule tabs */}
        <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            const count = getCountForCategory(cat);
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all border shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                <span className="flex items-center justify-center shrink-0">
                  {CATEGORY_ICONS[cat] || <Layers className="w-3.5 h-3.5" />}
                </span>
                <span className="tracking-tight">{cat}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold font-mono transition-colors ${
                    isActive ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
