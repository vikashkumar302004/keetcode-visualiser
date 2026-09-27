import React from 'react';
import { Layers, ChevronLeft, ChevronRight, Shuffle, Wand2, Trash2, ArrowUpDown } from 'lucide-react';
import { ProblemDefinition, HeapType } from '../types';

interface HeaderProps {
  problems: ProblemDefinition[];
  currentProblem: ProblemDefinition;
  onSelectProblem: (problem: ProblemDefinition) => void;
  heapType: HeapType;
  onToggleHeapType: () => void;
  onApplyPreset: (type: 'balanced' | 'reversed' | 'nearlySorted' | 'random') => void;
  onBuildHeapClick: () => void;
  onClear: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  problems,
  currentProblem,
  onSelectProblem,
  heapType,
  onToggleHeapType,
  onApplyPreset,
  onBuildHeapClick,
  onClear
}) => {
  const currentIndex = problems.findIndex(p => p.id === currentProblem.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < problems.length - 1;

  const handlePrev = () => {
    if (hasPrev) onSelectProblem(problems[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) onSelectProblem(problems[currentIndex + 1]);
  };

  // Group problems by category for categorized dropdown
  const groupedProblems = React.useMemo(() => {
    const groups: { category: string; icon: string; items: ProblemDefinition[] }[] = [];
    const map = new Map<string, ProblemDefinition[]>();
    
    problems.forEach(p => {
      const cat = p.category;
      if (!map.has(cat)) {
        map.set(cat, []);
      }
      map.get(cat)!.push(p);
    });

    const categoryIcons: Record<string, string> = {
      'Core Heap Foundations': '🌲',
      'Top-K Elements Pattern': '🎯',
      'Two-Heap Balancing Pattern': '⚖️',
      'K-Way Merge Pattern': '🔀',
      'Heap on Pairs & Intervals Pattern': '⏱️',
      'Greedy Priority Queue Pattern': '⚡'
    };

    map.forEach((items, cat) => {
      groups.push({
        category: cat,
        icon: categoryIcons[cat] || '📦',
        items
      });
    });

    return groups;
  }, [problems]);

  return (
    <header className="bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 select-none flex-wrap sm:flex-nowrap">
      {/* App Branding */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base tracking-tight text-slate-900 leading-tight">
              Heap & Priority Queue
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">
              Interactive
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-sans leading-none mt-0.5">
            Dual-Canvas Algorithm Visualizer & C++ Tracing
          </p>
        </div>
      </div>

      {/* Center: Sequential Problem Selector */}
      <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200 shadow-xs max-w-md w-full sm:w-auto">
        <button
          id="prev-problem-btn"
          onClick={handlePrev}
          disabled={!hasPrev}
          title="Previous Algorithm (Shift + Left)"
          className="p-1.5 rounded-md hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="relative flex-1 sm:w-80">
          <select
            id="problem-select-dropdown"
            value={currentProblem.id}
            onChange={(e) => {
              const selected = problems.find(p => p.id === e.target.value);
              if (selected) onSelectProblem(selected);
            }}
            className="w-full text-xs font-semibold text-slate-800 bg-white sm:bg-transparent py-1 px-2 pr-7 rounded cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 truncate border sm:border-0 border-slate-200"
          >
            {groupedProblems.map(group => (
              <optgroup
                key={group.category}
                label={`${group.icon} ${group.category} (${group.items.length})`}
                className="font-bold text-slate-900 bg-slate-100 py-1"
              >
                {group.items.map(p => (
                  <option key={p.id} value={p.id} className="font-normal text-slate-800 bg-white py-1 text-xs">
                    #{String(p.sequenceNumber).padStart(2, '0')} {p.title} {p.leetCodeNum ? `[LC #${p.leetCodeNum}]` : ''}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <button
          id="next-problem-btn"
          onClick={handleNext}
          disabled={!hasNext}
          title="Next Algorithm (Shift + Right)"
          className="p-1.5 rounded-md hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Heap Mode & Quick Helpers */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Heap Type Toggle */}
        <button
          id="heap-mode-toggle"
          onClick={onToggleHeapType}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
            heapType === 'max'
              ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100'
              : 'bg-indigo-50 border-indigo-300 text-indigo-900 hover:bg-indigo-100'
          }`}
          title="Toggle Max-Heap vs Min-Heap Invariant"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>{heapType === 'max' ? 'Max-Heap' : 'Min-Heap'}</span>
        </button>

        {/* Presets Dropdown */}
        <div className="relative group">
          <button
            id="preset-dropdown-btn"
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors cursor-pointer"
          >
            <span>Preset</span>
          </button>
          <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-md border border-slate-200 py-1 hidden group-hover:block z-50">
            <button
              onClick={() => onApplyPreset('balanced')}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900"
            >
              Balanced Heap
            </button>
            <button
              onClick={() => onApplyPreset('reversed')}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900"
            >
              Reverse Sorted
            </button>
            <button
              onClick={() => onApplyPreset('nearlySorted')}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900"
            >
              Nearly Sorted
            </button>
            <button
              onClick={() => onApplyPreset('random')}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900"
            >
              Random Array
            </button>
          </div>
        </div>

        {/* Random Array Action */}
        <button
          id="random-array-btn"
          onClick={() => onApplyPreset('random')}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors cursor-pointer"
          title="Generate Random Array"
        >
          <Shuffle className="w-3.5 h-3.5" />
        </button>

        {/* Build Heap Action */}
        <button
          id="build-heap-quick-btn"
          onClick={onBuildHeapClick}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-md transition-colors cursor-pointer"
          title="Run Floyd's O(N) Bottom-Up Heapify"
        >
          <Wand2 className="w-3.5 h-3.5 text-amber-700" />
          <span className="hidden md:inline">Build Heap O(N)</span>
        </button>

        {/* Clear Action */}
        <button
          id="clear-heap-btn"
          onClick={onClear}
          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md border border-slate-200 transition-colors cursor-pointer"
          title="Clear Heap Canvas"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
