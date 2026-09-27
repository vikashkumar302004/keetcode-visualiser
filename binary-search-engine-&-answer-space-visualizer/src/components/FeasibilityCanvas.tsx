/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, ShieldAlert, ArrowRight, ArrowDown, HelpCircle } from 'lucide-react';
import { Problem, SimulationStep } from '../types';

interface FeasibilityCanvasProps {
  problem: Problem;
  step: SimulationStep;
  array: any;
}

export default function FeasibilityCanvas({
  problem,
  step,
  array
}: FeasibilityCanvasProps) {
  const { low, high, mid, predicateState, ans } = step;

  // Render Candidate Search Space Spectrum
  const renderSpectrum = () => {
    // We want to draw a horizontal bar representing range [low ... high]
    // with markers for low, mid, and high
    if (mid === null) return null;

    const totalRange = Math.max(1, high - low);
    const midPercent = Math.min(100, Math.max(0, ((mid - low) / totalRange) * 100));

    return (
      <div className="flex flex-col gap-2 bg-slate-50 border border-slate-200/60 rounded-md p-3.5">
        <div className="flex justify-between items-center text-xs text-slate-500 font-sans font-medium">
          <span>Search Space Spectrum:</span>
          <span>Candidate Range: <code className="font-mono text-amber-800 font-semibold">{low} ... {high}</code></span>
        </div>

        {/* Visual Slider/Spectrum Bar */}
        <div className="relative h-6 flex items-center mt-3">
          {/* Active Range bar */}
          <div className="absolute left-0 right-0 h-2 bg-slate-200 rounded-full" />
          <div className="absolute h-2 bg-amber-500/35 rounded-full" style={{ left: '0%', right: '0%' }} />

          {/* Markers */}
          {/* Low */}
          <div className="absolute left-0 -translate-x-1/2 flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 border border-white shadow-sm" />
            <span className="text-[10px] font-mono text-indigo-700 font-bold mt-1">L={low}</span>
          </div>

          {/* Mid */}
          <div
            className="absolute flex flex-col items-center transition-all duration-300"
            style={{ left: `${midPercent}%` }}
          >
            <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow animate-ping absolute -top-1" />
            <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow z-10" />
            <span className="text-[10px] font-mono text-amber-800 font-bold mt-1 bg-amber-100 px-1 rounded border border-amber-300">
              mid={mid}
            </span>
          </div>

          {/* High */}
          <div className="absolute right-0 translate-x-1/2 flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-700 border border-white shadow-sm" />
            <span className="text-[10px] font-mono text-amber-800 font-bold mt-1">H={high}</span>
          </div>
        </div>

        {/* Saved Candidate indicator */}
        {ans !== null && ans !== undefined && (
          <div className="text-[10px] text-emerald-700 font-semibold mt-4 text-center bg-emerald-50 py-1 rounded border border-emerald-100">
            Current Best Feasible Answer Saved: <code className="font-mono">{ans}</code>
          </div>
        )}
      </div>
    );
  };

  // Render Simulator Breakdown based on Problem ID
  const renderPredicateDetails = () => {
    if (!predicateState) {
      return (
        <div className="text-slate-500 text-xs italic text-center py-6 bg-slate-50/50 rounded border border-dashed border-slate-200">
          No predicate validation state active. Click Simulate to start calculations.
        </div>
      );
    }

    const { isPossible, explanation, details } = predicateState;

    return (
      <div className="flex flex-col gap-3">
        {/* Feasibility Status Outcome Pill */}
        <div className={`flex items-center justify-between p-3.5 rounded border ${
          isPossible 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-800'
        }`}>
          <div className="flex items-center gap-2">
            {isPossible ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <div className="flex flex-col">
              <span className="text-xs font-bold font-sans uppercase tracking-wider">
                Predicate: {isPossible ? 'FEASIBLE (TRUE)' : 'INFEASIBLE (FALSE)'}
              </span>
              <span className="text-[11px] opacity-90 mt-0.5">{explanation}</span>
            </div>
          </div>

          <div className="text-right text-xs shrink-0">
            {isPossible ? (
              <span className="font-bold bg-emerald-500 text-white px-2.5 py-1 rounded text-[10px] tracking-wide uppercase">
                {problem.id === 'aggressive-cows' ? 'Go larger (low = mid + 1)' : 'Go smaller (high = mid - 1)'}
              </span>
            ) : (
              <span className="font-bold bg-rose-500 text-white px-2.5 py-1 rounded text-[10px] tracking-wide uppercase">
                {problem.id === 'aggressive-cows' ? 'Go smaller (high = mid - 1)' : 'Go larger (low = mid + 1)'}
              </span>
            )}
          </div>
        </div>

        {/* Detailed simulation cards */}
        {details && details.map((detail, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded p-3 text-xs">
            <span className="font-bold text-slate-700 block mb-1.5">{detail.label}</span>
            
            {typeof detail.value === 'string' || typeof detail.value === 'number' ? (
              <div className="font-mono text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 text-[11px]">
                {detail.value}
              </div>
            ) : null}

            {detail.subValues && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {detail.subValues.map((sub, sIdx) => (
                  <div key={sIdx} className="bg-slate-50 border border-slate-100 rounded p-1.5 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wide font-medium">{sub.label}</span>
                    <span className="text-xs font-mono font-bold text-slate-800 mt-0.5">{sub.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-[#FAF9F6] border border-slate-200 rounded-lg p-5 flex flex-col gap-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 text-[10px] text-slate-300 font-mono select-none">
        ANSWER SPACE CANVAS
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-slate-700 font-sans uppercase tracking-wider">
          Binary Search on Answer Simulation
        </h3>
        <p className="text-xs text-slate-500">
          The solution space is virtual. We binary search directly on the set of potential valid answers.
        </p>
      </div>

      {renderSpectrum()}

      <div className="flex flex-col gap-3">
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          Greedy Feasibility Check Simulation
        </h4>
        {renderPredicateDetails()}
      </div>
    </div>
  );
}
