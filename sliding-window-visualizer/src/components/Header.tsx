import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Sliders, 
  Sparkles,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { ProblemDefinition } from '../types';
import { ProblemDropdown } from './ProblemDropdown';

interface HeaderProps {
  problems: ProblemDefinition[];
  currentProblem: ProblemDefinition;
  onSelectProblem: (problem: ProblemDefinition) => void;
  onPrevProblem: () => void;
  onNextProblem: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  onOpenCustomModal: () => void;
  onReset: () => void;
  detailsExpanded: boolean;
  onToggleDetails: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  problems,
  currentProblem,
  onSelectProblem,
  onPrevProblem,
  onNextProblem,
  hasPrev,
  hasNext,
  onOpenCustomModal,
  onReset,
  detailsExpanded,
  onToggleDetails,
}) => {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 select-none z-20">
      {/* Left: Branding */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
          <Layers className="w-4 h-4" />
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="font-serif font-bold text-lg text-slate-900 tracking-tight">
            Sliding Window
          </span>
          <span className="text-xs font-mono font-medium text-slate-500 hidden sm:inline">
            &amp; Two Pointers
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
            Interactive
          </span>
        </div>
      </div>

      {/* Center: Sub-classified Pattern Dropdown with < and > */}
      <div className="flex items-center space-x-1.5 max-w-xl mx-2">
        <button
          id="btn-prev-problem"
          onClick={onPrevProblem}
          disabled={!hasPrev}
          title="Previous Algorithm"
          className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <ProblemDropdown
          problems={problems}
          currentProblem={currentProblem}
          onSelectProblem={onSelectProblem}
        />

        <button
          id="btn-next-problem"
          onClick={onNextProblem}
          disabled={!hasNext}
          title="Next Algorithm"
          className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Window Tools */}
      <div className="flex items-center space-x-2">
        <button
          id="btn-toggle-problem-details"
          onClick={onToggleDetails}
          title="Toggle Problem Invariant &amp; Notes"
          className={`px-2.5 py-1.5 rounded-md text-xs font-medium border flex items-center space-x-1.5 transition-colors ${
            detailsExpanded 
              ? 'bg-amber-50 border-amber-300 text-amber-900' 
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden md:inline">Problem Info</span>
        </button>

        <button
          id="btn-custom-input"
          onClick={onOpenCustomModal}
          title="Edit array/string or parameters"
          className="px-2.5 py-1.5 rounded-md text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center space-x-1.5 transition-colors shadow-2xs"
        >
          <Sliders className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden md:inline">Custom Input</span>
        </button>

        <button
          id="btn-reset-simulation"
          onClick={onReset}
          title="Reset playback and pointers"
          className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
