/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Code, Eye, Layers, Scroll, Copy, Check, Terminal } from 'lucide-react';
import { SimulationStep, AlgorithmId } from '../types';

interface TraceAndStatePanelProps {
  algorithmId: AlgorithmId;
  step: SimulationStep;
  cppCode: string;
}

type TabId = 'cpp' | 'state' | 'variables' | 'log';

export default function TraceAndStatePanel({ algorithmId, step, cppCode }: TraceAndStatePanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('cpp');
  const [isCopied, setIsCopied] = useState(false);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // Split lines
  const lines = cppCode.split('\n');

  // Copy C++ Code
  const handleCopy = () => {
    navigator.clipboard.writeText(cppCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Scroll active line into view smoothly
  useEffect(() => {
    if (activeTab === 'cpp' && codeContainerRef.current) {
      const activeLineElem = codeContainerRef.current.querySelector('[data-active="true"]');
      if (activeLineElem) {
        activeLineElem.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [step.line, activeTab]);

  const custom = step.customState || {};

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-[480px] overflow-hidden">
      {/* Segmented Tab Controls */}
      <div className="flex border-b border-slate-200 bg-slate-50 p-1">
        <button
          onClick={() => setActiveTab('cpp')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'cpp'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>C++ Trace</span>
        </button>

        <button
          onClick={() => setActiveTab('state')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'state'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live State</span>
        </button>

        <button
          onClick={() => setActiveTab('variables')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'variables'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Variables</span>
        </button>

        <button
          onClick={() => setActiveTab('log')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'log'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Scroll className="w-3.5 h-3.5" />
          <span>Log</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-4 text-xs">
        {/* Tab 1: C++ Trace */}
        {activeTab === 'cpp' && (
          <div className="relative h-full flex flex-col font-mono" ref={codeContainerRef}>
            <button
              onClick={handleCopy}
              className="absolute top-0 right-0 p-1.5 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors z-10"
              title="Copy snippet"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <div className="overflow-x-auto pb-4 pr-10 flex-1 scrollbar-thin">
              {lines.map((codeLine, idx) => {
                const lineNum = idx + 1;
                // Highlight line if it matches step.line (handle 1-indexed comparison)
                const isActive = step.line === lineNum;

                return (
                  <div
                    key={lineNum}
                    data-active={isActive}
                    className={`flex items-start py-0.5 px-2 rounded-md transition-all ${
                      isActive ? 'bg-amber-50 border-l-2 border-amber-500 font-semibold' : ''
                    }`}
                  >
                    <span className="w-6 shrink-0 text-slate-400 select-none text-[10px] pr-2 text-right">
                      {lineNum}
                    </span>
                    <span
                      className={`whitespace-pre text-[11px] ${
                        isActive ? 'text-amber-950' : 'text-slate-700'
                      }`}
                    >
                      {codeLine}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Live State Inspector */}
        {activeTab === 'state' && (
          <div className="space-y-4 animate-fadeIn">
            <h4 className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] font-mono border-b border-slate-100 pb-1.5">
              Live Algorithmic State Markers
            </h4>

            {algorithmId === 'next-permutation' && (
              <div className="space-y-2.5">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pivot Index (i):</span>
                    <span className="font-bold text-indigo-700">{step.pointers.i !== -1 ? step.pointers.i : 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Successor Index (j):</span>
                    <span className="font-bold text-amber-700">{step.pointers.j ?? 'Searching...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Suffix Reversal Range:</span>
                    <span className="font-bold text-emerald-700">
                      [{step.pointers.i !== null && step.pointers.i !== undefined ? step.pointers.i + 1 : '0'} ... {step.array.length - 1}]
                    </span>
                  </div>
                </div>
              </div>
            )}

            {algorithmId === 'boyer-moore' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Candidate Element:</span>
                  <span className="font-bold text-amber-800">{custom.candidate !== null ? custom.candidate : 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Consensus Count:</span>
                  <span className="font-bold text-slate-800">{custom.count ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Boyer-Moore Phase:</span>
                  <span className="font-bold text-indigo-600">{custom.phase ?? 'Scanning'}</span>
                </div>
              </div>
            )}

            {algorithmId === 'merge-sorted' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">nums1 Pointer (p1):</span>
                  <span className="font-bold text-indigo-700">{step.pointers.p1 ?? 'Exhausted'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">nums2 Pointer (p2):</span>
                  <span className="font-bold text-amber-700">{step.pointers.p2 ?? 'Exhausted'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Pointer (p):</span>
                  <span className="font-bold text-emerald-700">{step.pointers.p ?? 'Exhausted'}</span>
                </div>
              </div>
            )}

            {algorithmId === 'rotate-array' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Current Step Phase:</span>
                  <span className="font-bold text-amber-800">{custom.phase ?? 'Initializing'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Left Reverse Pointer:</span>
                  <span className="font-bold text-indigo-700">{step.pointers.left ?? 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Right Reverse Pointer:</span>
                  <span className="font-bold text-emerald-700">{step.pointers.right ?? 'None'}</span>
                </div>
              </div>
            )}

            {algorithmId === 'plus-one' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Digit Cursor (i):</span>
                  <span className="font-bold text-indigo-700">{step.pointers.i ?? 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Carry Flag:</span>
                  <span className="font-bold text-amber-700">+{custom.carry ?? 0}</span>
                </div>
              </div>
            )}

            {/* Default Generic State Card if problem doesn't have custom card */}
            {!['next-permutation', 'boyer-moore', 'merge-sorted', 'rotate-array', 'plus-one'].includes(algorithmId) && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 font-mono">
                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Active Variables</span>
                {Object.entries(step.pointers).map(([name, val]) => (
                  <div key={name} className="flex justify-between text-xs">
                    <span className="text-slate-500">{name}:</span>
                    <span className="font-semibold text-slate-800">{val !== null ? val : 'null'}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between font-mono">
              <span className="text-slate-400">Current Element Layout:</span>
              <span className="font-bold text-slate-800">[{step.array.join(', ')}]</span>
            </div>
          </div>
        )}

        {/* Tab 3: Call Stack & Variables */}
        {activeTab === 'variables' && (
          <div className="space-y-4 animate-fadeIn font-mono">
            <h4 className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5 flex items-center justify-between">
              <span>Stack Frame Variables</span>
              <span className="text-[9px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                Local Scope
              </span>
            </h4>

            {Object.keys(step.variables).length === 0 ? (
              <div className="text-slate-400 italic text-center py-6">
                No active loop variables inside local stack frame.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {Object.entries(step.variables).map(([name, val]) => (
                  <div
                    key={name}
                    className="flex justify-between items-center p-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <span className="font-bold text-slate-600">{name}</span>
                    <span className="bg-white border border-slate-200 px-2.5 py-0.5 rounded-md font-semibold text-indigo-700 text-xs">
                      {val === true ? 'true' : val === false ? 'false' : val ?? 'NULL'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Chronological Log */}
        {activeTab === 'log' && (
          <div className="space-y-3 animate-fadeIn font-mono flex flex-col h-full">
            <h4 className="font-semibold text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              Runtime Execution Log
            </h4>

            <div className="space-y-2 flex-1 overflow-y-auto max-h-[360px] pr-1.5">
              {step.logs.length === 0 ? (
                <div className="text-slate-400 italic text-center py-6">
                  No logs recorded. Initialize or step through the simulation.
                </div>
              ) : (
                step.logs.map((log, idx) => (
                  <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] leading-relaxed text-slate-600">
                    <span className="text-amber-800 font-bold select-none mr-1.5">[{idx + 1}]</span>
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
