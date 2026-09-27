import React from 'react';
import { AlgorithmCategory } from '../types';
import { Sparkles, ShieldCheck, Scissors, GitFork, Compass } from 'lucide-react';

interface CategoryNavProps {
  activeCategory: AlgorithmCategory;
  onSelectCategory: (category: AlgorithmCategory) => void;
}

const CATEGORIES: {
  id: AlgorithmCategory;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
}[] = [
  {
    id: 'crud',
    title: '1. Core Operations',
    subtitle: 'Insert, Search, Delete (3 Cases)',
    icon: Sparkles,
    count: 3,
  },
  {
    id: 'validation',
    title: '2. Validation & Metrics',
    subtitle: 'Validate BST, Min/Max, K-th Element',
    icon: ShieldCheck,
    count: 3,
  },
  {
    id: 'range',
    title: '3. Range Queries & Pruning',
    subtitle: 'Range Sum [L, H], Prune In-Place',
    icon: Scissors,
    count: 2,
  },
  {
    id: 'construction',
    title: '4. Construction & Conversions',
    subtitle: 'Array to BST, BT to BST, Preorder',
    icon: GitFork,
    count: 3,
  },
  {
    id: 'relations',
    title: '5. Relations & Successor',
    subtitle: 'Lowest Common Ancestor, Pre & Suc',
    icon: Compass,
    count: 2,
  },
];

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <nav aria-label="BST Algorithm Categories" className="w-full bg-[#FAF9F6] border-b border-slate-200 px-5 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left transition-all shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-white border-slate-300 shadow-xs text-slate-900 ring-1 ring-slate-200/80'
                  : 'bg-transparent border-transparent text-slate-600 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-slate-900 text-amber-300' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold whitespace-nowrap">{cat.title}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-medium ${
                      isActive ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-[190px]">{cat.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
