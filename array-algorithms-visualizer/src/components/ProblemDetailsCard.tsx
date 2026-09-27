/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Lightbulb, Eye, EyeOff } from 'lucide-react';
import { arrayProblems } from '../data/arrayProblems';
import { AlgorithmId } from '../types';

interface ProblemDetailsCardProps {
  currentProblemId: AlgorithmId;
  inputArray: number[];
  finalArray: number[];
  params: Record<string, any>;
}

export default function ProblemDetailsCard({
  currentProblemId,
  inputArray,
  finalArray,
  params,
}: ProblemDetailsCardProps) {
  const [showDescription, setShowDescription] = useState(true);
  const problem = arrayProblems.find((p) => p.id === currentProblemId);

  if (!problem) return null;

  const difficultyColors = {
    Easy: 'text-emerald-700 bg-emerald-50 border-emerald-150',
    Medium: 'text-amber-800 bg-amber-50 border-amber-150',
    Hard: 'text-rose-700 bg-rose-50 border-rose-150',
  };

  // Render extra inputs (like k or nums2)
  const renderExtraInputs = () => {
    if (currentProblemId === 'rotate-array' && params.k !== undefined) {
      return `, k = ${params.k}`;
    }
    if (currentProblemId === 'merge-sorted') {
      return `, nums2 = [2,4,6]`;
    }
    return '';
  };

  // Format matrix output if needed
  const formatArrayDisplay = (arr: number[]) => {
    if (currentProblemId === 'set-matrix-zeroes') {
      return `[[${arr.slice(0, 3).join(',')}], [${arr.slice(3, 6).join(',')}], [${arr.slice(6, 9).join(',')}]]`;
    }
    return `[${arr.join(', ')}]`;
  };

  return (
    <div className="bg-white border border-slate-250/85 rounded-xl shadow-xs overflow-hidden p-4 flex flex-col gap-3 animate-fadeIn">
      {/* Top Header Row with Title and Show/Hide Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider bg-slate-100 px-2 py-0.5 rounded uppercase">
            {problem.leetcodeTag}
          </span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
              difficultyColors[problem.difficulty]
            }`}
          >
            {problem.difficulty}
          </span>
          <h2 className="text-base font-bold text-slate-800 font-serif">
            {problem.title}
          </h2>
        </div>

        {/* Show/Hide Controls & Complexities */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          {/* Hide / Show Description Toggle */}
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 hover:border-slate-300 hover:text-slate-800 rounded-lg transition-all"
          >
            {showDescription ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                <span>Hide Description</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                <span>Show Description</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="font-semibold text-slate-700">Time:</span>{' '}
            <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">O(N)</span>
            <span className="text-slate-300">·</span>
            <span className="font-semibold text-slate-700">Space:</span>{' '}
            <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">O(1)</span>
          </div>
        </div>
      </div>

      {/* Description & Test Case (Collapsible section) */}
      {showDescription && (
        <div className="flex flex-col gap-3 animate-slideDown">
          {/* Description text */}
          <div className="text-xs text-slate-600 leading-relaxed font-medium">
            {problem.description}
          </div>

          {/* Live Dynamic Test Case Bar */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-slate-50 border border-slate-200/60 rounded-lg p-3">
            {/* Input */}
            <div className="md:col-span-4 flex flex-col gap-0.5 font-mono text-[11px]">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">
                Live Input Case
              </span>
              <div className="text-slate-700 truncate font-semibold">
                nums = {formatArrayDisplay(inputArray)}
                {renderExtraInputs()}
              </div>
            </div>

            {/* Arrow Spacer */}
            <div className="hidden md:flex md:col-span-1 items-center justify-center">
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* Expected Output */}
            <div className="md:col-span-3 flex flex-col gap-0.5 font-mono text-[11px]">
              <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                Expected Output
              </span>
              <div className="text-emerald-800 font-extrabold truncate">
                {formatArrayDisplay(finalArray)}
              </div>
            </div>

            {/* Key Invariant */}
            <div className="md:col-span-4 flex flex-col gap-0.5 text-[11px] border-t md:border-t-0 md:border-l border-slate-200/80 pt-2 md:pt-0 md:pl-3">
              <span className="text-amber-800 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 fill-amber-100" />
                Core Invariant
              </span>
              <div className="text-slate-600 font-mono italic truncate" title={problem.keyInvariant}>
                {problem.keyInvariant}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
