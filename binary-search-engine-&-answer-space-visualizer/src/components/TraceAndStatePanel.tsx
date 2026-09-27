/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Problem, SimulationStep } from '../types';
import { CPP_SNIPPETS } from '../algorithms/cppSnippets';
import { Code, Eye, Layers, ListTodo, Copy, Check } from 'lucide-react';

interface TraceAndStatePanelProps {
  problem: Problem;
  step: SimulationStep;
  steps: SimulationStep[];
  currentStepIndex: number;
}

export default function TraceAndStatePanel({
  problem,
  step,
  steps,
  currentStepIndex
}: TraceAndStatePanelProps) {
  const [activeTab, setActiveTab] = useState<'cpp' | 'inspector' | 'variables' | 'log'>('cpp');
  const [copied, setCopied] = useState(false);
  const snippet = CPP_SNIPPETS[problem.id] || { code: '', lines: [] };
  const lineContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll C++ active line into view
  useEffect(() => {
    if (lineContainerRef.current) {
      const activeElement = lineContainerRef.current.querySelector('[data-active="true"]');
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }
  }, [step.line, activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const remainingSize = Math.max(0, step.high - step.low + 1);

  // Parse variables for clean presentation
  const variablesList = Object.entries(step.variables || {});

  // Build sequential logs up to current step
  const logs = steps.slice(0, currentStepIndex + 1).map((s, idx) => ({
    stepNum: idx + 1,
    desc: s.description,
    line: s.line
  }));

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col gap-4 font-sans h-full min-h-0">
      {/* Tab Selectors */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-md">
        <button
          onClick={() => setActiveTab('cpp')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'cpp'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>C++ Trace</span>
        </button>

        <button
          onClick={() => setActiveTab('inspector')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'inspector'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>State Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('variables')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'variables'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Variables</span>
        </button>

        <button
          onClick={() => setActiveTab('log')}
          className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'log'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <ListTodo className="w-3.5 h-3.5" />
          <span>Chronology</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto border border-slate-100 rounded bg-slate-50 p-3">
        {/* TAB 1: C++ TRACE */}
        {activeTab === 'cpp' && (
          <div className="relative h-full flex flex-col gap-3 font-mono text-[11px]">
            <div className="flex justify-between items-center text-slate-400 border-b border-slate-200/60 pb-2">
              <span>Canonical C++ Template</span>
              <button
                onClick={handleCopy}
                className="hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
                title="Copy code snippet"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div
              ref={lineContainerRef}
              className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-200 select-text"
            >
              {snippet.lines.map((lineText, lineIdx) => {
                const oneIndexedLine = lineIdx + 1;
                const isCurrent = oneIndexedLine === step.line;

                return (
                  <div
                    key={lineIdx}
                    data-active={isCurrent ? 'true' : 'false'}
                    className={`flex items-start gap-3 py-1 px-2 rounded transition-all ${
                      isCurrent
                        ? 'bg-amber-100/80 border-l-4 border-amber-500 font-bold text-slate-900 shadow-sm'
                        : 'text-slate-600 border-l-4 border-transparent'
                    }`}
                  >
                    <span className="text-slate-300 select-none w-5 text-right font-light">
                      {oneIndexedLine}
                    </span>
                    <pre className="whitespace-pre-wrap flex-1">{lineText}</pre>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE STATE INSPECTOR */}
        {activeTab === 'inspector' && (
          <div className="flex flex-col gap-4 font-sans text-xs">
            {/* Coordinate cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white border border-slate-200 rounded p-3 flex flex-col justify-between shadow-sm">
                <span className="text-slate-500 font-medium">Pointer Coordinates</span>
                <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-700">
                  <div className="flex justify-between">
                    <span>low:</span>
                    <span className="font-bold text-indigo-600">{step.low}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>mid:</span>
                    <span className="font-bold text-amber-600">{step.mid !== null ? step.mid : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>high:</span>
                    <span className="font-bold text-amber-800">{step.high}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded p-3 flex flex-col justify-between shadow-sm">
                <span className="text-slate-500 font-medium">Search Space Status</span>
                <div className="mt-2 space-y-1 font-mono text-[11px] text-slate-700">
                  <div className="flex justify-between">
                    <span>Active Size:</span>
                    <span className="font-bold text-slate-800">{remainingSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ans Saved:</span>
                    <span className="font-bold text-emerald-600">{step.ans !== null ? step.ans : 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Found:</span>
                    <span className="font-bold text-slate-800">{step.found ? 'YES' : 'NO'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rotated array specific details */}
            {(problem.category === 'Rotated & Mountain Arrays') && (
              <div className="bg-white border border-slate-200 rounded p-3 shadow-sm space-y-2">
                <span className="font-semibold text-slate-700 block">Rotation Metrics</span>
                <div className="text-[11px] font-mono text-slate-600 space-y-1.5">
                  <div className="flex justify-between">
                    <span>nums[low] &lt;= nums[mid]:</span>
                    <span className="font-bold text-amber-700">
                      {step.variables.isLeftSorted !== undefined ? step.variables.isLeftSorted : 'N/A'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans pt-1">
                    In a rotated sorted array, checking which half is sorted helps determine if the target lies within its boundaries.
                  </p>
                </div>
              </div>
            )}

            {/* Answer-based specific descriptions */}
            {(problem.category === 'Binary Search on Answer') && (
              <div className="bg-white border border-slate-200 rounded p-3 shadow-sm space-y-1">
                <span className="font-semibold text-slate-700 block">Monotonic Feasibility</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  The decision space is monotonic: once an answer is feasible, all larger (or smaller) speeds/capacities are also feasible. This allows binary search on the answer value space.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: VARIABLES */}
        {activeTab === 'variables' && (
          <div className="font-mono text-[11px] flex flex-col gap-3 h-full">
            <span className="text-slate-400 font-sans text-xs">Live Memory Table</span>
            <div className="bg-white border border-slate-200 rounded shadow-sm divide-y divide-slate-100 flex-1 overflow-y-auto">
              {variablesList.length > 0 ? (
                variablesList.map(([key, val]) => (
                  <div key={key} className="flex justify-between p-2.5 hover:bg-slate-50/50">
                    <span className="text-slate-500">{key}</span>
                    <span className="font-bold text-slate-800">
                      {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 italic font-sans text-xs">
                  No loop variables recorded for this step.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: CHRONOLOGY LOG */}
        {activeTab === 'log' && (
          <div className="flex flex-col gap-3 h-full font-sans text-xs">
            <span className="text-slate-400">Step Timeline Log ({logs.length})</span>
            <div className="flex-1 overflow-y-auto bg-slate-900 border border-slate-800 text-slate-200 rounded p-3.5 font-mono text-[10.5px] leading-relaxed space-y-2.5">
              {logs.map((log) => (
                <div key={log.stepNum} className="border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                  <div className="flex justify-between text-amber-500 text-[10px] mb-1">
                    <span>&gt; STEP {log.stepNum}</span>
                    <span className="opacity-60">Line {log.line}</span>
                  </div>
                  <p className="text-slate-300">{log.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
