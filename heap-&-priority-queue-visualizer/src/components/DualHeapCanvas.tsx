import React from 'react';
import { DualHeapState } from '../types';
import { HeapTreeCanvas } from './HeapTreeCanvas';
import { ArrowRight, CheckCircle2, AlertCircle, Scale } from 'lucide-react';

interface DualHeapCanvasProps {
  dualState: DualHeapState;
  hoveredIndex?: number | null;
  onHoverIndex?: (index: number | null) => void;
}

export const DualHeapCanvas: React.FC<DualHeapCanvasProps> = ({
  dualState,
  hoveredIndex,
  onHoverIndex
}) => {
  const { maxHeap, minHeap, currentMedian, incomingElement, balanceStatus } = dualState;

  const isBalanced =
    maxHeap.length >= minHeap.length && maxHeap.length - minHeap.length <= 1;

  return (
    <div className="flex flex-col h-full bg-[#FAF9F6] border border-slate-200 rounded-lg p-2.5 relative select-none shadow-2xs">
      {/* Top Status & Median Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-2 mb-2 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center">
            <Scale className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-xs text-slate-900">
                Dual-Heap Balance Monitor
              </span>
              <span
                className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-semibold border ${
                  isBalanced
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {isBalanced ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Balanced</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3" />
                    <span>Rebalancing</span>
                  </>
                )}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-500">
              maxHeap.size: {maxHeap.length} | minHeap.size: {minHeap.length} (diff: {maxHeap.length - minHeap.length})
            </p>
          </div>
        </div>

        {/* Center: Running Median Callout */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 px-3 py-1 rounded-md shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-900 uppercase font-mono">
            Running Median:
          </span>
          <span className="font-mono text-sm font-extrabold text-amber-950">
            {currentMedian !== null && currentMedian !== undefined ? String(currentMedian) : '—'}
          </span>
        </div>

        {/* Incoming Stream Value if any */}
        {incomingElement !== null && incomingElement !== undefined && (
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1 rounded">
            <span>Incoming:</span>
            <span className="font-bold text-slate-900">{incomingElement}</span>
          </div>
        )}
      </div>

      {/* Split Grid: Left Max-Heap, Right Min-Heap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1 min-h-[220px]">
        {/* Left: Max-Heap (Lower Half) */}
        <div className="flex flex-col h-full">
          <HeapTreeCanvas
            heap={maxHeap}
            heapType="max"
            title="Max-Heap (Lower Half: ≤ Median)"
            badge={`Top: ${maxHeap[0] ?? 'Empty'}`}
            hoveredIndex={hoveredIndex}
            onHoverIndex={onHoverIndex}
          />
        </div>

        {/* Right: Min-Heap (Upper Half) */}
        <div className="flex flex-col h-full">
          <HeapTreeCanvas
            heap={minHeap}
            heapType="min"
            title="Min-Heap (Upper Half: ≥ Median)"
            badge={`Top: ${minHeap[0] ?? 'Empty'}`}
            hoveredIndex={hoveredIndex}
            onHoverIndex={onHoverIndex}
          />
        </div>
      </div>
    </div>
  );
};
