/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SimulationStep } from '../types';

interface ArrayCanvasProps {
  step: SimulationStep;
}

export default function ArrayCanvas({ step }: ArrayCanvasProps) {
  const { array, pointers, swaps = [], comparisons = [], highlights = {} } = step;

  // Box measurements for consistent SVG swap arcs
  const boxWidth = 52;
  const gap = 12;
  const centerOffset = boxWidth / 2;
  const stepWidth = boxWidth + gap;

  // Helper to get element color states based on simulation parameters
  const getBoxStyle = (idx: number) => {
    // Check custom highlights
    if (highlights[idx]) {
      switch (highlights[idx]) {
        case 'scanning':
          return 'bg-indigo-50 border-indigo-400 text-indigo-900 ring-2 ring-indigo-500/20';
        case 'target':
          return 'bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-500/30';
        case 'pivot':
          return 'bg-amber-200 border-amber-600 text-amber-950 font-bold';
        case 'sorted':
          return 'bg-emerald-50 border-emerald-400 text-emerald-900';
        case 'successor':
          return 'bg-rose-50 border-rose-400 text-rose-900';
        default:
          break;
      }
    }

    // Check comparisons
    const isComparing = comparisons.some(([a, b]) => a === idx || b === idx);
    if (isComparing) {
      return 'border-rose-400 bg-rose-50 text-rose-900 ring-2 ring-rose-400/20 animate-pulse';
    }

    // Check swaps
    const isSwapping = swaps.some(([a, b]) => a === idx || b === idx);
    if (isSwapping) {
      return 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/40 scale-105';
    }

    // Default
    return 'bg-white border-slate-200 text-slate-800 hover:border-slate-300';
  };

  // Retrieve active pointers targeting this index
  const getActivePointers = (idx: number) => {
    const active: string[] = [];
    Object.entries(pointers).forEach(([name, val]) => {
      if (val === idx) {
        active.push(name);
      }
    });
    return active;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 relative flex flex-col justify-center min-h-[170px] overflow-hidden">
      {/* Scrollable Array Element Containers */}
      <div className="relative overflow-x-auto pb-6 pt-10 px-4 scrollbar-thin">
        {/* SVG Arcs Container - absolutely positioned inside scroll flow */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ width: `${array.length * stepWidth}px`, height: '100%' }}
        >
          <svg className="w-full h-full overflow-visible">
            {/* Draw swap curves */}
            {swaps.map(([a, b], idx) => {
              if (a === b) return null;
              const x1 = a * stepWidth + centerOffset + 16; // Adjust for outer container padding offset
              const x2 = b * stepWidth + centerOffset + 16;
              const h = Math.min(45, Math.abs(a - b) * 12 + 20); // Arc height based on span distance
              return (
                <path
                  key={`swap-${idx}`}
                  d={`M ${x1} 40 Q ${(x1 + x2) / 2} ${40 - h} ${x2} 40`}
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeDasharray="4,4"
                  className="animate-dash"
                />
              );
            })}

            {/* Draw comparison straight links */}
            {comparisons.map(([a, b], idx) => {
              if (a === b) return null;
              const x1 = a * stepWidth + centerOffset + 16;
              const x2 = b * stepWidth + centerOffset + 16;
              return (
                <line
                  key={`comp-${idx}`}
                  x1={x1}
                  y1={40}
                  x2={x2}
                  y2={40}
                  stroke="#f43f5e"
                  strokeWidth="2"
                  className="animate-pulse"
                />
              );
            })}
          </svg>
        </div>

        {/* Array Cells Flex Row */}
        <div className="flex gap-3 relative z-20" style={{ width: 'max-content' }}>
          {array.map((val, idx) => {
            const currentPointers = getActivePointers(idx);
            const isTargeted = currentPointers.length > 0;

            return (
              <div key={idx} className="flex flex-col items-center select-none w-[52px]">
                {/* 0-Based Index above the card */}
                <span className="text-[10px] font-semibold text-slate-400 font-mono mb-2">
                  idx {idx}
                </span>

                {/* Main Value Box */}
                <div
                  className={`w-[52px] h-[52px] flex items-center justify-center rounded-xl border text-base font-mono font-bold transition-all duration-300 relative shadow-sm ${getBoxStyle(
                    idx
                  )}`}
                >
                  {val}

                  {/* Tiny indicator icon or dot */}
                  {highlights[idx] === 'pivot' && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white" />
                  )}
                  {highlights[idx] === 'sorted' && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
                  )}
                </div>

                {/* Pointer Arrow and Labels Below */}
                <div className="h-10 mt-2.5 flex flex-col items-center">
                  {isTargeted && (
                    <>
                      {/* Downward point marker */}
                      <span className="text-indigo-600 text-xs font-mono select-none leading-none">▲</span>
                      
                      {/* Active pointers container */}
                      <div className="flex flex-col gap-0.5 mt-0.5">
                        {currentPointers.map((ptrName) => (
                          <span
                            key={ptrName}
                            className="bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs font-mono tracking-tight"
                          >
                            {ptrName}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
