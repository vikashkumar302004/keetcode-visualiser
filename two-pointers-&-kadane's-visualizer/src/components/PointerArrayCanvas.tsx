import React, { useRef, useEffect, useState } from 'react';
import { ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { SimulationStep } from '../types';

interface PointerArrayCanvasProps {
  step: SimulationStep;
  problemId: string;
}

export default function PointerArrayCanvas({ step, problemId }: PointerArrayCanvasProps) {
  const { array, left, right, slow, fast, low, mid, high, i, j } = step;
  const containerRef = useRef<HTMLDivElement>(null);
  const [elementXCoords, setElementXCoords] = useState<number[]>([]);

  // Calculate coordinates of each element to draw SVG connection arcs between pointers
  useEffect(() => {
    if (containerRef.current) {
      const children = containerRef.current.querySelectorAll('.array-element-box');
      const coords: number[] = [];
      const parentRect = containerRef.current.getBoundingClientRect();
      
      children.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const center = rect.left + rect.width / 2 - parentRect.left;
        coords.push(center);
      });
      setElementXCoords(coords);
    }
  }, [array, left, right, slow, fast, low, mid, high]);

  // Determine active pointers for each index
  const getPointersForIndex = (index: number) => {
    const list: { label: string; color: string; bg: string; text: string }[] = [];
    if (left === index) list.push({ label: 'L', color: 'indigo', bg: 'bg-indigo-600', text: 'text-white' });
    if (right === index) list.push({ label: 'R', color: 'amber', bg: 'bg-amber-500', text: 'text-amber-950' });
    if (slow === index) list.push({ label: 'Slow', color: 'indigo', bg: 'bg-indigo-600', text: 'text-white' });
    if (fast === index) list.push({ label: 'Fast', color: 'emerald', bg: 'bg-emerald-600', text: 'text-white' });
    if (low === index) list.push({ label: 'Low', color: 'indigo', bg: 'bg-indigo-600', text: 'text-white' });
    if (mid === index) list.push({ label: 'Mid', color: 'amber', bg: 'bg-amber-500', text: 'text-amber-950' });
    if (high === index) list.push({ label: 'High', color: 'rose', bg: 'bg-rose-500', text: 'text-white' });
    if (i === index) list.push({ label: 'i', color: 'slate', bg: 'bg-slate-700', text: 'text-white' });
    if (j === index) list.push({ label: 'j', color: 'sky', bg: 'bg-sky-600', text: 'text-white' });
    return list;
  };

  // Check if an index is highlighted/pointed to
  const isPointed = (index: number) => {
    return (
      left === index ||
      right === index ||
      slow === index ||
      fast === index ||
      low === index ||
      mid === index ||
      high === index ||
      i === index ||
      j === index
    );
  };

  // Render SVG arc connector for comparisons (e.g. left & right)
  const renderConnectorArc = () => {
    let p1: number | undefined;
    let p2: number | undefined;
    let label = '';
    let colorClass = 'stroke-indigo-400';

    if (left !== undefined && right !== undefined) {
      p1 = left;
      p2 = right;
      if (step.currentSum !== undefined) {
        label = `Sum: ${step.currentSum}`;
        if (step.target !== undefined) {
          label += ` vs ${step.target}`;
        }
      } else {
        label = `Compare L & R`;
      }
    } else if (slow !== undefined && fast !== undefined) {
      p1 = slow;
      p2 = fast;
      label = `Slow ↔ Fast`;
      colorClass = 'stroke-teal-400';
    } else if (low !== undefined && mid !== undefined) {
      p1 = low;
      p2 = mid;
      label = `Low ↔ Mid`;
      colorClass = 'stroke-indigo-400';
    }

    const hasCycle = step.cycleTargetIndex !== undefined && step.cycleTargetIndex >= 0;
    const cycleTargetIdx = step.cycleTargetIndex ?? -1;

    if (p1 === undefined && !hasCycle) return null;
    if (p1 !== undefined && (p2 === undefined || p1 === p2 || p1 >= elementXCoords.length || p2 >= elementXCoords.length)) {
      // If we only have hasCycle, we will still render that below, so don't return null yet
    }

    const x1 = p1 !== undefined ? elementXCoords[p1] : 0;
    const x2 = p2 !== undefined ? elementXCoords[p2] : 0;

    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const width = maxX - minX;
    const height = Math.min(60, width / 2.5); // Arc height proportional to distance

    // Draw quadratic curve arc for pointer comparison
    const pathD = p1 !== undefined && p2 !== undefined && p1 !== p2
      ? `M ${minX} 22 Q ${(minX + maxX) / 2} ${22 - height} ${maxX} 22`
      : '';

    // Draw cycle arrow path from last element to cycle start node
    let cyclePathD = '';
    if (hasCycle && elementXCoords.length > 0) {
      const startX = elementXCoords[elementXCoords.length - 1];
      const endX = elementXCoords[cycleTargetIdx];
      // A deep curve below the elements
      cyclePathD = `M ${startX} 22 C ${(startX + endX) / 2} 90 ${(startX + endX) / 2} 90 ${endX} 22`;
    }

    return (
      <svg className="absolute top-0 left-0 w-full h-[120px] pointer-events-none z-10">
        {/* Arrow markers */}
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" className="fill-purple-500" />
          </marker>
        </defs>

        {p1 !== undefined && p2 !== undefined && p1 !== p2 && (
          <>
            <path
              d={pathD}
              fill="none"
              className={`${colorClass} stroke-[2.5]`}
              strokeDasharray="4,4"
            />
            {/* Label in the center of the arc */}
            <foreignObject
              x={(minX + maxX) / 2 - 60}
              y={Math.max(2, 22 - height - 10)}
              width="120"
              height="28"
              className="overflow-visible"
            >
              <div className="flex justify-center">
                <span className="bg-slate-800 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-slate-700 shadow-sm whitespace-nowrap">
                  {label}
                </span>
              </div>
            </foreignObject>
          </>
        )}

        {/* Cycle feedback loop overlay */}
        {hasCycle && cyclePathD && (
          <>
            <path
              d={cyclePathD}
              fill="none"
              className="stroke-purple-500 stroke-[2] stroke-dasharray-[3]"
              strokeDasharray="3,3"
              markerEnd="url(#arrow)"
            />
            <foreignObject
              x={(elementXCoords[cycleTargetIdx] + elementXCoords[elementXCoords.length - 1]) / 2 - 50}
              y={48}
              width="100"
              height="28"
              className="overflow-visible"
            >
              <div className="flex justify-center">
                <span className="bg-purple-100 text-purple-800 font-sans text-[8px] font-bold px-1.5 py-0.5 rounded border border-purple-200 shadow-2xs whitespace-nowrap">
                  Cycle Loop Back
                </span>
              </div>
            </foreignObject>
          </>
        )}
      </svg>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-5 relative overflow-hidden h-[180px]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h3 className="text-xs font-sans font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-indigo-500" />
          Two Pointers Array Ribbon
        </h3>
        <span className="text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
          Size N = {array.length}
        </span>
      </div>

      {/* Main Array Display */}
      <div className="relative flex-1 mt-6">
        {/* SVG Arc Layer */}
        {renderConnectorArc()}

        {/* Array Elements Ribbon */}
        <div
          ref={containerRef}
          className="flex items-center justify-center gap-2 md:gap-3 w-full"
        >
          {array.map((val, idx) => {
            const activePointers = getPointersForIndex(idx);
            const isElementSelected = isPointed(idx);

            // Special styles depending on pointer category
            let borderClass = 'border-slate-200';
            let bgClass = 'bg-slate-50';
            let textClass = 'text-slate-800';

            if (isElementSelected) {
              borderClass = 'border-amber-400';
              bgClass = 'bg-amber-50';
              textClass = 'text-amber-900 font-bold';
            }

            return (
              <div
                key={idx}
                className="flex flex-col items-center relative select-none w-11 md:w-12"
              >
                {/* Element Box */}
                <div
                  className={`array-element-box w-11 h-11 md:w-12 md:h-12 border-2 ${borderClass} ${bgClass} rounded-lg flex items-center justify-center font-sans text-sm md:text-base font-bold shadow-2xs transition-all relative z-20`}
                >
                  <span className={textClass}>{val}</span>
                </div>

                {/* Index Indicator */}
                <span className="text-[10px] font-sans font-bold text-slate-400 mt-1">
                  i={idx}
                </span>

                {/* Floating pointer chips underneath */}
                <div className="absolute top-[60px] flex flex-col items-center gap-1 z-30 min-h-[50px] w-full">
                  {activePointers.map((p, pIdx) => (
                    <span
                      key={pIdx}
                      className={`${p.bg} ${p.text} text-[9px] md:text-[10px] font-sans font-bold px-1.5 py-0.5 rounded shadow-2xs flex items-center gap-0.5`}
                    >
                      {p.label === 'L' && 'L →'}
                      {p.label === 'R' && '← R'}
                      {p.label !== 'L' && p.label !== 'R' && p.label}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
