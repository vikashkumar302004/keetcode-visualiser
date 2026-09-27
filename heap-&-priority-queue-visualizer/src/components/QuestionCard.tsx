import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Play, RotateCcw, Info, Lightbulb, Clock, Database } from 'lucide-react';
import { ProblemDefinition, Difficulty } from '../types';

interface QuestionCardProps {
  problem: ProblemDefinition;
  testCase: Record<string, any>;
  onUpdateParam: (key: string, value: any) => void;
  onResetCase: () => void;
  onSimulate: () => void;
  isSimulating: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  problem,
  testCase,
  onUpdateParam,
  onResetCase,
  onSimulate,
  isSimulating
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const difficultyColors: Record<Difficulty, { bg: string; text: string; border: string }> = {
    Easy: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
    Medium: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
    Hard: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
  };

  const diffStyle = difficultyColors[problem.difficulty];

  // Helper to serialize parameter value for input
  const formatValueForInput = (val: any): string => {
    if (Array.isArray(val)) {
      return JSON.stringify(val);
    }
    return String(val ?? '');
  };

  const handleInputChange = (key: string, type: string, rawStr: string) => {
    try {
      if (type === 'number') {
        const num = Number(rawStr);
        onUpdateParam(key, isNaN(num) ? 0 : num);
      } else if (type === 'array' || type === 'matrix') {
        const parsed = JSON.parse(rawStr);
        onUpdateParam(key, parsed);
      } else {
        onUpdateParam(key, rawStr);
      }
    } catch {
      // Fallback for typing
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 transition-all shadow-2xs">
      {/* Top row: Title, Badges, Expand Toggle */}
      <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            #{String(problem.sequenceNumber).padStart(2, '0')}
          </span>

          {problem.leetCodeNum && (
            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              LC #{problem.leetCodeNum}
            </span>
          )}

          <span
            className={`font-sans text-xs font-semibold px-2 py-0.5 rounded border ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}
          >
            {problem.difficulty}
          </span>

          <span className="text-xs font-medium text-slate-400 hidden sm:inline">•</span>

          <span className="text-xs font-medium text-slate-500 hidden sm:inline">
            {problem.category}
          </span>

          <h1 className="font-serif font-bold text-sm sm:text-base text-slate-900 tracking-tight ml-1">
            {problem.title}
          </h1>
        </div>

        <button
          id="toggle-problem-details-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <span>{isExpanded ? 'Hide Details' : 'Problem Details'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Details Section */}
      {isExpanded && (
        <div className="mt-2.5 pt-2.5 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="md:col-span-2">
            <p className="text-slate-700 leading-relaxed font-sans">{problem.description}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-500 font-mono">
              {problem.constraints.map((c, i) => (
                <span key={i} className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-lg p-2.5 border border-slate-200/80 space-y-1.5 font-sans">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="font-semibold text-slate-800">Time:</span>
              <span className="font-mono text-[11px] text-slate-600">{problem.complexity.time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Database className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="font-semibold text-slate-800">Space:</span>
              <span className="font-mono text-[11px] text-slate-600">{problem.complexity.space}</span>
            </div>
          </div>
        </div>
      )}

      {/* Compact Test Case Bar */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap lg:flex-nowrap">
        {/* Dynamic Inputs */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {problem.params.map((param) => (
            <div key={param.key} className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-200">
              <label htmlFor={`param-${param.key}`} className="text-[11px] font-semibold text-slate-600 font-mono shrink-0">
                {param.label}:
              </label>
              <input
                id={`param-${param.key}`}
                type="text"
                defaultValue={formatValueForInput(testCase[param.key])}
                key={`${problem.id}-${param.key}-${JSON.stringify(testCase[param.key])}`}
                onBlur={(e) => handleInputChange(param.key, param.type, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleInputChange(param.key, param.type, (e.target as HTMLInputElement).value);
                    onSimulate();
                  }
                }}
                className="font-mono text-xs text-slate-800 bg-white px-1.5 py-0.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 min-w-[60px] max-w-[200px]"
              />
            </div>
          ))}

          {/* Algorithmic Insight Pill */}
          <div className="hidden xl:flex items-center gap-1 text-[11px] text-amber-800 bg-amber-50/80 px-2 py-1 rounded border border-amber-200/80 max-w-md truncate">
            <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="truncate">{problem.algorithmicInsight}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            id="reset-test-case-btn"
            onClick={onResetCase}
            title="Reset to default test case"
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Case</span>
          </button>

          <button
            id="simulate-action-btn"
            onClick={onSimulate}
            className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-md shadow-xs transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isSimulating ? 'Restart Simulation' : 'Simulate'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
