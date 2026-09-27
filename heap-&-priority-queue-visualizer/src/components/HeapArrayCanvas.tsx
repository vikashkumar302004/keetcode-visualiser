import React from 'react';
import { NodeState, HeapType } from '../types';

interface HeapArrayCanvasProps {
  heap: number[];
  heapLabels?: string[];
  comparingIndices?: number[];
  swappingIndices?: number[];
  satisfiedIndices?: number[];
  extractedIndices?: number[];
  nodeStates?: Record<number, NodeState>;
  hoveredIndex?: number | null;
  onHoverIndex?: (index: number | null) => void;
  heapType?: HeapType;
}

export const HeapArrayCanvas: React.FC<HeapArrayCanvasProps> = ({
  heap,
  heapLabels,
  comparingIndices = [],
  swappingIndices = [],
  satisfiedIndices = [],
  extractedIndices = [],
  nodeStates = {},
  hoveredIndex,
  onHoverIndex,
  heapType = 'max'
}) => {
  const getSlotState = (idx: number): NodeState => {
    if (swappingIndices.includes(idx)) return 'swapping';
    if (comparingIndices.includes(idx)) return 'comparing';
    if (extractedIndices.includes(idx)) return 'extracted';
    if (nodeStates[idx]) return nodeStates[idx];
    if (satisfiedIndices.includes(idx)) return 'satisfied';
    return 'default';
  };

  const getStyleForState = (state: NodeState, isHovered: boolean, isRelated: string | null) => {
    if (state === 'swapping') {
      return 'bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-300 font-bold';
    }
    if (state === 'comparing') {
      return 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-300 font-bold';
    }
    if (state === 'satisfied') {
      return 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
    }
    if (state === 'extracted') {
      return 'bg-slate-100 border-slate-300 text-slate-400 opacity-60 line-through';
    }
    if (state === 'active') {
      return 'bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-300 font-bold';
    }

    if (isHovered) {
      return 'bg-sky-50 border-sky-500 text-sky-900 ring-2 ring-sky-300';
    }
    if (isRelated === 'parent') {
      return 'bg-indigo-50 border-indigo-400 text-indigo-900 font-semibold';
    }
    if (isRelated === 'left' || isRelated === 'right') {
      return 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold';
    }

    return 'bg-white border-slate-300 text-slate-800 hover:border-slate-400';
  };

  return (
    <div className="bg-[#FAF9F6] border border-slate-200 rounded-lg p-2 select-none shadow-2xs">
      <div className="flex items-center justify-between mb-1.5 px-1">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-xs text-slate-800 tracking-tight">
            Underlying Array Representation (1D Memory Slots)
          </span>
          <span className="font-mono text-[10px] text-slate-500">
            N = {heap.length}
          </span>
        </div>

        {hoveredIndex !== null && hoveredIndex !== undefined && hoveredIndex < heap.length && (
          <div className="font-mono text-[10px] text-slate-600 flex items-center gap-2">
            <span className="bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 text-sky-800">
              Selected i={hoveredIndex}
            </span>
            {hoveredIndex > 0 && (
              <span className="bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200 text-indigo-800">
                Parent: {Math.floor((hoveredIndex - 1) / 2)}
              </span>
            )}
            {2 * hoveredIndex + 1 < heap.length && (
              <span className="bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-emerald-800">
                Left: {2 * hoveredIndex + 1}
              </span>
            )}
            {2 * hoveredIndex + 2 < heap.length && (
              <span className="bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-emerald-800">
                Right: {2 * hoveredIndex + 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Array Slots Row */}
      <div className="flex items-stretch gap-1.5 overflow-x-auto pb-1 pt-0.5 px-1 scrollbar-thin">
        {heap.length === 0 ? (
          <div className="text-center w-full py-2 text-xs text-slate-400 font-sans">
            Array is empty
          </div>
        ) : (
          heap.map((val, idx) => {
            const state = getSlotState(idx);
            const isHovered = hoveredIndex === idx;

            let isRelated: string | null = null;
            if (hoveredIndex !== null && hoveredIndex !== undefined) {
              if (idx > 0 && Math.floor((hoveredIndex - 1) / 2) === idx) isRelated = 'parent';
              else if (2 * hoveredIndex + 1 === idx) isRelated = 'left';
              else if (2 * hoveredIndex + 2 === idx) isRelated = 'right';
            }

            const styleClass = getStyleForState(state, isHovered, isRelated);

            return (
              <div
                key={`slot-${idx}`}
                onMouseEnter={() => onHoverIndex && onHoverIndex(idx)}
                onMouseLeave={() => onHoverIndex && onHoverIndex(null)}
                className="flex flex-col items-center shrink-0 cursor-pointer group"
              >
                {/* Index tag above slot */}
                <div className="flex items-center gap-0.5 mb-1">
                  <span className="font-mono text-[9px] text-slate-400 font-semibold group-hover:text-slate-700">
                    [{idx}]
                  </span>
                  {isRelated && (
                    <span className="font-mono text-[8px] uppercase px-1 rounded bg-slate-200/80 text-slate-700 leading-none py-0.5">
                      {isRelated}
                    </span>
                  )}
                </div>

                {/* Array Box */}
                <div
                  className={`w-11 h-10 rounded-md border flex flex-col items-center justify-center transition-all duration-150 shadow-2xs ${styleClass}`}
                >
                  <span className="font-mono text-xs font-bold leading-tight">
                    {val}
                  </span>
                  {heapLabels && heapLabels[idx] && (
                    <span className="font-mono text-[8px] text-slate-500 leading-none truncate max-w-[38px]">
                      {heapLabels[idx]}
                    </span>
                  )}
                </div>

                {/* Sub-indicator */}
                <span className="text-[8px] font-mono text-slate-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  {idx === 0 ? (heapType === 'max' ? 'MAX' : 'MIN') : ''}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
