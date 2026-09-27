import React, { useRef, useEffect } from 'react';
import { SimulationStep, ProblemDefinition } from '../types';
import { CheckCircle2, AlertCircle, Sparkles, ArrowDown, ArrowUp } from 'lucide-react';

interface SlidingWindowCanvasProps {
  problem: ProblemDefinition;
  rawElements: (string | number)[];
  step: SimulationStep | null;
}

export const SlidingWindowCanvas: React.FC<SlidingWindowCanvasProps> = ({
  problem,
  rawElements,
  step
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftIdx = step?.left ?? null;
  const rightIdx = step?.right ?? null;

  const windowActive = leftIdx !== null && rightIdx !== null && leftIdx <= rightIdx;
  const windowLength = windowActive ? rightIdx - leftIdx + 1 : 0;
  const isValid = step?.isValidWindow ?? true;
  const action = step?.action ?? 'init';

  // Determine bracket border color and style
  let bracketBorderColor = 'border-slate-300';
  let bracketBgColor = 'bg-slate-100/30';
  let statusBadge = { text: 'Scanning', color: 'bg-slate-100 text-slate-700 border-slate-200' };

  if (action === 'record') {
    bracketBorderColor = 'border-amber-500';
    bracketBgColor = 'bg-amber-50/40';
    statusBadge = { text: 'Optimal Window', color: 'bg-amber-100 text-amber-900 border-amber-300' };
  } else if (!isValid || action === 'shrink') {
    bracketBorderColor = 'border-rose-500';
    bracketBgColor = 'bg-rose-50/40';
    statusBadge = { text: 'Shrinking (Condition Exceeded)', color: 'bg-rose-100 text-rose-800 border-rose-300' };
  } else if (windowActive) {
    bracketBorderColor = 'border-emerald-500';
    bracketBgColor = 'bg-emerald-50/30';
    statusBadge = { text: 'Valid Window', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
  }

  // Auto-scroll to center window when right pointer moves
  useEffect(() => {
    if (rightIdx !== null && containerRef.current) {
      const el = containerRef.current.querySelector(`[data-index="${rightIdx}"]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [rightIdx]);

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 flex flex-col shadow-2xs">
      {/* Top Bar: Indicators & Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Array Ribbon
          </span>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusBadge.color}`}>
            {statusBadge.text}
          </span>
        </div>

        {/* Live Window State Metrics */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <div className="px-2.5 py-0.5 rounded-sm bg-slate-100 border border-slate-200 text-slate-700 flex items-center space-x-1">
            <span className="text-slate-500 font-sans font-medium text-[11px]">Length:</span>
            <span className="font-bold text-slate-900">{windowLength}</span>
          </div>

          {step?.currentMetricLabel && (
            <div className="px-2.5 py-0.5 rounded-sm bg-slate-100 border border-slate-200 text-slate-700 flex items-center space-x-1">
              <span className="text-slate-500 font-sans font-medium text-[11px]">
                {step.currentMetricLabel}:
              </span>
              <span className="font-bold text-slate-900">{step.currentMetricValue}</span>
            </div>
          )}

          {step?.bestResultLabel && (
            <div className="px-2.5 py-0.5 rounded-sm bg-amber-50 border border-amber-200 text-amber-900 flex items-center space-x-1">
              <span className="text-amber-700 font-sans font-medium text-[11px]">
                {step.bestResultLabel}:
              </span>
              <span className="font-bold text-amber-950">{step.bestResultValue}</span>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Indexed Element Ribbon Canvas */}
      <div 
        ref={containerRef}
        className="overflow-x-auto py-6 px-4 bg-[#FAF9F6] border border-slate-200 rounded-md select-none relative"
      >
        <div className="inline-flex items-start justify-center min-w-full space-x-2 pt-8 pb-10 relative">
          {rawElements.map((val, idx) => {
            const inWindow = windowActive && idx >= (leftIdx ?? 0) && idx <= (rightIdx ?? 0);
            const isLeft = leftIdx === idx;
            const isRight = rightIdx === idx;
            const isOptimalRange = step?.bestWindowRange && idx >= step.bestWindowRange[0] && idx <= step.bestWindowRange[1];

            return (
              <div 
                key={idx}
                data-index={idx}
                className="flex flex-col items-center relative w-12 shrink-0 group transition-all"
              >
                {/* L Pointer Badge (Above or on top) */}
                {isLeft && (
                  <div className="absolute -top-7 flex flex-col items-center z-10 animate-fade-in">
                    <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-indigo-600 text-white shadow-xs tracking-wider">
                      L
                    </span>
                    <ArrowDown className="w-3.5 h-3.5 text-indigo-600 -mt-1" />
                  </div>
                )}

                {/* Index label */}
                <span className="text-[10px] font-mono text-slate-600 font-medium mb-1">
                  [{idx}]
                </span>

                {/* Element Cell Box */}
                <div
                  className={`w-12 h-12 rounded-md flex items-center justify-center font-mono text-sm font-semibold border-2 transition-all shadow-2xs ${
                    inWindow
                      ? action === 'record'
                        ? 'border-amber-500 bg-amber-100/70 text-amber-950 scale-105 shadow-xs'
                        : isValid
                        ? 'border-emerald-500 bg-emerald-100/60 text-emerald-950'
                        : 'border-rose-500 bg-rose-100/60 text-rose-950'
                      : isOptimalRange && action === 'done'
                      ? 'border-amber-400 bg-amber-50 text-amber-900 ring-2 ring-amber-300'
                      : 'border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  {val}
                </div>

                {/* R Pointer Badge (Below) */}
                {isRight && (
                  <div className="absolute -bottom-7 flex flex-col items-center z-10 animate-fade-in">
                    <ArrowUp className="w-3.5 h-3.5 text-amber-600 -mb-1" />
                    <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-amber-600 text-white shadow-xs tracking-wider">
                      R
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dynamic Window Elastic Range Bar Note */}
        {windowActive && (
          <div className="mt-2 text-center">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border bg-white border-slate-200 text-slate-700 shadow-2xs">
              <span className="text-indigo-600 font-bold">L = {leftIdx}</span>
              <span className="text-slate-300">•</span>
              <span className="text-amber-600 font-bold">R = {rightIdx}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600">Subarray: [{rawElements.slice(leftIdx, rightIdx + 1).join(', ')}]</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
