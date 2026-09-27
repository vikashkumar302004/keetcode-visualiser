/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Scale, RefreshCw, Hash, ArrowRight, Grid, Layers, HelpCircle } from 'lucide-react';
import { SimulationStep, AlgorithmId } from '../types';

interface AuxiliaryVisualizersProps {
  algorithmId: AlgorithmId;
  step: SimulationStep;
}

export default function AuxiliaryVisualizers({ algorithmId, step }: AuxiliaryVisualizersProps) {
  const custom = step.customState || {};

  switch (algorithmId) {
    case 'boyer-moore': {
      const candidate = custom.candidate;
      const count = custom.count ?? 0;
      return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-serif">
              <Scale className="w-4 h-4 text-amber-600" />
              Boyer-Moore Invariant Meter (Majority: &gt; n/2)
            </span>
            <span className="text-[10px] font-mono font-semibold text-slate-400">
              TIME: O(N) · SPACE: O(1)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Candidate Card */}
            <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col items-center justify-center relative shadow-sm overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-amber-400" />
              <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Active Candidate</span>
              <span className="text-2xl font-black text-amber-900 font-mono mt-1">
                {candidate !== null ? candidate : 'Ø'}
              </span>
            </div>

            {/* Voting Score / Cancellation Gauge */}
            <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col justify-center shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Vote Balance</span>
                <span className="text-xs font-bold font-mono text-slate-700">{count}</span>
              </div>
              {/* Dynamic Bar Indicator */}
              <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden border border-slate-200">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (count / 6) * 100)}%` }}
                />
              </div>
              <span className="text-[9px] font-mono text-slate-400 mt-1.5 block text-right">
                {count > 0 ? 'Positive consensus holding' : 'Unassigned/Neutral'}
              </span>
            </div>
          </div>
        </div>
      );
    }

    case 'boyer-moore-ii': {
      const cand1 = custom.candidate;
      const count1 = custom.count ?? 0;
      const cand2 = custom.candidate2;
      const count2 = custom.count2 ?? 0;
      return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-serif">
              <Scale className="w-4 h-4 text-amber-600" />
              Boyer-Moore II Dual-Meter (Majority: &gt; n/3)
            </span>
            <span className="text-[10px] font-mono font-semibold text-slate-400">
              MAX 2 MAJ ELEMS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Candidate 1 */}
            <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Candidate A: {cand1 ?? 'Ø'}</span>
                <span className="text-xs font-bold font-mono text-slate-700">{count1}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                <div
                  className="bg-amber-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (count1 / 4) * 100)}%` }}
                />
              </div>
            </div>

            {/* Candidate 2 */}
            <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-col shadow-sm">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-mono text-slate-400 font-semibold uppercase">Candidate B: {cand2 ?? 'Ø'}</span>
                <span className="text-xs font-bold font-mono text-slate-700">{count2}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                <div
                  className="bg-indigo-500 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (count2 / 4) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'merge-sorted': {
      const nums2 = step.secondaryArray as number[];
      if (!nums2) return null;

      const p2Active = step.pointers.p2;

      return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-serif">
              <Layers className="w-4 h-4 text-amber-600" />
              Auxiliary Array Ribbon (nums2)
            </span>
            <span className="text-[10px] font-mono font-semibold text-slate-400">
              MERGING FROM THE REAR
            </span>
          </div>

          <div className="flex items-center gap-2">
            {nums2.map((val, idx) => {
              const isP2 = idx === p2Active;
              return (
                <div
                  key={idx}
                  className={`relative w-12 h-12 flex flex-col items-center justify-center rounded-lg border text-sm font-mono font-bold transition-all ${
                    isP2
                      ? 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-400/30'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="absolute -top-3.5 text-[9px] font-semibold text-slate-400">
                    [{idx}]
                  </span>
                  <span>{val}</span>
                  {isP2 && (
                    <span className="absolute -bottom-4 text-[9px] font-bold text-rose-600 font-mono">
                      p2
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case 'wiggle-sort': {
      return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-2 animate-fadeIn">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-serif border-b border-slate-200 pb-2 mb-1">
            Wiggle Alternating Wave Relationship
          </span>
          <div className="flex justify-between items-center px-4 py-2 font-mono text-[11px] text-slate-600">
            {step.array.map((_, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <span className={`font-extrabold text-xs ${isEven ? 'text-indigo-600' : 'text-amber-600'}`}>
                    {isEven ? 'Valley (≤)' : 'Peak (≥)'}
                  </span>
                  <span className="text-[10px] text-slate-400">idx {idx}</span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    case 'plus-one': {
      const carry = custom.carry ?? 0;
      return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between animate-fadeIn text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5 font-serif">
            <Layers className="w-4 h-4 text-amber-600" />
            Carry Digit State
          </span>
          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-400">Active Carry Register:</span>
            <span
              className={`px-2 py-0.5 rounded font-bold ${
                carry > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-600'
              }`}
            >
              +{carry}
            </span>
          </div>
        </div>
      );
    }

    case 'missing-number': {
      const exp = custom.expectedSum ?? 0;
      const act = custom.actualSum ?? 0;
      const missing = exp - act;

      return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 animate-fadeIn text-xs">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="font-bold text-slate-700 flex items-center gap-1.5 font-serif">
              <Hash className="w-4 h-4 text-amber-600" />
              Expected Gauss Sum vs Actual Sum Cancellation
            </span>
            <span className="text-[10px] font-mono font-semibold text-slate-400">
              FORMULA: n*(n+1)/2
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm">
              <span className="text-[10px] font-mono text-slate-400 block mb-0.5">Gauss Sum</span>
              <span className="font-bold font-mono text-indigo-700 text-sm">{exp}</span>
            </div>
            <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-sm">
              <span className="text-[10px] font-mono text-slate-400 block mb-0.5">Actual Sum</span>
              <span className="font-bold font-mono text-slate-700 text-sm">{act}</span>
            </div>
            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg shadow-sm">
              <span className="text-[10px] font-mono text-amber-800 block mb-0.5">Missing Diff</span>
              <span className="font-black font-mono text-amber-950 text-sm">{missing}</span>
            </div>
          </div>
        </div>
      );
    }

    case 'set-matrix-zeroes': {
      const rawMatrix = step.array;
      const gridCells = [
        rawMatrix.slice(0, 3),
        rawMatrix.slice(3, 6),
        rawMatrix.slice(6, 9),
      ];

      return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-serif">
              <Grid className="w-4 h-4 text-amber-600" />
              In-Place Flag Matrix View (3x3)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">ROW 0 & COL 0 FLAG STORAGE</span>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-1.5 p-2 bg-white border border-slate-200 rounded-xl shadow-sm">
              {gridCells.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  const isFlag = rIdx === 0 || cIdx === 0;
                  const isZero = val === 0;
                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`w-10 h-10 flex flex-col items-center justify-center font-mono text-xs rounded-lg border font-bold transition-all duration-300 ${
                        isZero
                          ? 'bg-rose-50 border-rose-300 text-rose-800 ring-1 ring-rose-200'
                          : isFlag
                          ? 'bg-amber-50/50 border-amber-200 text-amber-900'
                          : 'bg-slate-50 border-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="text-[9px] text-slate-400 leading-none">
                        ({rIdx},{cIdx})
                      </span>
                      <span className="text-sm mt-0.5">{val}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      );
    }

    case 'rotate-image': {
      const rawMatrix = step.array;
      const gridCells = [
        rawMatrix.slice(0, 3),
        rawMatrix.slice(3, 6),
        rawMatrix.slice(6, 9),
      ];

      return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-serif">
              <Grid className="w-4 h-4 text-amber-600" />
              In-Place 2D Matrix Rotate View (3x3)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">STEP-BY-STEP TRANSLATION</span>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-1.5 p-2 bg-white border border-slate-200 rounded-xl shadow-sm">
              {gridCells.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  const flatIdx = rIdx * 3 + cIdx;
                  // highlight cells if actively swapping/comparing
                  const isHighlighted = step.highlights?.[flatIdx] !== undefined;
                  const highlightStyle = step.highlights?.[flatIdx] === 'scanning'
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-950 ring-1 ring-indigo-400'
                    : step.highlights?.[flatIdx] === 'target'
                    ? 'bg-amber-50 border-amber-400 text-amber-950 ring-1 ring-amber-400'
                    : 'bg-slate-50 border-slate-250 text-slate-700';

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`w-10 h-10 flex flex-col items-center justify-center font-mono text-xs rounded-lg border font-bold transition-all duration-300 ${highlightStyle}`}
                    >
                      <span className="text-[9px] text-slate-400 leading-none">
                        ({rIdx},{cIdx})
                      </span>
                      <span className="text-sm mt-0.5">{val}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      );
    }

    case 'spiral-matrix': {
      const rawMatrix = step.array;
      const gridCells = [
        rawMatrix.slice(0, 3),
        rawMatrix.slice(3, 6),
        rawMatrix.slice(6, 9),
      ];

      return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-serif">
              <Grid className="w-4 h-4 text-amber-600" />
              2D Spiral Path Highlights (3x3)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">BOUNDARY CONTRACT CONTRACTING</span>
          </div>

          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-1.5 p-2 bg-white border border-slate-200 rounded-xl shadow-sm">
              {gridCells.map((row, rIdx) =>
                row.map((val, cIdx) => {
                  const flatIdx = rIdx * 3 + cIdx;
                  const hlType = step.highlights?.[flatIdx];
                  const highlightStyle = hlType === 'scanning'
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-950 ring-2 ring-indigo-500/20'
                    : hlType === 'sorted'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-extrabold'
                    : 'bg-slate-50 border-slate-200 text-slate-600';

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`w-10 h-10 flex flex-col items-center justify-center font-mono text-xs rounded-lg border font-bold transition-all duration-300 ${highlightStyle}`}
                    >
                      <span className="text-[9px] text-slate-400 leading-none">
                        ({rIdx},{cIdx})
                      </span>
                      <span className="text-sm mt-0.5">{val}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      );
    }

    case 'pascals-triangle': {
      const triangle = step.secondaryArray as number[][] | null;
      if (!triangle) return null;

      return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 font-serif">
              <Layers className="w-4 h-4 text-amber-600" />
              Pascal Triangle Builder
            </span>
            <span className="text-[10px] text-slate-400 font-mono">ADJACENT ADDITION</span>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            {triangle.slice(-4).map((row, rIdx) => (
              <div key={rIdx} className="flex gap-1 justify-center">
                {row.map((val, cIdx) => (
                  <div
                    key={cIdx}
                    className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center text-xs font-mono font-bold text-slate-700 shadow-sm"
                  >
                    {val}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}
