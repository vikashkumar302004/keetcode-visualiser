import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Play, RotateCcw } from 'lucide-react';
import { Problem, Difficulty } from '../types';

interface QuestionCardProps {
  problem: Problem;
  inputValue: string;
  onInputChange: (val: string) => void;
  onReset: () => void;
  onSimulate: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  problem,
  inputValue,
  onInputChange,
  onReset,
  onSimulate,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const getDifficultyStyles = (diff: Difficulty) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/50';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200/50';
      case 'Hard':
        return 'bg-rose-50 text-rose-800 border-rose-200/50';
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 shrink-0 select-none">
      {/* Question Header & Title Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-bold text-amber-800 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-200/50">
            #{problem.seq}
          </span>
          <h2 className="font-serif text-lg font-bold text-slate-900 tracking-tight">
            {problem.title}
          </h2>
          <span className={`text-[11px] font-sans font-bold px-2 py-0.5 rounded-full border ${getDifficultyStyles(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
          {problem.leetcode !== 'N/A' && (
            <span className="text-[11px] font-sans font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              {problem.leetcode}
            </span>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-xs font-sans font-semibold transition-colors"
          id="toggle-details-btn"
        >
          {expanded ? (
            <>
              Hide Details <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Problem Details <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Expanded Problem Details (Drawer feel, NOT nested cards) */}
      {expanded && (
        <div className="mt-2 py-2 px-3 bg-slate-50 border border-slate-200/65 rounded-lg text-xs leading-relaxed text-slate-600 font-sans transition-all">
          <p className="font-semibold text-slate-800 mb-1">Description:</p>
          <p className="mb-2">{problem.description}</p>
          <p className="font-semibold text-amber-800 mb-1 flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 inline" /> Key Algorithmic Insight:
          </p>
          <p className="text-amber-900">{problem.keyInsight}</p>
        </div>
      )}

      {/* Compact Test Case Input Bar */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3 bg-[#FAF9F6] border border-slate-200/70 rounded-lg p-2">
        <div className="flex-1 min-w-[280px] flex items-center gap-2">
          <label className="text-[11px] font-sans font-bold text-slate-600 shrink-0 uppercase tracking-wider">
            Active Input:
          </label>
          <div className="relative flex-1">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={problem.inputPlaceholder}
              className="w-full font-mono text-xs text-slate-800 bg-white border border-slate-200 rounded-md py-1 px-2 pr-20 focus:ring-1 focus:ring-amber-500 focus:border-amber-500 focus:outline-hidden"
              id="active-testcase-input"
            />
            <span className="absolute right-2 top-1.5 text-[9px] font-sans font-semibold text-slate-400 pointer-events-none uppercase tracking-tight">
              {problem.inputType === 'array' ? 'Array (1D)' : 'Text String'}
            </span>
          </div>
        </div>

        {/* Simulator Control Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onReset}
            className="flex items-center gap-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-sans font-bold py-1 px-2.5 rounded-md transition-colors"
            title="Reset to default values"
            id="reset-testcase-btn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Case
          </button>
          
          <button
            onClick={onSimulate}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 border border-amber-200 hover:border-amber-400 text-amber-950 text-xs font-sans font-bold py-1 px-3 rounded-md transition-all shadow-xs"
            id="simulate-btn"
          >
            <Play className="fill-current w-3 h-3" />
            Simulate
          </button>
        </div>
      </div>
    </div>
  );
};
