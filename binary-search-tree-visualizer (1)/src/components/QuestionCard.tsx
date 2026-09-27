import React, { useState } from 'react';
import { BSTProblem } from '../data/bstProblems';
import { Play, RotateCcw, CheckCircle2, HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface QuestionCardProps {
  problem: BSTProblem;
  onExecute: (params: Record<string, any>) => void;
  onLoadTestCase: () => void;
  currentParams: Record<string, any>;
  onParamChange: (newParams: Record<string, any>) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  problem,
  onExecute,
  onLoadTestCase,
  currentParams,
  onParamChange,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const diffColor =
    problem.difficulty === 'Easy'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : problem.difficulty === 'Medium'
      ? 'bg-amber-50 text-amber-700 border-amber-200'
      : 'bg-rose-50 text-rose-700 border-rose-200';

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden transition-all shrink-0">
      {/* Question Header Bar */}
      <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-mono font-bold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
            #{String(problem.sequenceNumber).padStart(2, '0')}
          </span>
          <span className="text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded">
            {problem.leetcodeTag}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${diffColor}`}>
            {problem.difficulty}
          </span>
          <h2 className="font-serif font-bold text-sm text-slate-900 tracking-tight">
            {problem.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 font-medium px-2 py-0.5 rounded hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Compact View' : 'Problem Details'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-3">
        {/* Problem Description & Key Insight */}
        {isExpanded && (
          <div className="mb-2.5">
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              <strong className="text-slate-900 font-semibold">Problem: </strong>
              {problem.description}
            </p>
          </div>
        )}

        {/* Test Case & Parameter Controls Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-center bg-[#FAF9F6] border border-slate-200/90 rounded-lg p-2.5">
          {/* Sample Test Case Overview (Left 7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-1 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                Test Case
              </span>
              <span className="font-mono text-[11px] text-slate-800 font-medium">
                {problem.testCase.inputDisplay}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-[11px]">
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                Expected:
              </span>
              <span className="font-mono text-slate-700">{problem.testCase.expectedOutput}</span>
            </div>
            {isExpanded && (
              <p className="text-[11px] text-slate-500 font-sans leading-tight">
                {problem.testCase.explanation}
              </p>
            )}
          </div>

          {/* Dynamic Parameters & Action Buttons (Right 5 cols on lg) */}
          <div className="lg:col-span-5 flex items-center justify-start lg:justify-end gap-2 flex-wrap border-t lg:border-t-0 lg:border-l border-slate-200 pt-2 lg:pt-0 lg:pl-3">
            {/* 1. Target Value input for Search / Insert / Delete / Successor */}
            {['search', 'insert', 'delete', 'successor_predecessor'].includes(problem.id) && (
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] font-semibold text-slate-600">
                  {problem.id === 'search' ? 'Search:' : problem.id === 'delete' ? 'Delete:' : 'Val:'}
                </label>
                <input
                  type="number"
                  value={currentParams.value ?? 37}
                  onChange={(e) => onParamChange({ ...currentParams, value: Number(e.target.value) })}
                  className="w-16 bg-white border border-slate-200 rounded px-2 py-0.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* 2. K-th Element inputs */}
            {problem.id === 'kth_element' && (
              <div className="flex items-center gap-1.5">
                <label className="text-[11px] font-semibold text-slate-600">k:</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={currentParams.k ?? 3}
                  onChange={(e) => onParamChange({ ...currentParams, k: Number(e.target.value) })}
                  className="w-12 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs text-slate-800 font-mono"
                />
                <select
                  value={currentParams.kthMode ?? 'smallest'}
                  onChange={(e) =>
                    onParamChange({ ...currentParams, kthMode: e.target.value as 'smallest' | 'largest' })
                  }
                  className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[11px] text-slate-700 font-sans cursor-pointer"
                >
                  <option value="smallest">Smallest</option>
                  <option value="largest">Largest</option>
                </select>
              </div>
            )}

            {/* 3. Range Sum / Prune inputs */}
            {(problem.id === 'range_sum' || problem.id === 'prune') && (
              <div className="flex items-center gap-1 text-[11px]">
                <label className="font-semibold text-slate-600">Range:</label>
                <input
                  type="number"
                  value={currentParams.low ?? 25}
                  onChange={(e) => onParamChange({ ...currentParams, low: Number(e.target.value) })}
                  className="w-12 bg-white border border-slate-200 rounded px-1 py-0.5 text-xs font-mono"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  value={currentParams.high ?? 65}
                  onChange={(e) => onParamChange({ ...currentParams, high: Number(e.target.value) })}
                  className="w-12 bg-white border border-slate-200 rounded px-1 py-0.5 text-xs font-mono"
                />
              </div>
            )}

            {/* 4. LCA inputs */}
            {problem.id === 'lca' && (
              <div className="flex items-center gap-1 text-[11px]">
                <label className="font-semibold text-slate-600">p:</label>
                <input
                  type="number"
                  value={currentParams.pVal ?? 12}
                  onChange={(e) => onParamChange({ ...currentParams, pVal: Number(e.target.value) })}
                  className="w-12 bg-white border border-slate-200 rounded px-1 py-0.5 text-xs font-mono"
                />
                <label className="font-semibold text-slate-600 ml-1">q:</label>
                <input
                  type="number"
                  value={currentParams.qVal ?? 37}
                  onChange={(e) => onParamChange({ ...currentParams, qVal: Number(e.target.value) })}
                  className="w-12 bg-white border border-slate-200 rounded px-1 py-0.5 text-xs font-mono"
                />
              </div>
            )}

            {/* 5. Sorted Array input */}
            {problem.id === 'sorted_array_to_bst' && (
              <div className="flex items-center gap-1 text-[11px]">
                <input
                  type="text"
                  value={currentParams.sortedArrayStr ?? '12, 25, 37, 50, 62, 75, 87'}
                  onChange={(e) => onParamChange({ ...currentParams, sortedArrayStr: e.target.value })}
                  className="w-40 bg-white border border-slate-200 rounded px-2 py-0.5 text-xs font-mono"
                />
              </div>
            )}

            {/* 6. Preorder Array input */}
            {problem.id === 'bst_from_preorder' && (
              <div className="flex items-center gap-1 text-[11px]">
                <input
                  type="text"
                  value={currentParams.preorderStr ?? '50, 25, 12, 37, 75, 62, 87'}
                  onChange={(e) => onParamChange({ ...currentParams, preorderStr: e.target.value })}
                  className="w-40 bg-white border border-slate-200 rounded px-2 py-0.5 text-xs font-mono"
                />
              </div>
            )}

            {/* 7. Two Sum input */}
            {problem.id === 'two_sum' && (
              <div className="flex items-center gap-1.5 text-[11px]">
                <label className="font-semibold text-slate-600">Target k:</label>
                <input
                  type="number"
                  value={currentParams.target ?? 74}
                  onChange={(e) =>
                    onParamChange({ ...currentParams, target: Number(e.target.value), value: Number(e.target.value) })
                  }
                  className="w-16 bg-white border border-slate-200 rounded px-2 py-0.5 text-xs font-mono"
                />
              </div>
            )}

            {/* 8. Closest Value input */}
            {problem.id === 'closest_value' && (
              <div className="flex items-center gap-1.5 text-[11px]">
                <label className="font-semibold text-slate-600">Target:</label>
                <input
                  type="number"
                  value={currentParams.target ?? 34}
                  onChange={(e) =>
                    onParamChange({ ...currentParams, target: Number(e.target.value), value: Number(e.target.value) })
                  }
                  className="w-16 bg-white border border-slate-200 rounded px-2 py-0.5 text-xs font-mono"
                />
              </div>
            )}

            {/* Action Buttons: Load Test Case & Run */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={onLoadTestCase}
                title="Reset Tree & Parameters to Sample Test Case"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-200 rounded-md px-2 py-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span className="hidden sm:inline">Reset Case</span>
              </button>

              <button
                type="button"
                onClick={() => onExecute(currentParams)}
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3 py-1 rounded-md shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Simulate</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
