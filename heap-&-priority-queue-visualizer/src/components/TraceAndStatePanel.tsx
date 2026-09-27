import React, { useState, useEffect, useRef } from 'react';
import { Code, Eye, Layers, ListOrdered, Copy, Check, Terminal, Cpu, Sparkles } from 'lucide-react';
import { InspectorState, SimulationStep, ProblemDefinition } from '../types';
import { CppSnippet } from '../algorithms/cppSnippets';
import { OutputBox } from './OutputBox';

interface TraceAndStatePanelProps {
  cppSnippet: CppSnippet;
  activeLineNumber: number;
  inspectorState: InspectorState;
  callStack: string[];
  executionLogs: string[];
  currentStep: number;
  activeStep?: SimulationStep;
  problem?: ProblemDefinition;
  totalSteps?: number;
}

export const TraceAndStatePanel: React.FC<TraceAndStatePanelProps> = ({
  cppSnippet,
  activeLineNumber,
  inspectorState,
  callStack,
  executionLogs,
  currentStep,
  activeStep,
  problem,
  totalSteps = 1
}) => {
  const [activeTab, setActiveTab] = useState<'cpp' | 'inspector' | 'output' | 'stack' | 'logs'>('cpp');
  const [copied, setCopied] = useState<boolean>(false);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const codeContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll C++ code view when active line changes
  useEffect(() => {
    if (activeTab === 'cpp' && activeLineRef.current && codeContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [activeLineNumber, activeTab]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(cppSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-lg shadow-2xs overflow-hidden select-none">
      {/* Panel Tab Navigation Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-2 pt-1.5 pb-0">
        <div className="flex items-center gap-1">
          <button
            id="tab-cpp-trace"
            onClick={() => setActiveTab('cpp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t-md transition-colors cursor-pointer border-t border-x ${
              activeTab === 'cpp'
                ? 'bg-white text-amber-900 border-slate-200 border-b-white -mb-px'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-amber-600" />
            <span>C++ Trace</span>
          </button>

          <button
            id="tab-live-inspector"
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t-md transition-colors cursor-pointer border-t border-x ${
              activeTab === 'inspector'
                ? 'bg-white text-amber-900 border-slate-200 border-b-white -mb-px'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Inspector</span>
          </button>

          <button
            id="tab-output-view"
            onClick={() => setActiveTab('output')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t-md transition-colors cursor-pointer border-t border-x ${
              activeTab === 'output'
                ? 'bg-white text-emerald-900 border-slate-200 border-b-white -mb-px'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-600" />
            <span>Output</span>
            {activeStep?.resultOutput?.isFinal && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            )}
          </button>

          <button
            id="tab-call-stack"
            onClick={() => setActiveTab('stack')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t-md transition-colors cursor-pointer border-t border-x ${
              activeTab === 'stack'
                ? 'bg-white text-amber-900 border-slate-200 border-b-white -mb-px'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Stack ({callStack.length})</span>
          </button>

          <button
            id="tab-execution-log"
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-t-md transition-colors cursor-pointer border-t border-x ${
              activeTab === 'logs'
                ? 'bg-white text-amber-900 border-slate-200 border-b-white -mb-px'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5 text-emerald-600" />
            <span>Logs</span>
          </button>
        </div>

        {/* Copy snippet button */}
        {activeTab === 'cpp' && (
          <button
            id="copy-cpp-snippet-btn"
            onClick={handleCopyCode}
            className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-900 mb-1 px-2 py-0.5 rounded hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Copy standard C++ code snippet"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Tab Contents Area */}
      <div className="flex-1 overflow-hidden relative">
        {/* TAB 1: C++ TRACE */}
        {activeTab === 'cpp' && (
          <div
            ref={codeContainerRef}
            className="h-full overflow-y-auto bg-slate-900 text-slate-100 font-mono text-xs p-2.5 leading-relaxed scrollbar-thin"
          >
            {cppSnippet.lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isActive = lineNum === activeLineNumber;

              return (
                <div
                  key={lineNum}
                  ref={isActive ? activeLineRef : undefined}
                  className={`flex items-start gap-2.5 px-2 py-0.5 rounded transition-all duration-150 ${
                    isActive
                      ? 'bg-amber-500/25 border-l-2 border-amber-400 text-amber-200 font-semibold'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <span className="text-[10px] text-slate-500 select-none w-5 text-right shrink-0">
                    {lineNum}
                  </span>
                  <pre className="whitespace-pre overflow-x-auto flex-1 font-mono text-xs">
                    {line}
                  </pre>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: LIVE STATE INSPECTOR */}
        {activeTab === 'inspector' && (
          <div className="h-full overflow-y-auto p-3 space-y-3 bg-[#FAF9F6] font-sans">
            {/* Live Algorithm Output Summary Card */}
            {activeStep && problem && (
              <OutputBox
                resultOutput={activeStep.resultOutput}
                activeStep={activeStep}
                problem={problem}
                totalSteps={totalSteps}
                collapsible={true}
                defaultCollapsed={false}
              />
            )}

            {/* Heapify Specific Inspector */}
            {inspectorState.heapify && (
              <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-600" />
                  <span>Heapify Index Calculations</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Current Index (i):</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {inspectorState.heapify.currentIndex >= 0 ? inspectorState.heapify.currentIndex : '—'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Parent (floor((i-1)/2)):</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {inspectorState.heapify.parentIndex >= 0 ? inspectorState.heapify.parentIndex : 'Root / None'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Left Child (2i + 1):</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {inspectorState.heapify.leftIndex >= 0 ? inspectorState.heapify.leftIndex : '—'}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Right Child (2i + 2):</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {inspectorState.heapify.rightIndex >= 0 ? inspectorState.heapify.rightIndex : '—'}
                    </span>
                  </div>
                </div>

                <div className="bg-amber-50/70 p-2 rounded border border-amber-200 text-xs font-mono text-amber-900">
                  <span className="text-[10px] text-amber-700 block font-semibold">Active Invariant Evaluation:</span>
                  <span className="font-semibold">{inspectorState.heapify.formula}</span>
                </div>
              </div>
            )}

            {/* Top-K / Kth Element Inspector */}
            {inspectorState.topK && (
              <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Top-K Heap Filter State</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Capacity K:</span>
                    <span className="font-bold text-indigo-700 text-sm">{inspectorState.topK.k}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Heap Size:</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {inspectorState.topK.currentHeapCount} / {inspectorState.topK.k}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Incoming Element:</span>
                    <span className="font-bold text-slate-900 text-sm">{inspectorState.topK.incomingVal}</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Current Top:</span>
                    <span className="font-bold text-amber-900 text-sm">{inspectorState.topK.currentTop}</span>
                  </div>
                </div>

                <div className="bg-indigo-50/60 p-2 rounded border border-indigo-200 text-xs font-mono text-indigo-900">
                  <span className="text-[10px] text-indigo-700 block font-semibold">Heap Decision Status:</span>
                  <span className="font-semibold">{inspectorState.topK.comparisonResult}</span>
                </div>

                {inspectorState.topK.frequencyMap && (
                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-500 block mb-1">
                      Computed Frequency Map:
                    </span>
                    <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                      {Object.entries(inspectorState.topK.frequencyMap).map(([k, v]) => (
                        <span
                          key={k}
                          className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-700 border border-slate-200"
                        >
                          {k}: <b>{v}</b>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Two-Heap Median Inspector */}
            {inspectorState.twoHeap && (
              <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Two-Heap Balancing Invariant</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Max-Heap (Lower):</span>
                    <span className="font-bold text-slate-900 text-sm">{inspectorState.twoHeap.maxHeapSize} items</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Min-Heap (Upper):</span>
                    <span className="font-bold text-slate-900 text-sm">{inspectorState.twoHeap.minHeapSize} items</span>
                  </div>
                </div>

                <div className="bg-amber-50 p-2.5 rounded border border-amber-300 text-center">
                  <span className="text-[10px] text-amber-800 uppercase font-mono block">Calculated Median:</span>
                  <span className="text-base font-extrabold font-mono text-amber-950">
                    {String(inspectorState.twoHeap.median)}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                  <span>Balance Check: </span>
                  <span
                    className={`font-semibold ${
                      inspectorState.twoHeap.invariantSatisfied ? 'text-emerald-700' : 'text-amber-700'
                    }`}
                  >
                    {inspectorState.twoHeap.invariantSatisfied
                      ? '✓ Invariant Satisfied: 0 <= (size1 - size2) <= 1'
                      : '⚠ Invariant Broken: Triggering Rebalance Transfer'}
                  </span>
                </div>
              </div>
            )}

            {/* K-Way Merge Inspector */}
            {inspectorState.kWay && (
              <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-600" />
                  <span>K-Way List Pointer Tracking</span>
                </div>

                <div className="space-y-1.5">
                  {inspectorState.kWay.listPointers.map((p) => (
                    <div
                      key={p.listId}
                      className="flex items-center justify-between text-xs font-mono bg-slate-50 p-1.5 rounded border border-slate-200"
                    >
                      <span className="font-semibold text-slate-700">List #{p.listId + 1}</span>
                      <span className="text-slate-500">
                        Index: {p.index} / {p.totalItems}
                      </span>
                      <span className="bg-blue-50 px-1.5 py-0.5 rounded text-blue-800 font-bold border border-blue-200">
                        Head: {p.value === Infinity ? 'Exhausted' : p.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-100 p-2 rounded border border-slate-200 text-xs font-mono">
                  <span className="text-[10px] text-slate-500 block font-semibold mb-1">
                    Merged Output ({inspectorState.kWay.mergedOutput.length} items):
                  </span>
                  <span className="text-slate-800 break-words">
                    [{inspectorState.kWay.mergedOutput.join(', ')}]
                  </span>
                </div>
              </div>
            )}

            {/* Greedy / Sticks / Scheduler Inspector */}
            {inspectorState.greedy && (
              <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-600" />
                  <span>Greedy Execution Parameters</span>
                </div>

                {inspectorState.greedy.totalCost !== undefined && (
                  <div className="bg-amber-50 p-2.5 rounded border border-amber-300 text-center">
                    <span className="text-[10px] text-amber-800 uppercase font-mono block">Accumulated Merge Cost:</span>
                    <span className="text-lg font-extrabold font-mono text-amber-950">
                      {inspectorState.greedy.totalCost}
                    </span>
                  </div>
                )}

                {inspectorState.greedy.scheduleOutput && (
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-xs font-mono">
                    <span className="text-[10px] text-slate-500 block font-semibold mb-1">
                      Generated Schedule / Output:
                    </span>
                    <span className="text-slate-800 font-bold break-words">
                      {inspectorState.greedy.scheduleOutput.join(' -> ')}
                    </span>
                  </div>
                )}

                {inspectorState.greedy.queueState && inspectorState.greedy.queueState.length > 0 && (
                  <div className="bg-indigo-50/70 p-2 rounded border border-indigo-200 text-xs font-mono">
                    <span className="text-[10px] text-indigo-700 block font-semibold mb-1">
                      Cooldown Wait Queue:
                    </span>
                    <div className="space-y-1">
                      {inspectorState.greedy.queueState.map((q, idx) => (
                        <div key={idx} className="flex justify-between text-[11px]">
                          <span>Task {q.item}</span>
                          <span className="font-semibold">Ready at t={q.readyAt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Heap on Pairs & Intervals Inspector */}
            {inspectorState.pairs && (
              <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-600" />
                  <span>Heap on Pairs & Intervals Inspector</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Pairs in Heap:</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {inspectorState.pairs.pairsInHeap.length}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Result Items:</span>
                    <span className="font-bold text-emerald-700 text-sm">
                      {inspectorState.pairs.resultPairs.length}
                    </span>
                  </div>
                </div>

                {inspectorState.pairs.currentExtracted && (
                  <div className="bg-amber-50 p-2 rounded border border-amber-300 text-xs font-mono text-amber-900">
                    <span className="text-[10px] text-amber-700 block font-semibold">Active Extracted Pair:</span>
                    <span className="font-bold">[{inspectorState.pairs.currentExtracted.join(', ')}]</span>
                  </div>
                )}

                <div className="bg-slate-100 p-2 rounded border border-slate-200 text-xs font-mono">
                  <span className="text-[10px] text-slate-500 block font-semibold mb-1">
                    Output Collected ({inspectorState.pairs.resultPairs.length}):
                  </span>
                  <span className="text-slate-800 break-words">
                    {JSON.stringify(inspectorState.pairs.resultPairs)}
                  </span>
                </div>

                {inspectorState.pairs.details && (
                  <p className="text-[11px] text-slate-600 font-mono">
                    {inspectorState.pairs.details}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ALGORITHM OUTPUT */}
        {activeTab === 'output' && (
          <div className="h-full overflow-y-auto p-3 space-y-3 bg-[#FAF9F6] font-sans">
            {activeStep && problem ? (
              <div className="space-y-3">
                <OutputBox
                  resultOutput={activeStep.resultOutput}
                  activeStep={activeStep}
                  problem={problem}
                  totalSteps={totalSteps}
                  collapsible={false}
                />

                <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Computation Progress Summary</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono">
                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-sans">Algorithm Category:</span>
                      <span className="font-bold text-slate-800 text-xs truncate block">{problem.category}</span>
                    </div>
                    <div className="bg-slate-50 p-2 rounded border border-slate-200">
                      <span className="text-[10px] text-slate-500 block font-sans">Progress Status:</span>
                      <span className="font-bold text-emerald-700 text-xs">
                        {activeStep.stepNumber >= totalSteps ? 'Complete (100%)' : `Step ${activeStep.stepNumber} of ${totalSteps}`}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-2 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block font-sans font-semibold mb-0.5">
                      Current Action & Description:
                    </span>
                    <p className="font-mono text-slate-700 leading-relaxed text-[11px]">
                      {activeStep.description}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 text-xs py-8">
                No active simulation step available.
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CALL STACK */}
        {activeTab === 'stack' && (
          <div className="h-full overflow-y-auto p-3 space-y-1.5 bg-[#FAF9F6] font-mono text-xs">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Current Function Frame Stack
            </span>
            {callStack.length === 0 ? (
              <div className="text-slate-400 text-xs py-4 text-center font-sans">
                Stack is currently empty.
              </div>
            ) : (
              callStack.map((frame, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded border transition-all ${
                    idx === callStack.length - 1
                      ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>Frame #{idx}</span>
                    {idx === callStack.length - 1 && (
                      <span className="bg-amber-200/80 text-amber-900 px-1 rounded text-[9px] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <div className="truncate">{frame}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: EXECUTION LOG */}
        {activeTab === 'logs' && (
          <div className="h-full overflow-y-auto p-2 space-y-1 bg-slate-900 text-slate-200 font-mono text-[11px] scrollbar-thin">
            <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1 mb-1 px-1">
              <span className="text-[10px] uppercase">Step</span>
              <span className="text-[10px] uppercase">Action</span>
            </div>
            {executionLogs.slice(0, currentStep + 1).map((log, idx) => (
              <div
                key={idx}
                className={`px-1.5 py-0.5 rounded flex items-start gap-2 ${
                  idx === currentStep ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-300'
                }`}
              >
                <span className="text-[10px] text-slate-500 shrink-0 w-8 select-none">
                  #{idx + 1}
                </span>
                <span className="flex-1 break-words">{log}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
