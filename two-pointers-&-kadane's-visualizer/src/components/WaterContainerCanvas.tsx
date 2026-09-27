import React from 'react';
import { Waves, Maximize2 } from 'lucide-react';
import { SimulationStep } from '../types';

interface WaterContainerCanvasProps {
  step: SimulationStep;
  problemId: string;
}

export default function WaterContainerCanvas({ step, problemId }: WaterContainerCanvasProps) {
  const { array, left, right, waterLevels, currentArea, maxArea, leftMax, rightMax } = step;

  // Cast array elements to numbers for height
  const heights = array.map(v => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  });

  const maxHeight = Math.max(...heights, 1);

  // Helper to calculate percentage height for scaling
  const getPercentHeight = (h: number) => {
    return `${(h / maxHeight) * 80 + 10}%`; // leave margin
  };

  const isContainerProblem = problemId === 'container-with-most-water';
  const isTrappingProblem = problemId === 'trapping-rain-water';

  if (!isContainerProblem && !isTrappingProblem) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4 relative overflow-hidden h-[240px]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-xs font-sans font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Waves className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
          {isContainerProblem ? 'Container Water Area Visualizer' : 'Trapping Rain Water Elevation Map'}
        </h3>
        {isContainerProblem && currentArea !== undefined && (
          <div className="flex gap-3 text-[11px] font-mono font-bold">
            <span className="text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded">
              Current Area: {currentArea}
            </span>
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded">
              Max Area: {maxArea ?? 0}
            </span>
          </div>
        )}
        {isTrappingProblem && (
          <div className="flex gap-2 text-[10px] font-mono font-semibold text-slate-500">
            <span className="bg-slate-100 px-2 py-0.5 rounded">Left Max: {leftMax ?? 0}</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded">Right Max: {rightMax ?? 0}</span>
          </div>
        )}
      </div>

      <div className="flex-1 relative flex items-end justify-center gap-3 w-full h-[150px] border-b border-slate-200 pb-1 px-4">
        {/* Render container-with-most-water specific visual layer (blue box spanning left and right) */}
        {isContainerProblem && left !== undefined && right !== undefined && (
          <div
            className="absolute bottom-1 bg-blue-100/60 border-t-2 border-dashed border-blue-400 flex items-center justify-center transition-all duration-300"
            style={{
              left: `calc(10% + (${left} * 80% / ${heights.length - 1}))`,
              right: `calc(10% + (${heights.length - 1 - right} * 80% / ${heights.length - 1}))`,
              height: `${(Math.min(heights[left], heights[right]) / maxHeight) * 80}%`,
              borderRadius: '2px',
            }}
          >
            <div className="text-[10px] text-blue-800 font-sans font-bold flex flex-col items-center gap-0.5 bg-white/95 px-2 py-1 rounded shadow-xs border border-blue-200">
              <span className="flex items-center gap-1">
                <Maximize2 className="w-3 h-3 text-blue-500" />
                Area: {currentArea}
              </span>
              <span className="text-[8px] text-blue-500/80">
                Width {right - left} × Height {Math.min(heights[left], heights[right])}
              </span>
            </div>
          </div>
        )}

        {/* Render individual elevation bars */}
        {heights.map((h, idx) => {
          const isLeftBoundary = idx === left;
          const isRightBoundary = idx === right;

          let barBg = 'bg-slate-300';
          let borderClass = 'border-slate-400';

          if (isContainerProblem) {
            if (isLeftBoundary) {
              barBg = 'bg-indigo-600';
              borderClass = 'border-indigo-700 ring-2 ring-indigo-200';
            } else if (isRightBoundary) {
              barBg = 'bg-amber-500';
              borderClass = 'border-amber-600 ring-2 ring-amber-200';
            }
          } else if (isTrappingProblem) {
            if (isLeftBoundary) {
              barBg = 'bg-indigo-600';
              borderClass = 'border-indigo-700';
            } else if (isRightBoundary) {
              barBg = 'bg-amber-500';
              borderClass = 'border-amber-600';
            } else {
              barBg = 'bg-slate-400';
              borderClass = 'border-slate-500';
            }
          }

          const hasTrappedWater = isTrappingProblem && waterLevels && waterLevels[idx] > 0;
          const waterHeight = hasTrappedWater ? waterLevels[idx] : 0;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center relative h-full justify-end group cursor-pointer"
            >
              {/* Tooltip for hover */}
              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-slate-800 text-white text-[10px] font-mono px-2 py-1 rounded shadow-md pointer-events-none transition-opacity flex flex-col items-center z-50">
                <span>Idx: {idx}</span>
                <span>Height: {h}</span>
                {waterHeight > 0 && <span className="text-blue-300 font-bold">Water: +{waterHeight}</span>}
              </div>

              {/* Water Column Layer for Trapping Water Problem */}
              {isTrappingProblem && waterHeight > 0 && (
                <div
                  className="w-full bg-blue-500/80 border-t-2 border-l border-r border-blue-400 rounded-t-xs transition-all duration-300 relative"
                  style={{
                    height: `${(waterHeight / maxHeight) * 80}%`,
                    bottom: `${(h / maxHeight) * 80}%`,
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-mono font-bold text-white shadow-sm">
                      ~
                    </span>
                  </div>
                </div>
              )}

              {/* Actual Ground/Elevation Bar */}
              <div
                className={`w-full ${barBg} border-t-4 ${borderClass} rounded-t-sm flex items-center justify-center transition-all duration-300`}
                style={{
                  height: getPercentHeight(h),
                }}
              >
                <span className={`text-[10px] font-mono font-bold ${h > 1 ? 'text-slate-800' : 'text-slate-500'} select-none mt-1`}>
                  {h}
                </span>
              </div>

              {/* Index number below the bar */}
              <span className="text-[9px] font-mono font-bold text-slate-400 mt-1">
                {idx}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
