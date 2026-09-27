/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sliders, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { arrayProblems } from '../data/arrayProblems';
import { AlgorithmId } from '../types';

interface HeaderProps {
  currentProblemId: AlgorithmId;
  onProblemChange: (id: AlgorithmId) => void;
  onPresetChange: (type: 'sorted' | 'reverse' | 'duplicates' | 'random') => void;
  customInput: string;
  onCustomInputChange: (val: string) => void;
  onApplyCustomInput: () => void;
  kValue: number;
  onKValueChange: (k: number) => void;
  onReset: () => void;
}

export default function Header({
  currentProblemId,
  onProblemChange,
  onPresetChange,
  customInput,
  onCustomInputChange,
  onApplyCustomInput,
  kValue,
  onKValueChange,
  onReset,
}: HeaderProps) {
  const currentIndex = arrayProblems.findIndex((p) => p.id === currentProblemId);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onProblemChange(arrayProblems[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < arrayProblems.length - 1) {
      onProblemChange(arrayProblems[currentIndex + 1].id);
    }
  };

  // Define problem category groupings for the dropdown
  const categories = [
    {
      label: '1. In-Place Transformations',
      problems: arrayProblems.slice(0, 5),
    },
    {
      label: '2. Permutations & Reordering',
      problems: arrayProblems.slice(5, 9),
    },
    {
      label: '3. Merging & Counting',
      problems: arrayProblems.slice(9, 12),
    },
    {
      label: '4. Mathematical & Matrix Patterns',
      problems: arrayProblems.slice(12),
    },
  ];

  return (
    <header className="sticky top-0 z-50 flex flex-col md:flex-row items-center justify-between px-6 py-3 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      {/* Brand Zone */}
      <div className="flex items-center gap-3 shrink-0 mb-3 md:mb-0">
        <div className="p-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-extrabold tracking-tight text-slate-900 leading-none flex items-center gap-2">
            Array Algorithms Engine
          </h1>
          <span className="text-[10px] font-bold text-slate-400 tracking-wide font-mono">
            IN-PLACE MANIPULATION · INTERACTIVE
          </span>
        </div>
      </div>

      {/* Prominent Sequence Dropdown with Category Optgroups */}
      <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-1 shrink-0 mb-3 md:mb-0 shadow-xs">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-1.5 rounded-md hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Previous Algorithm (Left Arrow)"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <select
          value={currentProblemId}
          onChange={(e) => onProblemChange(e.target.value as AlgorithmId)}
          className="bg-transparent border-0 text-xs font-bold text-slate-800 focus:ring-0 focus:outline-none cursor-pointer px-2 py-1 max-w-[200px] md:max-w-[320px] truncate"
        >
          {categories.map((cat, catIdx) => (
            <optgroup key={catIdx} label={cat.label} className="font-sans text-[11px] text-slate-400">
              {cat.problems.map((prob) => {
                const globalIndex = arrayProblems.findIndex((p) => p.id === prob.id) + 1;
                return (
                  <option key={prob.id} value={prob.id} className="text-slate-800 font-semibold">
                    #{String(globalIndex).padStart(2, '0')} · {prob.title}
                  </option>
                );
              })}
            </optgroup>
          ))}
        </select>

        <button
          onClick={handleNext}
          disabled={currentIndex === arrayProblems.length - 1}
          className="p-1.5 rounded-md hover:bg-white text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
          title="Next Algorithm (Right Arrow)"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Setup Tools Panel */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Presets */}
        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
          <button
            onClick={() => onPresetChange('sorted')}
            className="px-2 py-1 rounded-md text-slate-600 hover:text-slate-900 font-semibold hover:bg-white transition-all text-[11px]"
          >
            Sorted
          </button>
          <button
            onClick={() => onPresetChange('reverse')}
            className="px-2 py-1 rounded-md text-slate-600 hover:text-slate-900 font-semibold hover:bg-white transition-all text-[11px]"
          >
            Reverse
          </button>
          <button
            onClick={() => onPresetChange('duplicates')}
            className="px-2 py-1 rounded-md text-slate-600 hover:text-slate-900 font-semibold hover:bg-white transition-all text-[11px]"
          >
            Dupes
          </button>
          <button
            onClick={() => onPresetChange('random')}
            className="px-2 py-1 rounded-md text-slate-600 hover:text-slate-900 font-semibold hover:bg-white transition-all text-[11px]"
          >
            Random
          </button>
        </div>

        {/* Custom Input */}
        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 max-w-[190px]">
          <span className="text-slate-400 font-mono select-none text-[10px] uppercase font-bold">nums:</span>
          <input
            type="text"
            value={customInput}
            onChange={(e) => onCustomInputChange(e.target.value)}
            placeholder="[1,2,3]"
            className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-20 font-mono text-xs text-slate-800 font-bold"
          />
          <button
            onClick={onApplyCustomInput}
            className="text-amber-800 font-extrabold hover:text-amber-900 transition-colors text-[10px] uppercase tracking-wider"
          >
            Apply
          </button>
        </div>

        {/* Rotations K Parameter */}
        {['rotate-array'].includes(currentProblemId) && (
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <span className="text-slate-400 font-mono text-[10px] uppercase font-bold">k:</span>
            <input
              type="number"
              value={kValue}
              onChange={(e) => onKValueChange(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-transparent border-none p-0 focus:ring-0 focus:outline-none w-8 font-mono text-xs text-slate-800 text-center font-bold"
              min="1"
              max="20"
            />
          </div>
        )}

        {/* Action Controls */}
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 hover:border-slate-300 rounded-lg text-slate-600 hover:text-slate-900 font-semibold transition-colors bg-white shadow-xs"
          title="Reset Case (R)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
}
