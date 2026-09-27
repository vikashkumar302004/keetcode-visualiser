/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Problem } from '../types';
import { BookOpen, AlertCircle, Settings, HelpCircle, RefreshCw } from 'lucide-react';

interface QuestionCardProps {
  problem: Problem;
  arrayInput: string;
  setArrayInput: (val: string) => void;
  targetInput: number;
  setTargetInput: (val: number) => void;
  extraParams: Record<string, number>;
  setExtraParams: (params: Record<string, number>) => void;
  onApplyInputs: () => void;
  onResetToDefault: () => void;
  isQuestionHidden: boolean;
  onToggleQuestion: () => void;
}

export default function QuestionCard({
  problem,
  arrayInput,
  setArrayInput,
  targetInput,
  setTargetInput,
  extraParams,
  setExtraParams,
  onApplyInputs,
  onResetToDefault,
  isQuestionHidden,
  onToggleQuestion
}: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localArray, setLocalArray] = useState(arrayInput);
  const [localTarget, setLocalTarget] = useState(targetInput);
  const [localExtra, setLocalExtra] = useState(extraParams);

  // Sync state with parent props
  useEffect(() => {
    setLocalArray(arrayInput);
  }, [arrayInput]);

  useEffect(() => {
    setLocalTarget(targetInput);
  }, [targetInput]);

  useEffect(() => {
    setLocalExtra(extraParams);
  }, [extraParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyInputs();
  };

  const handleArrayChange = (val: string) => {
    setLocalArray(val);
    setArrayInput(val);
  };

  const handleTargetChange = (val: number) => {
    setLocalTarget(val);
    setTargetInput(val);
  };

  const handleExtraChange = (key: string, value: number) => {
    const updated = { ...localExtra, [key]: value };
    setLocalExtra(updated);
    setExtraParams(updated);
  };

  // Difficulty colors (unboxed or subtle clean indicator)
  const getDiffColor = (diff: Problem['difficulty']) => {
    switch (diff) {
      case 'Easy': return 'text-emerald-600 font-semibold';
      case 'Medium': return 'text-amber-600 font-semibold';
      case 'Hard': return 'text-rose-600 font-semibold';
    }
  };

  const is2D = problem.category === '2D Matrix Search';
  const hasExtra = !!problem.extraParams;

  return (
    <div className={`bg-white border border-slate-200 rounded-lg shadow-sm font-sans flex flex-col transition-all duration-300 ${isQuestionHidden ? 'p-3 gap-0' : 'p-4 gap-3.5'}`}>
      {/* Question Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Problem {problem.sequenceNum}</span>
            <span>·</span>
            <span>{problem.leetcode}</span>
            <span>·</span>
            <span className={getDiffColor(problem.difficulty)}>{problem.difficulty}</span>
            {!isQuestionHidden && (
              <>
                <span>·</span>
                <span className="text-slate-600 font-medium">{problem.category}</span>
              </>
            )}
          </div>
          <h2 className={`font-bold text-slate-900 font-serif leading-tight ${isQuestionHidden ? 'text-sm md:text-base' : 'text-xl'}`}>
            {problem.title}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Collapse Info / Expand Toggle */}
          <button
            type="button"
            onClick={onToggleQuestion}
            className={`text-xs font-semibold flex items-center gap-1.5 py-1 px-2.5 rounded border transition-colors cursor-pointer ${
              isQuestionHidden 
                ? 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <span>{isQuestionHidden ? 'Show Info & Input' : 'Hide Info'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={isQuestionHidden}
            className={`text-xs font-semibold flex items-center gap-1.5 py-1 px-2.5 rounded border transition-colors ${
              isQuestionHidden
                ? 'bg-slate-50 text-slate-300 border-slate-100 cursor-not-allowed'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isExpanded ? 'Hide Details' : 'Problem Details'}</span>
          </button>
        </div>
      </div>

      {!isQuestionHidden && (
        <>
          {/* Expanded Details and Explanation */}
          {isExpanded && (
            <div className="bg-slate-50 border border-slate-100 rounded-md p-3.5 text-xs text-slate-600 flex flex-col gap-2.5">
              <p className="font-medium leading-relaxed text-slate-700">{problem.details}</p>
              <div className="border-t border-slate-200/60 pt-2 flex flex-col gap-1">
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 inline" />
                  Mathematical Invariant:
                </span>
                <code className="text-[11px] font-mono bg-slate-100 p-1.5 rounded block border border-slate-200/50 text-slate-800">
                  {problem.invariant}
                </code>
              </div>
            </div>
          )}

          {/* Main compact description */}
          <p className="text-sm text-slate-700 font-medium bg-amber-500/5 border-l-2 border-amber-500 pl-3.5 py-1">
            {problem.description}
          </p>

          {/* Input Console */}
          <form onSubmit={handleSubmit} className="border-t border-slate-100 pt-3 flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
              {/* Array Input field */}
              <div className="md:col-span-6 flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <span>{is2D ? 'Matrix Grid (JSON Array)' : 'Search Array (Comma separated)'}</span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {is2D ? '[[1,2],[3,4]]' : 'nums'}
                  </span>
                </label>
                <input
                  type="text"
                  value={localArray}
                  onChange={(e) => handleArrayChange(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500 text-slate-800"
                  placeholder={is2D ? '[[1, 3], [5, 7]]' : '1, 3, 5, 7, 9'}
                />
              </div>

              {/* Target Value input */}
              <div className="md:col-span-3 flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <span>Target Value</span>
                  <span className="text-[10px] text-slate-400 font-mono">target</span>
                </label>
                <input
                  type="number"
                  value={localTarget}
                  onChange={(e) => handleTargetChange(parseInt(e.target.value) || 0)}
                  className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500/40 focus:border-amber-500 text-slate-800"
                  disabled={problem.id === 'single-element-sorted' || problem.id === 'find-min-rotated' || problem.id === 'peak-mountain'}
                />
              </div>

              {/* Extra Parameter Controls (Sliders for shipWithinDays, cocoBananas, aggressiveCows, splitArray) */}
              {hasExtra && problem.extraParams && (
                <div className="md:col-span-3 flex flex-col gap-1">
                  {Object.entries(problem.extraParams).map(([key, config]) => (
                    <div key={key} className="flex flex-col gap-1 w-full">
                      <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                        <span>{config.label}</span>
                        <span className="text-[10px] font-mono text-amber-800 font-bold bg-amber-50 px-1 rounded">
                          {localExtra[key] ?? config.defaultValue}
                        </span>
                      </label>
                      <input
                        type="range"
                        min={config.min}
                        max={config.max}
                        step={config.step ?? 1}
                        value={localExtra[key] ?? config.defaultValue}
                        onChange={(e) => handleExtraChange(key, parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Controls Trigger Bar */}
              <div className={`md:col-span-3 flex items-center gap-2 ${!hasExtra ? 'md:col-span-3' : 'md:col-span-12'}`}>
                <button
                  type="button"
                  onClick={onResetToDefault}
                  className="p-2 rounded border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center cursor-pointer"
                  title="Reset Test Case to Problem Default"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 px-3 bg-slate-900 border border-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-800 transition-all cursor-pointer text-center"
                >
                  Apply Case
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
