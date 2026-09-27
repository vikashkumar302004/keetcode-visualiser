import React, { useState, useEffect, useRef } from 'react';
import { 
  Code2, 
  Eye, 
  Variable, 
  History, 
  Copy, 
  Check, 
  Terminal,
  Activity,
  Maximize2
} from 'lucide-react';
import { SimulationStep, ProblemDefinition } from '../types';
import { CPP_SNIPPETS } from '../algorithms/cppSnippets';

interface TraceAndStatePanelProps {
  problem: ProblemDefinition;
  step: SimulationStep | null;
  allSteps: SimulationStep[];
  currentStepIndex: number;
  onJumpToStep: (stepIndex: number) => void;
}

export const TraceAndStatePanel: React.FC<TraceAndStatePanelProps> = ({
  problem,
  step,
  allSteps,
  currentStepIndex,
  onJumpToStep
}) => {
  const [activeTab, setActiveTab] = useState<'trace' | 'inspector' | 'variables' | 'log'>('trace');
  const [copied, setCopied] = useState(false);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const snippet = CPP_SNIPPETS[problem.id] || { code: '', lines: [] };
  const currentLine = step?.codeLine ?? 1;

  // Auto-scroll active code line into view
  useEffect(() => {
    if (activeTab === 'trace' && codeContainerRef.current) {
      const activeEl = codeContainerRef.current.querySelector(`[data-line="${currentLine}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentLine, activeTab]);

  // Auto-scroll log to bottom on updates
  useEffect(() => {
    if (activeTab === 'log' && logContainerRef.current) {
      const activeLogEl = logContainerRef.current.querySelector(`[data-step="${currentStepIndex}"]`);
      if (activeLogEl) {
        activeLogEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentStepIndex, activeTab]);

  const handleCopyCode = () => {
    if (!snippet.code) return;
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 flex flex-col h-full shadow-2xs overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-2 pt-1.5 shrink-0 select-none">
        <div className="flex space-x-1">
          <button
            id="tab-btn-cpp-trace"
            onClick={() => setActiveTab('trace')}
            className={`px-3 py-1.5 rounded-t-md text-xs font-semibold flex items-center space-x-1.5 transition-colors border-t border-x ${
              activeTab === 'trace'
                ? 'bg-white border-slate-200 text-slate-900 border-b-transparent shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-amber-600" />
            <span>C++ Trace</span>
          </button>

          <button
            id="tab-btn-state-inspector"
            onClick={() => setActiveTab('inspector')}
            className={`px-3 py-1.5 rounded-t-md text-xs font-semibold flex items-center space-x-1.5 transition-colors border-t border-x ${
              activeTab === 'inspector'
                ? 'bg-white border-slate-200 text-slate-900 border-b-transparent shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/60'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Inspector</span>
          </button>

          <button
            id="tab-btn-variables"
            onClick={() => setActiveTab('variables')}
            className={`px-3 py-1.5 rounded-t-md text-xs font-semibold flex items-center space-x-1.5 transition-colors border-t border-x ${
              activeTab === 'variables'
                ? 'bg-white border-slate-200 text-slate-900 border-b-transparent shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/60'
            }`}
          >
            <Variable className="w-3.5 h-3.5 text-emerald-600" />
            <span>Variables</span>
          </button>

          <button
            id="tab-btn-log"
            onClick={() => setActiveTab('log')}
            className={`px-3 py-1.5 rounded-t-md text-xs font-semibold flex items-center space-x-1.5 transition-colors border-t border-x ${
              activeTab === 'log'
                ? 'bg-white border-slate-200 text-slate-900 border-b-transparent shadow-2xs'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/60'
            }`}
          >
            <History className="w-3.5 h-3.5 text-slate-600" />
            <span>Log ({allSteps.length})</span>
          </button>
        </div>

        {activeTab === 'trace' && (
          <button
            onClick={handleCopyCode}
            title="Copy standard C++ solution code"
            className="text-[11px] font-mono text-slate-500 hover:text-slate-800 flex items-center space-x-1 px-2 py-1 rounded hover:bg-slate-200/50 transition-colors mb-1"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        )}
      </div>

      {/* Tab Body */}
      <div className="flex-1 min-h-0 overflow-y-auto bg-white p-3">
        {/* Tab 1: C++ Trace */}
        {activeTab === 'trace' && (
          <div 
            ref={codeContainerRef}
            className="font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto select-text bg-[#FAF9F6] p-2 rounded-md border border-slate-200 text-slate-800"
          >
            {snippet.lines.map((line, idx) => {
              const lineNum = idx + 1;
              const isActive = lineNum === currentLine;

              return (
                <div
                  key={lineNum}
                  data-line={lineNum}
                  className={`flex items-start py-0.5 px-2 rounded-sm transition-colors ${
                    isActive
                      ? 'bg-amber-100 text-amber-950 font-semibold border-l-3 border-amber-500 shadow-2xs'
                      : 'hover:bg-slate-100/60'
                  }`}
                >
                  <span className="w-6 shrink-0 text-right pr-3 text-slate-400 select-none font-mono text-[10px]">
                    {lineNum}
                  </span>
                  <pre className="overflow-x-auto whitespace-pre font-mono">
                    {line}
                  </pre>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Live State Inspector */}
        {activeTab === 'inspector' && (
          <div className="space-y-3">
            {/* Pointer Coordinates Card */}
            <div className="p-2.5 rounded-md border border-slate-200 bg-slate-50/50">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Pointer Coordinates &amp; Bounds
              </span>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                <div className="bg-white p-2 rounded border border-slate-200 text-center">
                  <div className="text-[10px] text-indigo-700 font-bold uppercase">Left (L)</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {step?.left !== null ? step?.left : 'None'}
                  </div>
                </div>

                <div className="bg-white p-2 rounded border border-slate-200 text-center">
                  <div className="text-[10px] text-amber-700 font-bold uppercase">Right (R)</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {step?.right !== null ? step?.right : 'None'}
                  </div>
                </div>

                <div className="bg-white p-2 rounded border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-600 font-bold uppercase">Window Size</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">
                    {step && step.left !== null && step.right !== null && step.left <= step.right 
                      ? step.right - step.left + 1 
                      : 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Metric vs Target */}
            <div className="p-2.5 rounded-md border border-slate-200 bg-slate-50/50">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Condition Evaluation
              </span>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="bg-white p-2 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500">{step?.currentMetricLabel || 'Current Metric'}</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {step?.currentMetricValue ?? 'N/A'}
                  </div>
                </div>

                <div className="bg-white p-2 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-500">{step?.targetLabel || 'Target Condition'}</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    {step?.targetValue ?? 'N/A'}
                  </div>
                </div>
              </div>

              <div className="mt-2 text-xs flex items-center space-x-1.5">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                  step?.isValidWindow 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {step?.isValidWindow ? 'Condition Valid' : 'Condition Violated / Shrink Needed'}
                </span>
              </div>
            </div>

            {/* Best Result Record */}
            <div className="p-2.5 rounded-md border border-amber-200 bg-amber-50/30">
              <span className="text-[10px] font-semibold text-amber-900 uppercase tracking-wider block mb-1">
                Optimal Result Record
              </span>
              <div className="flex items-center justify-between font-mono">
                <div>
                  <span className="text-xs text-amber-800 block">{step?.bestResultLabel}:</span>
                  <span className="text-lg font-bold text-amber-950">{step?.bestResultValue}</span>
                </div>
                {step?.bestWindowRange && (
                  <div className="text-right text-xs text-amber-800">
                    <span className="text-[10px] text-amber-600 block">Subarray Range:</span>
                    <span className="font-bold">[{step.bestWindowRange[0]} ... {step.bestWindowRange[1]}]</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Call Stack & Variables */}
        {activeTab === 'variables' && (
          <div className="space-y-2">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Active Scope Variables (Step {currentStepIndex + 1})
            </div>
            {step?.variables && Object.keys(step.variables).length > 0 ? (
              <div className="border border-slate-200 rounded-md overflow-hidden">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] uppercase">
                    <tr>
                      <th className="py-1.5 px-3">Variable</th>
                      <th className="py-1.5 px-3">Type</th>
                      <th className="py-1.5 px-3">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(step.variables).map(([key, val]) => (
                      <tr key={key} className="hover:bg-slate-50/50">
                        <td className="py-1.5 px-3 font-semibold text-slate-900">{key}</td>
                        <td className="py-1.5 px-3 text-slate-500 text-[11px]">{typeof val}</td>
                        <td className="py-1.5 px-3 text-amber-900 font-bold">{String(val)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-xs text-slate-600 italic py-4 text-center">
                No local variables captured at this step.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Chronological Log */}
        {activeTab === 'log' && (
          <div ref={logContainerRef} className="space-y-1.5 text-xs font-mono">
            {allSteps.map((s, idx) => {
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={idx}
                  data-step={idx}
                  onClick={() => onJumpToStep(idx)}
                  className={`p-2 rounded-md border cursor-pointer transition-all ${
                    isCurrent
                      ? 'bg-amber-50 border-amber-300 text-amber-950 font-medium shadow-2xs ring-1 ring-amber-300'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5 text-[10px]">
                    <span className="font-bold text-slate-500">Step #{idx + 1}</span>
                    <span className="uppercase text-[9px] px-1.5 py-0.2 rounded font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      {s.action}
                    </span>
                  </div>
                  <div className="text-[11px] leading-snug">
                    {s.logMessage}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
