import React from 'react';
import { Layers, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { SimulationStep } from '../types';

interface KadaneCanvasProps {
  step: SimulationStep;
  allSteps: SimulationStep[];
  currentStepIndex: number;
  problemId: string;
}

export default function KadaneCanvas({
  step,
  allSteps,
  currentStepIndex,
  problemId,
}: KadaneCanvasProps) {
  const { array, activeRange, bestRange, currentSum, maxSum, currentMin, minSum, totalSum, maxAbsSum } = step;

  // Cast elements to numbers
  const nums = array.map(v => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  });

  const isKadane = [
    'maximum-subarray',
    'maximum-sum-circular-subarray',
    'maximum-product-subarray',
    'best-time-to-buy-and-sell-stock',
    'maximum-absolute-sum-of-any-subarray'
  ].includes(problemId);

  if (!isKadane) return null;

  // Gather historical sums up to current step
  const historicalSteps = allSteps.slice(0, currentStepIndex + 1);
  const sumsHistory = historicalSteps.map(s => s.currentSum ?? 0);
  const maxSumsHistory = historicalSteps.map(s => s.maxSum ?? 0);

  // Generate SVG Sparkline coordinates
  const renderSparkline = () => {
    if (sumsHistory.length === 0) return null;

    const width = 450;
    const height = 65;
    const padding = 6;

    // Find min and max for scaling
    const allVals = [...sumsHistory, ...maxSumsHistory, 0];
    const maxVal = Math.max(...allVals, 1);
    const minVal = Math.min(...allVals, -1);
    const valRange = maxVal - minVal;

    const getX = (index: number) => {
      if (sumsHistory.length <= 1) return padding;
      return padding + (index * (width - padding * 2)) / (sumsHistory.length - 1);
    };

    const getY = (val: number) => {
      return height - padding - ((val - minVal) * (height - padding * 2)) / valRange;
    };

    // Build path strings
    let currentPath = '';
    let maxPath = '';

    sumsHistory.forEach((v, idx) => {
      const x = getX(idx);
      const y = getY(v);
      if (idx === 0) currentPath = `M ${x} ${y}`;
      else currentPath += ` L ${x} ${y}`;
    });

    maxSumsHistory.forEach((v, idx) => {
      const x = getX(idx);
      const y = getY(v);
      if (idx === 0) maxPath = `M ${x} ${y}`;
      else maxPath += ` L ${x} ${y}`;
    });

    const zeroY = getY(0);

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        {/* Zero Axis Reference Line */}
        {minVal < 0 && maxVal > 0 && (
          <line
            x1={0}
            y1={zeroY}
            x2={width}
            y2={zeroY}
            className="stroke-slate-200 stroke-1 stroke-dasharray-[2]"
            strokeDasharray="2,2"
          />
        )}

        {/* Current Sum Line */}
        <path
          d={currentPath}
          fill="none"
          className="stroke-amber-400 stroke-2"
        />

        {/* Max Sum Line */}
        <path
          d={maxPath}
          fill="none"
          className="stroke-emerald-500 stroke-2.5"
        />

        {/* Sparkline Dots at current position */}
        {sumsHistory.length > 0 && (
          <>
            <circle
              cx={getX(sumsHistory.length - 1)}
              cy={getY(sumsHistory[sumsHistory.length - 1])}
              r="4"
              className="fill-amber-500 stroke-white stroke-2"
            />
            <circle
              cx={getX(maxSumsHistory.length - 1)}
              cy={getY(maxSumsHistory[maxSumsHistory.length - 1])}
              r="4"
              className="fill-emerald-600 stroke-white stroke-2"
            />
          </>
        )}
      </svg>
    );
  };

  // Check if an index falls inside current subarray active range
  const isInsideActive = (idx: number) => {
    if (!activeRange) return false;
    const [start, end] = activeRange;
    return idx >= start && idx <= end;
  };

  // Check if an index falls inside global best range
  const isInsideBest = (idx: number) => {
    if (!bestRange) return false;
    const [start, end] = bestRange;
    return idx >= start && idx <= end;
  };

  const isResetState = currentSum !== undefined && currentSum < 0;

  return (
    <div className="bg-[#FAF9F6] border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-5 h-[240px]">
      {/* Header section with metrics */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-xs font-sans font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-amber-500" />
          Subarray Sum Engine & Kadane Tracker
        </h3>

        <div className="flex gap-2 text-[10px] font-mono font-bold">
          {currentSum !== undefined && (
            <span className={`px-2 py-0.5 rounded border ${isResetState ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
              Current Sum: {currentSum}
            </span>
          )}
          {maxSum !== undefined && (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded">
              Max Sum: {maxSum}
            </span>
          )}
          {maxAbsSum !== undefined && (
            <span className="bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 rounded">
              Max Abs Sum: {maxAbsSum}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 items-stretch">
        {/* Left Section: Slots Visualization */}
        <div className="md:col-span-8 flex flex-col justify-center relative select-none">
          {/* Emerald bracket outline container */}
          {bestRange && (
            <div
              className="absolute -top-3.5 -bottom-3.5 border-2 border-emerald-500 rounded-lg pointer-events-none z-10 transition-all duration-300"
              style={{
                left: `calc(${bestRange[0]} * 100% / ${nums.length} - 2px)`,
                width: `calc((${bestRange[1]} - ${bestRange[0]} + 1) * 100% / ${nums.length} + 4px)`,
              }}
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-sans text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap shadow-xs">
                Max Window Ever: {maxSum}
              </div>
            </div>
          )}

          {/* Slots Array row */}
          <div className="flex gap-1.5 justify-between w-full h-[55px] relative">
            {nums.map((v, idx) => {
              const inActive = isInsideActive(idx);
              const inBest = isInsideBest(idx);

              let slotClass = 'bg-white border-slate-200 text-slate-700';
              if (inActive) {
                slotClass = 'bg-amber-500/10 border-amber-400 text-amber-900 font-bold';
              }
              if (isResetState && step.i === idx) {
                slotClass = 'bg-rose-50 border-rose-400 text-rose-800 font-bold animate-pulse';
              }

              return (
                <div
                  key={idx}
                  className={`flex-1 flex flex-col items-center justify-center border-2 rounded-lg ${slotClass} transition-all duration-200 relative`}
                >
                  <span className="text-xs font-sans font-bold">{v}</span>
                  <span className="text-[8px] font-sans font-bold text-slate-400 absolute bottom-0.5">
                    {idx}
                  </span>

                  {/* Tiny status badges inside slot */}
                  {isResetState && step.i === idx && (
                    <div className="absolute -bottom-4 bg-red-100 text-red-800 font-sans font-bold text-[7px] px-1 rounded shadow-2xs whitespace-nowrap flex items-center gap-0.5">
                      <AlertTriangle className="w-2 h-2 text-red-600" />
                      Reset (Sum &lt; 0)
                    </div>
                  )}
                  {inActive && !isResetState && (
                    <span className="absolute -bottom-3 bg-amber-400 text-amber-950 font-sans text-[7px] font-extrabold px-1.5 rounded shadow-3xs uppercase tracking-wider">
                      Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section: Balance Sparkline */}
        <div className="md:col-span-4 border border-slate-200 bg-white rounded-lg p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              Running Sum Sparkline
            </span>
            <div className="flex gap-1.5 text-[8px] font-sans font-semibold text-slate-400">
              <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>Sum</span>
              <span className="flex items-center gap-0.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>Max</span>
            </div>
          </div>

          <div className="h-[65px] mt-1 relative flex items-center justify-center">
            {renderSparkline()}
          </div>
        </div>
      </div>
    </div>
  );
}
