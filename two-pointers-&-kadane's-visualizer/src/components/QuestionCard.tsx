import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, Layers, Lightbulb, Play } from 'lucide-react';
import { Problem } from '../types';

interface QuestionCardProps {
  problem: Problem;
  currentArray: number[];
  targetValue: number;
  onSimulate: () => void;
  onReset: () => void;
}

export default function QuestionCard({
  problem,
  currentArray,
  targetValue,
  onSimulate,
  onReset,
}: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Return badge styling for difficulty
  const getDifficultyBadge = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy':
        return (
          <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans font-semibold rounded-md shadow-xs">
            Easy
          </span>
        );
      case 'Medium':
        return (
          <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-sans font-semibold rounded-md shadow-xs">
            Medium
          </span>
        );
      case 'Hard':
        return (
          <span className="px-2.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-sans font-semibold rounded-md shadow-xs">
            Hard
          </span>
        );
    }
  };

  return (
    <div id="question-card" className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs shrink-0 flex flex-col gap-3">
      {/* Question Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-mono rounded font-semibold">
            Sequence #{String(problem.seq).padStart(2, '0')}
          </span>
          <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-800 text-[11px] font-mono rounded font-semibold">
            {problem.leetcodeId}
          </span>
          {getDifficultyBadge(problem.difficulty)}
          <h2 className="text-lg md:text-xl font-serif text-slate-800 font-bold ml-1">
            {problem.title}
          </h2>
        </div>

        {/* Toggle details button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-sans font-semibold transition-all shadow-xs"
        >
          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
          <span>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="text-sm text-slate-600 font-sans border-t border-slate-100 pt-3 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1">
            <p className="leading-relaxed text-slate-700 font-medium">
              {problem.description}
            </p>
          </div>
          <div className="flex-1 md:border-l md:border-slate-100 md:pl-4 bg-amber-50/40 p-3 rounded-lg border border-amber-100">
            <div className="flex items-center gap-1.5 text-amber-800 font-sans font-semibold text-xs mb-1">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Algorithmic Invariant</span>
            </div>
            <p className="text-xs text-amber-900/90 leading-normal italic font-medium">
              {problem.invariant}
            </p>
          </div>
        </div>
      )}

      {/* Compact Test Case Bar */}
      <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-sans font-bold text-slate-500 uppercase tracking-wider">Input Case:</span>
          <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded font-mono font-bold text-[13px] border border-slate-200 shadow-2xs">
            nums = [{currentArray.join(', ')}]
          </code>
          {problem.defaultTarget !== undefined && (
            <code className="bg-slate-100 text-slate-800 px-2 py-1 rounded font-mono font-bold text-[13px] border border-slate-200 shadow-2xs">
              target k = {targetValue}
            </code>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-sans font-semibold rounded-md shadow-xs transition-colors"
          >
            Reset Case
          </button>
          <button
            onClick={onSimulate}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-sans font-bold rounded-md shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" fill="currentColor" />
            <span>Simulate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
