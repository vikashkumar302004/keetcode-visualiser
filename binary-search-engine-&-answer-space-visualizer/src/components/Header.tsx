/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, ChevronLeft, ChevronRight, Binary, Eye, EyeOff } from 'lucide-react';
import { Problem } from '../types';
import { PROBLEMS } from '../data/binarySearchProblems';

interface HeaderProps {
  currentProblem: Problem;
  onSelectProblem: (id: string) => void;
  onReset: () => void;
  onSimulate: () => void;
  isTraceHidden: boolean;
  onToggleTrace: () => void;
}

export default function Header({
  currentProblem,
  onSelectProblem,
  onReset,
  onSimulate,
  isTraceHidden,
  onToggleTrace
}: HeaderProps) {
  const currentIndex = PROBLEMS.findIndex(p => p.id === currentProblem.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectProblem(PROBLEMS[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < PROBLEMS.length - 1) {
      onSelectProblem(PROBLEMS[currentIndex + 1].id);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md px-6 py-3.5 flex items-center justify-between shrink-0">
      {/* Brand Zone */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
          <Binary className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold text-slate-900 tracking-tight leading-none">
            Binary Search Engine
          </span>
          <span className="text-[10px] text-amber-700 font-medium font-sans tracking-wide mt-0.5 uppercase">
            Interactive Visualizer
          </span>
        </div>
      </div>

      {/* Prominent Sequence Dropdown / Navigation */}
      <div className="flex items-center gap-2 max-w-md w-full justify-center">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 transition-colors"
          title="Previous Problem"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="relative flex-1">
          <select
            value={currentProblem.id}
            onChange={(e) => onSelectProblem(e.target.value)}
            className="w-full text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-md py-1.5 px-3 pr-8 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500 hover:bg-slate-100/50 cursor-pointer"
          >
            <optgroup label="Pattern 1: Classic 1D Search & Bounds">
              {PROBLEMS.filter(p => p.category === 'Classic 1D Search').map((p) => (
                <option key={p.id} value={p.id}>
                  {String(p.sequenceNum).padStart(2, '0')}. {p.title} ({p.leetcode})
                </option>
              ))}
            </optgroup>
            <optgroup label="Pattern 2: Rotated & Mountain Arrays">
              {PROBLEMS.filter(p => p.category === 'Rotated & Mountain Arrays').map((p) => (
                <option key={p.id} value={p.id}>
                  {String(p.sequenceNum).padStart(2, '0')}. {p.title} ({p.leetcode})
                </option>
              ))}
            </optgroup>
            <optgroup label="Pattern 3: 2D Matrix Binary Search">
              {PROBLEMS.filter(p => p.category === '2D Matrix Search').map((p) => (
                <option key={p.id} value={p.id}>
                  {String(p.sequenceNum).padStart(2, '0')}. {p.title} ({p.leetcode})
                </option>
              ))}
            </optgroup>
            <optgroup label="Pattern 4: Binary Search on Answer / Optimization">
              {PROBLEMS.filter(p => p.category === 'Binary Search on Answer').map((p) => (
                <option key={p.id} value={p.id}>
                  {String(p.sequenceNum).padStart(2, '0')}. {p.title} ({p.leetcode})
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === PROBLEMS.length - 1}
          className="p-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-slate-50 transition-colors"
          title="Next Problem"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Actions / Control shortcuts */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTrace}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
            isTraceHidden
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 hover:bg-amber-500/20'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
          }`}
          title={isTraceHidden ? "Show Code & Inspector" : "Collapse Code & Inspector"}
        >
          {isTraceHidden ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Show Code</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hide Code</span>
            </>
          )}
        </button>

        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-md hover:bg-slate-200 transition-all cursor-pointer"
          title="Reset current simulation (R)"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset</span>
        </button>

        <button
          onClick={onSimulate}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-500 border border-amber-600 rounded-md hover:bg-amber-600 transition-all shadow-sm cursor-pointer"
          title="Simulate algorithm steps"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Simulate</span>
        </button>
      </div>
    </header>
  );
}
