import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Copy, Check, Terminal, Activity, ChevronDown, ChevronUp, X } from 'lucide-react';
import { ResultOutput, SimulationStep, ProblemDefinition } from '../types';

interface OutputBoxProps {
  resultOutput?: ResultOutput;
  activeStep: SimulationStep;
  problem: ProblemDefinition;
  totalSteps: number;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onClose?: () => void;
}

export const OutputBox: React.FC<OutputBoxProps> = ({
  resultOutput,
  activeStep,
  problem,
  totalSteps,
  collapsible = false,
  defaultCollapsed = false,
  onClose
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(defaultCollapsed);

  const isFinalStep = activeStep.stepNumber >= totalSteps;
  const isFinal = resultOutput?.isFinal ?? isFinalStep;

  // Derive intelligent display value if resultOutput is not explicitly set
  const getDerivedOutput = (): { label: string; value: string; details: string } => {
    if (resultOutput) {
      const valStr = Array.isArray(resultOutput.value)
        ? JSON.stringify(resultOutput.value)
        : typeof resultOutput.value === 'object'
        ? JSON.stringify(resultOutput.value)
        : String(resultOutput.value);

      return {
        label: resultOutput.label,
        value: valStr,
        details: resultOutput.details || (isFinal ? 'Computation completed.' : 'Calculating progressive state...')
      };
    }

    // Dynamic fallbacks per problem archetype
    if (problem.id === 'p04_heap_sort') {
      const sortedPortion = activeStep.heap.slice(activeStep.heap.length - (activeStep.extractedIndices?.length || 0));
      return {
        label: isFinal ? 'Final Sorted Array' : 'In-Place Sorted Suffix',
        value: JSON.stringify(sortedPortion.length > 0 ? sortedPortion : activeStep.heap),
        details: isFinal
          ? 'Heap Sort completely sorted all elements in O(N log N).'
          : `Active Heap Size: ${activeStep.heap.length - (activeStep.extractedIndices?.length || 0)} | Sorted Count: ${activeStep.extractedIndices?.length || 0}`
      };
    }

    if (problem.id === 'p01_insert') {
      return {
        label: isFinal ? 'Final Heap Array' : 'Current Heap Array',
        value: JSON.stringify(activeStep.heap),
        details: isFinal
          ? 'Element successfully positioned. Heap order property satisfied.'
          : 'Percolating element up the complete binary tree...'
      };
    }

    if (problem.id === 'p02_extract') {
      return {
        label: isFinal ? 'Extracted Root Element' : 'Root Element to Extract',
        value: activeStep.heap.length > 0 ? String(activeStep.heap[0]) : 'None',
        details: isFinal
          ? 'Priority element extracted and heap order property restored.'
          : 'Sifting replacement node down the tree...'
      };
    }

    if (problem.id === 'p03_build_heap') {
      return {
        label: isFinal ? "Final Valid Heap (Floyd's Algorithm)" : 'Array State During Sift-Down',
        value: JSON.stringify(activeStep.heap),
        details: isFinal
          ? 'Array successfully converted into a valid binary heap in O(N) time.'
          : 'Applying bottom-up heapify on non-leaf nodes...'
      };
    }

    if (activeStep.dualHeap?.isDual) {
      return {
        label: 'Running Median',
        value: String(activeStep.dualHeap.currentMedian ?? '—'),
        details: `Max-Heap Size: ${activeStep.dualHeap.maxHeap.length} | Min-Heap Size: ${activeStep.dualHeap.minHeap.length}`
      };
    }

    if (activeStep.inspectorState.topK) {
      return {
        label: `Top-${activeStep.inspectorState.topK.k} Heap Contents`,
        value: JSON.stringify(activeStep.heap),
        details: `Current Root: ${activeStep.inspectorState.topK.currentTop} | Capacity: ${activeStep.inspectorState.topK.k}`
      };
    }

    if (activeStep.inspectorState.kWay) {
      return {
        label: 'Merged Output Array',
        value: JSON.stringify(activeStep.inspectorState.kWay.mergedOutput),
        details: `Merged ${activeStep.inspectorState.kWay.mergedOutput.length} elements from K sorted inputs`
      };
    }

    if (activeStep.inspectorState.greedy?.totalCost !== undefined) {
      return {
        label: 'Accumulated Merge Cost',
        value: String(activeStep.inspectorState.greedy.totalCost),
        details: activeStep.inspectorState.greedy.lastMergedPair
          ? `Last merged stick lengths: [${activeStep.inspectorState.greedy.lastMergedPair.join(', ')}]`
          : 'Combining smallest elements greedily'
      };
    }

    if (activeStep.inspectorState.greedy?.scheduleOutput) {
      return {
        label: 'Current CPU Schedule / Output',
        value: activeStep.inspectorState.greedy.scheduleOutput.join(' -> ') || 'Idle',
        details: `Units elapsed: ${activeStep.inspectorState.greedy.scheduleOutput.length}`
      };
    }

    return {
      label: 'Live Algorithm State',
      value: JSON.stringify(activeStep.heap),
      details: activeStep.description
    };
  };

  const output = getDerivedOutput();

  const handleCopy = () => {
    navigator.clipboard.writeText(output.value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (isCollapsed) {
    return (
      <div
        id="live-output-box-collapsed"
        className={`rounded-lg border px-2.5 py-1.5 flex items-center justify-between gap-2 transition-all select-none shadow-2xs ${
          isFinal
            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
            : 'bg-amber-50/80 border-amber-300 text-amber-950'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          {isFinal ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <Activity className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
          )}
          <span className="font-sans font-bold text-xs shrink-0">{output.label}:</span>
          <span className="font-mono text-xs font-extrabold truncate text-slate-800">
            {output.value}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleCopy}
            title="Copy output value"
            className="p-1 rounded hover:bg-white/80 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
          </button>
          <button
            onClick={() => setIsCollapsed(false)}
            title="Expand Output Details"
            className="flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded bg-white/90 hover:bg-white border border-slate-300/80 text-slate-700 cursor-pointer"
          >
            <span>Expand</span>
            <ChevronDown className="w-3 h-3" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              title="Close Output Box"
              className="p-1 rounded hover:bg-white/80 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      id="live-output-box"
      className={`rounded-lg border px-3 py-2 transition-all select-none shadow-2xs ${
        isFinal
          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
          : 'bg-amber-50/70 border-amber-300 text-amber-950'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          {isFinal ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <Activity className="w-3.5 h-3.5 text-amber-600 shrink-0 animate-pulse" />
          )}

          <span className="font-sans font-bold text-xs tracking-tight truncate">
            {output.label}
          </span>

          <span
            className={`inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-mono font-semibold uppercase tracking-wider border shrink-0 ${
              isFinal
                ? 'bg-emerald-100/80 text-emerald-800 border-emerald-300'
                : 'bg-amber-100/80 text-amber-800 border-amber-300'
            }`}
          >
            {isFinal ? 'Final' : `${activeStep.stepNumber}/${totalSteps}`}
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Copy Result Button */}
          <button
            id="copy-output-btn"
            onClick={handleCopy}
            title="Copy current output value"
            className="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono rounded bg-white/80 hover:bg-white border border-slate-300/80 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>

          {collapsible && (
            <button
              onClick={() => setIsCollapsed(true)}
              title="Collapse Output"
              className="p-1 rounded hover:bg-white/80 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}

          {onClose && (
            <button
              onClick={onClose}
              title="Close Output Box"
              className="p-1 rounded hover:bg-white/80 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Output Display */}
      <div className="flex items-baseline gap-2 bg-white/90 rounded-md border border-slate-200/90 px-2.5 py-1 shadow-2xs overflow-x-auto scrollbar-thin">
        <span className="text-[10px] font-mono font-bold text-slate-400 select-none shrink-0">
          Result:
        </span>
        <span
          id="output-result-value"
          className={`font-mono text-xs font-extrabold tracking-tight truncate ${
            isFinal ? 'text-emerald-900' : 'text-amber-950'
          }`}
        >
          {output.value}
        </span>
      </div>

      {/* Output Details / Subtitle */}
      {output.details && (
        <p className="text-[10px] font-mono text-slate-600 mt-1 leading-snug truncate">
          {output.details}
        </p>
      )}
    </div>
  );
};
