import React from 'react';
import { 
  Play, 
  RotateCcw, 
  Info, 
  HelpCircle, 
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ProblemDefinition, TestCasePreset } from '../types';

interface QuestionCardProps {
  problem: ProblemDefinition;
  inputVal: string;
  paramK: number;
  paramTarget: string;
  onInputChange: (val: string) => void;
  onParamKChange: (val: number) => void;
  onParamTargetChange: (val: string) => void;
  onSelectPreset: (preset: TestCasePreset) => void;
  onResetCase: () => void;
  onRunSimulation: () => void;
  detailsExpanded: boolean;
  onToggleDetails: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  problem,
  inputVal,
  paramK,
  paramTarget,
  onInputChange,
  onParamKChange,
  onParamTargetChange,
  onSelectPreset,
  onResetCase,
  onRunSimulation,
  detailsExpanded,
  onToggleDetails
}) => {
  const getDifficultyBadge = () => {
    switch (problem.difficulty) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hard':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2.5 shrink-0 z-10 transition-all">
      {/* Top Row: Meta and Title */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2.5 flex-wrap">
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200">
            #{String(problem.seq).padStart(2, '0')}
          </span>

          {problem.leetcodeNumber && (
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-200">
              LC #{problem.leetcodeNumber}
            </span>
          )}

          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-sm border ${getDifficultyBadge()}`}>
            {problem.difficulty}
          </span>

          <span className="text-[11px] font-medium px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 border border-slate-200">
            {problem.patternLabel}
          </span>

          <h1 className="font-serif font-bold text-slate-900 text-base sm:text-lg tracking-tight">
            {problem.title}
          </h1>
        </div>

        {/* Presets and Details Toggle */}
        <div className="flex items-center space-x-2">
          {problem.presets.length > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-xs text-slate-500 hidden lg:inline">Presets:</span>
              <div className="flex space-x-1">
                {problem.presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectPreset(preset)}
                    className="text-[11px] font-medium px-2 py-1 rounded-sm border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                    title={preset.description}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={onToggleDetails}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-0.5 p-1 rounded-sm hover:bg-slate-100 transition-colors"
            title="Toggle invariant notes and description"
          >
            {detailsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Details Drawer */}
      {detailsExpanded && (
        <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-600 grid grid-cols-1 md:grid-cols-3 gap-3 bg-amber-50/40 p-2.5 rounded-md border border-amber-100">
          <div className="md:col-span-2">
            <span className="font-semibold text-slate-800">Problem Summary: </span>
            <span>{problem.summary}</span>
            <div className="mt-1 flex items-start space-x-1 text-amber-900">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong className="font-medium text-amber-950">Invariant: </strong>
                {problem.invariant}
              </span>
            </div>
          </div>
          <div className="flex flex-col justify-center space-y-1 font-mono text-[11px] text-slate-600 md:border-l md:border-amber-200/60 md:pl-3">
            <div>Time Complexity: <span className="font-bold text-slate-800">{problem.timeComplexity}</span></div>
            <div>Space Complexity: <span className="font-bold text-slate-800">{problem.spaceComplexity}</span></div>
          </div>
        </div>
      )}

      {/* Compact Test Case Bar & Invariant Strip */}
      <div className="mt-2 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        {/* Dynamic Parameter Fields */}
        <div className="flex items-center space-x-2 flex-wrap text-xs">
          <div className="flex items-center space-x-1.5">
            <label className="font-mono text-slate-500 font-medium">
              {problem.inputType === 'array' ? 'nums =' : 's ='}
            </label>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => onInputChange(e.target.value)}
              className="font-mono text-xs px-2.5 py-1 rounded-sm border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 focus:outline-hidden w-44 sm:w-56 md:w-64"
              placeholder={problem.inputType === 'array' ? 'e.g. 2, 1, 5, 1, 3, 2' : 'e.g. ADOBECODEBANC'}
            />
          </div>

          {problem.paramLabel && (
            <div className="flex items-center space-x-1.5">
              <label className="font-mono text-slate-500 font-medium">
                {problem.paramLabel}:
              </label>
              <input
                type="number"
                value={paramK}
                onChange={(e) => onParamKChange(Math.max(1, Number(e.target.value) || 1))}
                className="font-mono text-xs px-2 py-1 rounded-sm border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 focus:outline-hidden w-16 text-center"
                min={1}
              />
            </div>
          )}

          {problem.paramTargetLabel && (
            <div className="flex items-center space-x-1.5">
              <label className="font-mono text-slate-500 font-medium">
                {problem.paramTargetLabel}:
              </label>
              <input
                type="text"
                value={paramTarget}
                onChange={(e) => onParamTargetChange(e.target.value)}
                className="font-mono text-xs px-2 py-1 rounded-sm border border-slate-200 bg-slate-50 focus:bg-white focus:border-amber-400 focus:outline-hidden w-24"
              />
            </div>
          )}
        </div>

        {/* Action Buttons: Reset Case & Simulate */}
        <div className="flex items-center space-x-2">
          <button
            id="btn-reset-test-case"
            onClick={onResetCase}
            title="Revert input parameters to default preset"
            className="px-2.5 py-1 rounded-sm text-xs font-medium border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors flex items-center space-x-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Case</span>
          </button>

          <button
            id="btn-run-simulation"
            onClick={onRunSimulation}
            className="px-3 py-1 rounded-sm text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-2xs transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Simulate</span>
          </button>
        </div>
      </div>
    </div>
  );
};
