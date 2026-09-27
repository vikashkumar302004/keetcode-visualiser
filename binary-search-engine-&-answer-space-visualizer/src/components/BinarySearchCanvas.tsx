/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, ArrowLeft, ArrowDown, Check } from 'lucide-react';
import { SimulationStep, Problem } from '../types';

interface BinarySearchCanvasProps {
  problem: Problem;
  array: number[];
  step: SimulationStep;
  target: number;
}

export default function BinarySearchCanvas({
  problem,
  array,
  step,
  target
}: BinarySearchCanvasProps) {
  const { low, high, mid, found, foundIndex, discardedRanges, ans } = step;

  // Check if an index is discarded
  const isDiscarded = (idx: number) => {
    return discardedRanges.some(range => idx >= range.start && idx <= range.end);
  };

  // Determine if this item is target match
  const isMatch = (idx: number) => {
    if (problem.id === 'first-last-pos') {
      // For first-last position, highlight matches
      return array[idx] === target && (idx === step.variables.first_pos || idx === step.variables.last_pos || idx === mid);
    }
    if (problem.id === 'single-element-sorted' || problem.id === 'find-min-rotated' || problem.id === 'peak-mountain') {
      // These don't look for target, they look for answers
      return idx === foundIndex;
    }
    return idx === mid && array[idx] === target;
  };

  return (
    <div className="bg-[#FAF9F6] border border-slate-200 rounded-lg p-5 flex flex-col gap-6 relative overflow-hidden">
      {/* Background visual detail */}
      <div className="absolute top-0 right-0 p-3 text-[10px] text-slate-300 font-mono select-none">
        1D SPACE CANVAS
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-slate-700 font-sans uppercase tracking-wider">
          Array Search Space Ribbon
        </h3>
        <p className="text-xs text-slate-500">
          Observe how the active search space (highlighted) halves with every step as pointers adjust.
        </p>
      </div>

      {/* Main Ribbon Container */}
      <div className="flex flex-col gap-4 py-4 overflow-x-auto select-none">
        <div className="flex items-center gap-1.5 min-w-max px-2">
          {array.map((value, idx) => {
            const itemDiscarded = isDiscarded(idx);
            const isLow = idx === low;
            const isHigh = idx === high;
            const isMid = idx === mid;
            const itemMatched = isMatch(idx);

            // Determine border color for the index cell
            let cardBg = 'bg-white';
            let cardBorder = 'border-slate-200';
            let textColor = 'text-slate-800';

            if (itemMatched) {
              cardBg = 'bg-emerald-500 animate-pulse';
              cardBorder = 'border-emerald-600';
              textColor = 'text-white font-bold';
            } else if (isMid) {
              cardBg = 'bg-amber-100';
              cardBorder = 'border-amber-400 ring-2 ring-amber-400/20';
              textColor = 'text-amber-900 font-bold';
            } else if (idx >= low && idx <= high) {
              cardBg = 'bg-slate-50';
              cardBorder = 'border-amber-500/40';
              textColor = 'text-slate-900 font-semibold';
            } else if (itemDiscarded) {
              cardBg = 'bg-slate-100/50';
              cardBorder = 'border-slate-200/50';
              textColor = 'text-slate-400';
            }

            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-1.5 relative w-14 transition-all duration-300"
              >
                {/* Pointer Indicators Above Index Cell */}
                <div className="h-10 flex flex-col items-center justify-end w-full gap-0.5">
                  {isMid && (
                    <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold font-sans bg-amber-500 text-white rounded shadow-sm animate-bounce">
                      <ArrowDown className="w-2.5 h-2.5" />
                      <span>mid</span>
                    </span>
                  )}
                  <div className="flex items-center gap-0.5">
                    {isLow && (
                      <span className="px-1 py-0.5 text-[8px] font-bold font-sans bg-indigo-600 text-white rounded">
                        L
                      </span>
                    )}
                    {isHigh && (
                      <span className="px-1 py-0.5 text-[8px] font-bold font-sans bg-amber-700 text-white rounded">
                        H
                      </span>
                    )}
                  </div>
                </div>

                {/* Index Cell */}
                <div
                  className={`w-12 h-12 rounded border flex flex-col items-center justify-center transition-all duration-300 ${cardBg} ${cardBorder}`}
                >
                  <span className={`text-sm font-mono ${textColor}`}>
                    {value}
                  </span>
                  {itemMatched && (
                    <Check className="w-3.5 h-3.5 text-white absolute bottom-1 right-2.5" />
                  )}
                </div>

                {/* Index Label Below Cell */}
                <span className="text-[10px] font-mono text-slate-400">
                  [{idx}]
                </span>

                {/* Diagonal Stripe / Strikeout overlay for Discarded */}
                {itemDiscarded && (
                  <div className="absolute inset-0 top-10 pointer-events-none flex items-center justify-center">
                    <div className="w-10 h-0.5 bg-slate-300/60 rotate-12 absolute" />
                    <div className="w-10 h-0.5 bg-slate-300/60 -rotate-12 absolute" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic range helper footer */}
      <div className="flex items-center justify-between border-t border-slate-200/60 pt-3.5 text-xs text-slate-500 font-sans">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-600 inline-block" />
            <span>Low Pointer (<code className="font-mono">{low}</code>)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
            <span>Mid Pointer (<code className="font-mono">{mid !== null ? mid : 'N/A'}</code>)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-700 inline-block" />
            <span>High Pointer (<code className="font-mono">{high}</code>)</span>
          </div>
        </div>

        <div className="text-right text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          Active Search Scope: [<span className="text-indigo-600 font-semibold">{low}</span> ... <span className="text-amber-800 font-semibold">{high}</span>] (Size: {Math.max(0, high - low + 1)})
        </div>
      </div>
    </div>
  );
}
