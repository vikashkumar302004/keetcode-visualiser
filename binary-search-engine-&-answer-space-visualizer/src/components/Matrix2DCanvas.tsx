/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowDown, Check, HelpCircle, Delete } from 'lucide-react';
import { Problem, SimulationStep } from '../types';

interface Matrix2DCanvasProps {
  problem: Problem;
  matrix: number[][];
  step: SimulationStep;
  target: number;
}

export default function Matrix2DCanvas({
  problem,
  matrix,
  step,
  target
}: Matrix2DCanvasProps) {
  const { mid, row, col, eliminatedRows = [], eliminatedCols = [], foundIndex } = step;

  const rows = matrix.length;
  const cols = matrix[0].length;

  const is74 = problem.id === 'search-2d-matrix-1';

  // Check if a specific cell is the active mid or current search point
  const isActiveCell = (rIdx: number, cIdx: number) => {
    if (is74 && mid !== null) {
      const computedR = Math.floor(mid / cols);
      const computedC = mid % cols;
      return rIdx === computedR && cIdx === computedC;
    }
    return rIdx === row && cIdx === col;
  };

  // Check if cell matches target
  const isTargetMatch = (rIdx: number, cIdx: number) => {
    if (foundIndex && Array.isArray(foundIndex)) {
      return rIdx === foundIndex[0] && cIdx === foundIndex[1];
    }
    return matrix[rIdx][cIdx] === target && isActiveCell(rIdx, cIdx);
  };

  // Check if row or column is eliminated
  const isRowEliminated = (rIdx: number) => eliminatedRows.includes(rIdx);
  const isColEliminated = (cIdx: number) => eliminatedCols.includes(cIdx);

  return (
    <div className="bg-[#FAF9F6] border border-slate-200 rounded-lg p-5 flex flex-col gap-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-3 text-[10px] text-slate-300 font-mono select-none">
        2D SPACE CANVAS
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-semibold text-slate-700 font-sans uppercase tracking-wider">
          2D Matrix Search Grid
        </h3>
        <p className="text-xs text-slate-500">
          {is74
            ? 'Fully sorted matrix behaves as a virtual 1D array. Binary search maps mid index to row & column.'
            : 'Staircase search starting top-right. We eliminate one entire row or column at each step.'}
        </p>
      </div>

      {/* Coordinate mapping box */}
      {is74 && mid !== null && (
        <div className="bg-slate-100 border border-slate-200 rounded p-2.5 font-mono text-[11px] text-slate-700 flex justify-between">
          <span>Virtual 1D mid: <code className="font-bold text-amber-800">{mid}</code></span>
          <span>Row: <code className="font-bold text-indigo-700">{Math.floor(mid / cols)}</code> ({mid} / {cols})</span>
          <span>Col: <code className="font-bold text-amber-700">{mid % cols}</code> ({mid} % {cols})</span>
        </div>
      )}

      {!is74 && row !== null && col !== null && row !== undefined && col !== undefined && (
        <div className="bg-slate-100 border border-slate-200 rounded p-2.5 font-mono text-[11px] text-slate-700 flex justify-between">
          <span>Current Location: <code className="font-bold text-indigo-700">[{row}, {col}]</code></span>
          <span>Value: <code className="font-bold text-amber-800">{matrix[row]?.[col] ?? 'N/A'}</code></span>
          <span>Target: <code className="font-bold text-slate-800">{target}</code></span>
        </div>
      )}

      {/* Grid Canvas */}
      <div className="flex flex-col items-center justify-center py-4 overflow-auto">
        <div className="relative border border-slate-300 bg-white p-4 rounded-lg shadow-sm flex flex-col gap-1.5 min-w-[280px]">
          {/* Column Indices above grid */}
          <div className="flex gap-2 pl-8">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div key={cIdx} className="w-12 text-center text-[10px] font-mono text-slate-400">
                col {cIdx}
              </div>
            ))}
          </div>

          {matrix.map((rowArr, rIdx) => {
            const rowEliminated = isRowEliminated(rIdx);

            return (
              <div key={rIdx} className="flex items-center gap-2 relative">
                {/* Row Index Label */}
                <div className="w-6 text-[10px] font-mono text-slate-400 text-right mr-1">
                  row {rIdx}
                </div>

                <div className="flex gap-2">
                  {rowArr.map((value, cIdx) => {
                    const colEliminated = isColEliminated(cIdx);
                    const cellEliminated = rowEliminated || colEliminated;
                    const active = isActiveCell(rIdx, cIdx);
                    const match = isTargetMatch(rIdx, cIdx);

                    let cellStyle = 'bg-white text-slate-800 border-slate-200';
                    if (match) {
                      cellStyle = 'bg-emerald-500 text-white border-emerald-600 scale-105 font-bold shadow ring-2 ring-emerald-300/35';
                    } else if (active) {
                      cellStyle = 'bg-amber-400 text-amber-950 border-amber-500 scale-105 font-bold ring-2 ring-amber-400/25';
                    } else if (cellEliminated) {
                      cellStyle = 'bg-slate-100 text-slate-300 border-slate-100 opacity-40 line-through';
                    }

                    return (
                      <div
                        key={cIdx}
                        className={`w-12 h-12 rounded border flex items-center justify-center text-sm font-mono transition-all duration-300 relative ${cellStyle}`}
                        title={`Row ${rIdx}, Col ${cIdx} = ${value}`}
                      >
                        {value}

                        {/* Tiny crosshair marker if active */}
                        {active && !match && (
                          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white shadow-sm" />
                        )}
                        {match && (
                          <Check className="w-3.5 h-3.5 text-white absolute bottom-0.5 right-0.5" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Left-right elimination lines */}
                {rowEliminated && (
                  <div className="absolute left-8 right-0 h-0.5 bg-red-400/20 pointer-events-none" />
                )}
              </div>
            );
          })}

          {/* Top-down elimination lines */}
          {eliminatedCols.map((cIdx) => (
            <div
              key={cIdx}
              className="absolute w-0.5 bg-red-400/20 top-4 bottom-4 pointer-events-none"
              style={{
                left: `${32 + cIdx * 56 + 24}px` // Precise alignment offset math
              }}
            />
          ))}
        </div>
      </div>

      {/* Grid Legend */}
      <div className="flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs text-slate-500 font-sans">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-400 inline-block" />
            <span>Active Pointer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
            <span>Target Found</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200 inline-block opacity-40 line-through" />
            <span>Eliminated Space</span>
          </div>
        </div>
      </div>
    </div>
  );
}
