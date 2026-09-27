import React, { useState } from 'react';
import { CallStackFrame } from '../types';
import { Layers, Activity, Split, Compass, CheckCircle2, XCircle, ListTree } from 'lucide-react';

interface InspectorPanelsProps {
  callStack: CallStackFrame[];
  logs: string[];
  bounds?: {
    min: number | string;
    max: number | string;
    currentVal?: number;
    isValid?: boolean;
  };
  inorderSuccessorTrace?: {
    targetVal: number;
    successorVal?: number;
    phase: string;
    details: string;
  };
  rangeSumState?: {
    low: number;
    high: number;
    currentSum: number;
    includedValues: number[];
  };
  kthState?: {
    k: number;
    count: number;
    mode: 'smallest' | 'largest';
    currentVal?: number;
    foundVal?: number;
  };
  lcaState?: {
    p: number;
    q: number;
    currentVal?: number;
    splitFound?: boolean;
    result?: number;
  };
}

export const InspectorPanels: React.FC<InspectorPanelsProps> = ({
  callStack,
  logs,
  bounds,
  inorderSuccessorTrace,
  rangeSumState,
  kthState,
  lcaState,
}) => {
  const [activeTab, setActiveTab] = useState<'helpers' | 'stack' | 'logs'>('helpers');

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col h-[280px]">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('helpers')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'helpers'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Algorithm Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('stack')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'stack'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Call Stack</span>
            <span className="text-[10px] bg-slate-200/80 text-slate-700 font-mono px-1 rounded-full">
              {callStack.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'logs'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Trace Logs</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          Live Runtime State
        </span>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto pr-1">
        {/* TAB 1: ALGORITHM SPECIFIC HELPERS */}
        {activeTab === 'helpers' && (
          <div className="space-y-3">
            {/* Active Range Boundaries Visualizer (for Validate BST & Prune) */}
            {bounds && (
              <div className="bg-[#FAF9F6] border border-slate-200/90 rounded-xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Split className="w-3.5 h-3.5 text-blue-600" />
                    Propagating Interval Constraint
                  </span>
                  {bounds.isValid !== undefined && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        bounds.isValid
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {bounds.isValid ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Valid Constraint
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Constraint Violated
                        </>
                      )}
                    </span>
                  )}
                </div>

                {/* Visual Interval Slider Graphic */}
                <div className="relative mt-2 mb-1">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="w-full bg-blue-400/80 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1.5">
                    <span>Lower: <strong className="text-slate-800">{bounds.min}</strong></span>
                    {bounds.currentVal !== undefined && (
                      <span className="text-amber-800 bg-amber-100 px-1.5 rounded font-semibold">
                        Node: {bounds.currentVal}
                      </span>
                    )}
                    <span>Upper: <strong className="text-slate-800">{bounds.max}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Inorder Successor Trace Helper (for Complex Deletions) */}
            {inorderSuccessorTrace && (
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-purple-950 flex items-center gap-1.5">
                    <ListTree className="w-3.5 h-3.5 text-purple-600" />
                    Inorder Successor Resolution (Case 3)
                  </span>
                  <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-semibold uppercase">
                    {inorderSuccessorTrace.phase}
                  </span>
                </div>
                <p className="text-xs text-purple-900 leading-relaxed font-sans">
                  {inorderSuccessorTrace.details}
                </p>
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-purple-200/60 text-xs font-mono">
                  <span>Target Node: <strong className="text-purple-950">{inorderSuccessorTrace.targetVal}</strong></span>
                  {inorderSuccessorTrace.successorVal !== undefined && (
                    <span>Successor Key: <strong className="text-emerald-700">{inorderSuccessorTrace.successorVal}</strong></span>
                  )}
                </div>
              </div>
            )}

            {/* Range Sum Accumulator */}
            {rangeSumState && (
              <div className="bg-[#FAF9F6] border border-slate-200/90 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-800">
                    Range Accumulator [{rangeSumState.low} ... {rangeSumState.high}]
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Sum: {rangeSumState.currentSum}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  <span>Included Elements: </span>
                  <span className="font-mono text-slate-800 font-medium">
                    {rangeSumState.includedValues.length > 0
                      ? rangeSumState.includedValues.join(' + ')
                      : 'None yet'}
                  </span>
                </div>
              </div>
            )}

            {/* K-th Element State */}
            {kthState && (
              <div className="bg-[#FAF9F6] border border-slate-200/90 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-800">
                    K-th {kthState.mode === 'smallest' ? 'Smallest' : 'Largest'} Counter (k = {kthState.k})
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Count: {kthState.count} / {kthState.k}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  {kthState.foundVal !== undefined ? (
                    <span className="text-emerald-700 font-semibold">
                      Target found: Node [{kthState.foundVal}]
                    </span>
                  ) : (
                    <span>
                      Currently inspecting: {kthState.currentVal !== undefined ? `Node [${kthState.currentVal}]` : 'traversing...'}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* LCA State */}
            {lcaState && (
              <div className="bg-[#FAF9F6] border border-slate-200/90 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-800">
                    LCA Targets: p = {lcaState.p}, q = {lcaState.q}
                  </span>
                  {lcaState.result !== undefined && (
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      LCA: {lcaState.result}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-600">
                  {lcaState.splitFound ? (
                    <span className="text-emerald-700 font-medium">
                      Split point reached at node [{lcaState.result}]. Targets diverge here.
                    </span>
                  ) : (
                    <span>Current traversal node: [{lcaState.currentVal}]</span>
                  )}
                </div>
              </div>
            )}

            {/* Fallback info when no specific helper applies */}
            {!bounds && !inorderSuccessorTrace && !rangeSumState && !kthState && !lcaState && (
              <div className="text-center py-6 text-slate-400 text-xs font-sans">
                <Compass className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
                <p>Run any algorithm or step through the simulation to view real-time state inspections.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RECURSION CALL STACK */}
        {activeTab === 'stack' && (
          <div className="space-y-1.5">
            {callStack.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                Call stack is empty (Execution terminated or idle).
              </p>
            ) : (
              [...callStack].reverse().map((frame, idx) => (
                <div
                  key={frame.id || idx}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono border ${
                    idx === 0
                      ? 'bg-amber-50 border-amber-200 text-amber-900 font-semibold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-sans">
                      {idx === 0 ? 'TOP' : `#${callStack.length - idx}`}
                    </span>
                    <span>
                      {frame.functionName}(<span className="text-slate-500">{frame.args}</span>)
                    </span>
                  </div>
                  {frame.returnValue && (
                    <span className="text-emerald-700 font-bold text-[11px]">
                      &rarr; {frame.returnValue}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: TRACE LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-1 font-mono text-[11px] select-text">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-4 text-center font-sans">
                No logs recorded yet.
              </p>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 py-1 px-2 rounded hover:bg-slate-50 text-slate-700 border-b border-slate-100/60 last:border-0"
                >
                  <span className="text-slate-400 text-[10px] shrink-0 mt-0.5">
                    [{idx + 1}]
                  </span>
                  <span className="leading-snug">{log}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
