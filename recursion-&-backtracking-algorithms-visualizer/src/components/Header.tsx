import React from 'react';
import { GitFork, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { ProblemMetadata, ProblemId } from '../types';

interface HeaderProps {
  problems: ProblemMetadata[];
  selectedProblem: ProblemMetadata;
  onSelectProblem: (id: ProblemId) => void;
  onReset: () => void;
}

export default function Header({
  problems,
  selectedProblem,
  onSelectProblem,
  onReset,
}: HeaderProps) {
  const currentIndex = problems.findIndex((p) => p.id === selectedProblem.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectProblem(problems[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < problems.length - 1) {
      onSelectProblem(problems[currentIndex + 1].id);
    }
  };

  // Group problems by category dynamically
  const groupedProblems = React.useMemo(() => {
    const groups: Record<string, ProblemMetadata[]> = {};
    problems.forEach((p) => {
      if (!groups[p.category]) {
        groups[p.category] = [];
      }
      groups[p.category].push(p);
    });
    return groups;
  }, [problems]);

  return (
    <header className="flex flex-row items-center justify-between px-6 py-3 border-b border-slate-200 bg-[#FAF9F6] sticky top-0 z-50 h-14">
      {/* Zone 1: Brand Title */}
      <div className="flex items-center gap-2">
        <GitFork className="w-5 h-5 text-amber-600 shrink-0" />
        <span className="font-serif text-base lg:text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
          Backtracking Engine
        </span>
        <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase hidden md:inline ml-2">
          · Interactive Simulation
        </span>
      </div>

      {/* Zone 2: Sequential Pattern-wise Navigator */}
      <div className="flex items-center gap-1">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Previous Problem"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <select
          value={selectedProblem.id}
          onChange={(e) => onSelectProblem(e.target.value as ProblemId)}
          className="px-3 py-1.5 font-sans text-xs md:text-sm font-semibold text-slate-800 bg-white border border-slate-300 rounded shadow-2xs focus:outline-none focus:ring-2 focus:ring-amber-500 max-w-[240px] md:max-w-[340px] truncate cursor-pointer"
        >
          {Object.entries(groupedProblems).map(([category, items]) => (
            <optgroup key={category} label={category} className="font-sans font-bold text-slate-400 text-xs bg-slate-50">
              {items.map((p) => (
                <option key={p.id} value={p.id} className="font-sans font-medium text-slate-800 bg-white text-xs py-1">
                  {p.index} · {p.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <button
          onClick={handleNext}
          disabled={currentIndex === problems.length - 1}
          className="p-1.5 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
          title="Next Problem"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Zone 3: Global Resets */}
      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-700 rounded bg-white text-xs font-bold hover:bg-slate-50 active:bg-slate-100 transition-all cursor-pointer shadow-2xs shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset Case</span>
        </button>
      </div>
    </header>
  );
}
