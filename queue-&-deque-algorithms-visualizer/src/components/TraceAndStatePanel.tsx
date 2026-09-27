import React, { useState, useEffect, useRef } from 'react';
import { Code, Eye, Layers, ScrollText, Copy, Check } from 'lucide-react';
import { SimulationStep } from '../types';
import { CPP_SNIPPETS } from '../algorithms/cppSnippets';

interface TraceAndStatePanelProps {
  algorithmId: string;
  cppSnippetId: string;
  step: SimulationStep;
}

export const TraceAndStatePanel: React.FC<TraceAndStatePanelProps> = ({
  algorithmId,
  cppSnippetId,
  step,
}) => {
  const [activeTab, setActiveTab] = useState<'trace' | 'state' | 'stack' | 'logs'>('trace');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  const snippetLines = CPP_SNIPPETS[cppSnippetId] || ['// No code snippet loaded'];

  // Smoothly scroll active line into view when line changes
  useEffect(() => {
    if (activeTab === 'trace' && codeContainerRef.current) {
      const activeLineEl = codeContainerRef.current.querySelector('[data-active="true"]');
      if (activeLineEl) {
        activeLineEl.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [step.line, activeTab]);

  const handleCopyCode = () => {
    const fullCode = snippetLines.join('\n');
    navigator.clipboard.writeText(fullCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Helper to colorize C++ keywords dynamically
  const formatCppLine = (lineText: string) => {
    const keywords = [
      'class', 'private', 'public', 'int', 'bool', 'void', 'vector', 'stack', 'queue', 'deque',
      'unordered_map', 'priority_queue', 'return', 'if', 'else', 'while', 'for', 'double', 'const', 'true', 'false'
    ];

    let formatted = lineText;
    
    // Simple escape html
    formatted = formatted
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Highlight comments
    if (formatted.trim().startsWith('//')) {
      return <span className="text-slate-400 italic">{lineText}</span>;
    }

    // Highlight C++ types and control flow keywords
    const parts = formatted.split(/(\b\w+\b)/g);
    return (
      <span>
        {parts.map((part, index) => {
          if (keywords.includes(part)) {
            let col = 'text-blue-600 font-bold';
            if (['if', 'else', 'while', 'for', 'return'].includes(part)) {
              col = 'text-amber-700 font-bold';
            } else if (['class', 'public', 'private'].includes(part)) {
              col = 'text-violet-700 font-semibold';
            }
            return (
              <span key={index} className={col}>
                {part}
              </span>
            );
          }
          return part;
        })}
      </span>
    );
  };

  // Dedicated Card Widgets for Tab 2: Live State Inspector
  const renderLiveStateInspector = () => {
    switch (algorithmId) {
      case '01':
      case '02':
      case '03': {
        const capacity = step.capacity || 5;
        const count = step.count ?? ((step.rear ?? 0) - (step.front ?? 0));
        const isEmpty = count === 0;
        const isFull = count === capacity;
        return (
          <div className="space-y-3 font-mono">
            <h4 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider font-sans mb-1.5">
              Circular / Bounded Buffer Pointers
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                <div className="text-[9px] text-slate-400 uppercase font-sans">Front Pointer</div>
                <div className="text-sm font-extrabold text-emerald-700">{step.front ?? 0}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                <div className="text-[9px] text-slate-400 uppercase font-sans">Rear Pointer</div>
                <div className="text-sm font-extrabold text-blue-700">{step.rear ?? 0}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                <div className="text-[9px] text-slate-400 uppercase font-sans">Capacity (Slots)</div>
                <div className="text-sm font-extrabold text-slate-700">{capacity}</div>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                <div className="text-[9px] text-slate-400 uppercase font-sans">Elements count</div>
                <div className="text-sm font-extrabold text-slate-700">{count}</div>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">isEmpty() status:</span>
                <span className={`font-bold ${isEmpty ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {String(isEmpty).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-1.5">
                <span className="text-slate-400">isFull() status:</span>
                <span className={`font-bold ${isFull ? 'text-amber-400' : 'text-slate-500'}`}>
                  {String(isFull).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        );
      }
      case '04':
      case '05': {
        return (
          <div className="space-y-3 font-mono">
            <h4 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider font-sans mb-1.5">
              Dual Containers Status
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">InStack / Q1 Elements:</span>
                <span className="font-bold text-slate-800">
                  {step.stack1 ? step.stack1.length : step.queue1 ? step.queue1.length : 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-1.5">
                <span className="text-slate-500">OutStack / Q2 Elements:</span>
                <span className="font-bold text-slate-800">
                  {step.stack2 ? step.stack2.length : 0}
                </span>
              </div>
            </div>
          </div>
        );
      }
      case '06':
      case '07':
      case '08': {
        const leftVal = typeof step.windowL === 'number' && step.array ? step.array[step.windowL] : 'N/A';
        const rightVal = typeof step.windowR === 'number' && step.array ? step.array[step.windowR] : 'N/A';
        return (
          <div className="space-y-3 font-mono">
            <h4 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider font-sans mb-1.5">
              Sliding Window & Deque Inspector
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Active Window Range:</span>
                <span className="font-bold text-amber-800">
                  [{step.windowL ?? '?'}, {step.windowR ?? '?'}]
                </span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-1.5">
                <span className="text-slate-500">Left value [L]:</span>
                <span className="font-bold text-emerald-700">{leftVal}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-1.5">
                <span className="text-slate-500">Right value [R]:</span>
                <span className="font-bold text-blue-700">{rightVal}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-1.5">
                <span className="text-slate-500">Deque length:</span>
                <span className="font-bold text-slate-800">
                  {step.deque ? step.deque.length : step.maxDeque ? step.maxDeque.length : 0}
                </span>
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-lg p-2.5">
              <div className="text-[9px] text-slate-400 uppercase font-sans mb-1">
                Active Maximum / Best Answer
              </div>
              <div className="text-sm font-bold text-amber-400">
                {Array.isArray(step.ans) ? `[${step.ans.join(', ')}]` : step.ans ?? 'N/A'}
              </div>
            </div>
          </div>
        );
      }
      case '09':
      case '10':
      case '11': {
        return (
          <div className="space-y-3 font-mono">
            <h4 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider font-sans mb-1.5">
              Stream / Cache Operational State
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              {algorithmId === '09' && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Non-Repeating Queue:</span>
                  <span className="font-bold text-emerald-700">
                    {step.queue1 ? `[${step.queue1.join(', ')}]` : 'empty'}
                  </span>
                </div>
              )}
              {algorithmId === '10' && (
                <>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Cumulative Sum:</span>
                    <span className="font-bold text-amber-700">{step.sum ?? 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-1.5">
                    <span className="text-slate-500">Active Average:</span>
                    <span className="font-bold text-emerald-700">
                      {step.average ? step.average.toFixed(4) : '0.00'}
                    </span>
                  </div>
                </>
              )}
              {algorithmId === '11' && (
                <div className="text-xs">
                  <span className="text-slate-500 block mb-1">Revealed config:</span>
                  <span className="font-bold text-emerald-800">
                    {step.revealed ? `[${step.revealed.map((c) => (c === null ? '_' : c)).join(', ')}]` : '[]'}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      }
      case '12': {
        return (
          <div className="space-y-3 font-mono">
            <h4 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider font-sans mb-1.5">
              Rotting Oranges State
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Fresh Oranges Left:</span>
                <span className="font-bold text-emerald-700">{step.freshCount ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-1.5">
                <span className="text-slate-500">Elapsed Time:</span>
                <span className="font-bold text-amber-700">{step.minutes ?? 0} minutes</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-1.5">
                <span className="text-slate-500">BFS Queue size:</span>
                <span className="font-bold text-slate-800">{step.orangeQueue ? step.orangeQueue.length : 0}</span>
              </div>
            </div>
          </div>
        );
      }
      case '13': {
        return (
          <div className="space-y-3 font-mono">
            <h4 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider font-sans mb-1.5">
              Gas Station / Circular Balance
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Active Tank Fuel:</span>
                <span className="font-bold text-amber-700">{step.tank ?? 0} L</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-1.5">
                <span className="text-slate-500">Starting Candidate station:</span>
                <span className="font-bold text-emerald-700">Station {step.startCandidate ?? 0}</span>
              </div>
            </div>
          </div>
        );
      }
      case '14': {
        return (
          <div className="space-y-3 font-mono">
            <h4 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider font-sans mb-1.5">
              Task Scheduler Status
            </h4>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Elapsed CPU cycles:</span>
                <span className="font-bold text-slate-800">{step.time ?? 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-1.5">
                <span className="text-slate-500">Executed task list:</span>
                <span className="font-bold text-amber-700">
                  {step.scheduleResult ? `[${step.scheduleResult.join(', ')}]` : '[]'}
                </span>
              </div>
            </div>
          </div>
        );
      }
      default:
        return <div className="text-xs text-slate-400 italic">No inspector parameters active</div>;
    }
  };

  // Tab 3: Call Stack & Variables
  const renderCallStack = () => {
    return (
      <div className="space-y-3 font-mono text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Active Function Frame
          </span>
          <div className="bg-slate-900 text-slate-200 rounded-lg p-2.5 border border-slate-800">
            <div className="text-emerald-400 font-bold">
              {algorithmId === '01' && 'LinearQueue::enqueue(val)'}
              {algorithmId === '02' && 'MyCircularQueue::enQueue(val)'}
              {algorithmId === '03' && 'MyCircularDeque::insertFront(val)'}
              {algorithmId === '04' && 'MyQueue::push(val)'}
              {algorithmId === '05' && 'MyStack::push(val)'}
              {algorithmId === '06' && 'maxSlidingWindow(nums, k)'}
              {algorithmId === '07' && 'longestSubarray(nums, limit)'}
              {algorithmId === '08' && 'shortestSubarray(nums, k)'}
              {algorithmId === '09' && 'firstNonRepeating(A)'}
              {algorithmId === '10' && 'MovingAverage::next(val)'}
              {algorithmId === '11' && 'deckRevealedIncreasing(deck)'}
              {algorithmId === '12' && 'orangesRotting(grid)'}
              {algorithmId === '13' && 'canCompleteCircuit(gas, cost)'}
              {algorithmId === '14' && 'leastInterval(tasks, n)'}
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Parameters: <span className="text-amber-400 font-bold">line {step.line}</span>
            </div>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Local Variables Scope
          </span>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-1.5 text-[11px]">
            {algorithmId === '01' && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">front:</span>
                  <span className="font-bold text-slate-800">{step.front ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">rear:</span>
                  <span className="font-bold text-slate-800">{step.rear ?? 0}</span>
                </div>
              </>
            )}
            {['02', '03'].includes(algorithmId) && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">front:</span>
                  <span className="font-bold text-slate-800">{step.front ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">rear:</span>
                  <span className="font-bold text-slate-800">{step.rear ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">count:</span>
                  <span className="font-bold text-slate-800">{step.count ?? 0}</span>
                </div>
              </>
            )}
            {['06', '07', '08'].includes(algorithmId) && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">left:</span>
                  <span className="font-bold text-slate-800">{step.windowL ?? '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">right:</span>
                  <span className="font-bold text-slate-800">{step.windowR ?? '0'}</span>
                </div>
              </>
            )}
            {algorithmId === '12' && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">freshCount:</span>
                  <span className="font-bold text-slate-800">{step.freshCount ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">minutes:</span>
                  <span className="font-bold text-slate-800">{step.minutes ?? 0}</span>
                </div>
              </>
            )}
            {algorithmId === '13' && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">tank:</span>
                  <span className="font-bold text-slate-800">{step.tank ?? 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">startIdx:</span>
                  <span className="font-bold text-slate-800">{step.startCandidate ?? 0}</span>
                </div>
              </>
            )}
            {algorithmId === '14' && (
              <>
                <div className="flex justify-between">
                  <span className="text-slate-500">time:</span>
                  <span className="font-bold text-slate-800">{step.time ?? 0}</span>
                </div>
              </>
            )}
            <div className="flex justify-between border-t border-slate-100 pt-1">
              <span className="text-slate-500">stepIndex:</span>
              <span className="font-bold text-amber-600">{step.stepIndex}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Tab 4: Chronological Logs
  const renderLogs = () => {
    return (
      <div className="space-y-1 overflow-y-auto max-h-[190px] font-mono text-[10px] pr-1 leading-normal">
        {step.logs.length === 0 ? (
          <div className="text-slate-400 italic py-6 text-center">No simulation logs recorded</div>
        ) : (
          step.logs.map((log, index) => (
            <div
              key={index}
              className={`p-1.5 rounded transition-all ${
                index === step.logs.length - 1
                  ? 'bg-amber-500/15 border-l-2 border-amber-500 text-amber-900 font-bold'
                  : 'bg-slate-50 text-slate-500 border-l-2 border-slate-200'
              }`}
            >
              {log}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col h-full font-sans select-none">
      {/* Tab Switcher Headers */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-2.5 py-1 shrink-0">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveTab('trace')}
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'trace' ? 'text-amber-800 bg-white shadow-xxs border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>C++ Trace</span>
          </button>

          <button
            onClick={() => setActiveTab('state')}
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'state' ? 'text-amber-800 bg-white shadow-xxs border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>State</span>
          </button>

          <button
            onClick={() => setActiveTab('stack')}
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'stack' ? 'text-amber-800 bg-white shadow-xxs border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Stack</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1.5 rounded transition-all cursor-pointer ${
              activeTab === 'logs' ? 'text-amber-800 bg-white shadow-xxs border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span>Logs</span>
          </button>
        </div>

        {activeTab === 'trace' && (
          <button
            onClick={handleCopyCode}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            title="Copy C++ implementation"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Dynamic Tab Body */}
      <div className="p-3.5 flex-1 min-h-0 overflow-y-auto">
        {activeTab === 'trace' && (
          <div
            ref={codeContainerRef}
            className="font-mono text-[11px] text-slate-600 space-y-0.5 max-h-[195px] overflow-y-auto select-text"
          >
            {snippetLines.map((lineText, idx) => {
              const lineNum = idx + 1;
              const isActive = lineNum === step.line;

              return (
                <div
                  key={idx}
                  data-active={isActive ? 'true' : 'false'}
                  className={`flex items-center py-0.5 px-2 rounded transition-all ${
                    isActive
                      ? 'bg-amber-100/80 border-l-4 border-amber-500 text-slate-900 font-semibold'
                      : 'border-l-4 border-transparent hover:bg-slate-50'
                  }`}
                >
                  <span className="w-6 text-[10px] text-slate-400 select-none text-right mr-3">
                    {lineNum}
                  </span>
                  <span className="whitespace-pre">{formatCppLine(lineText)}</span>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'state' && renderLiveStateInspector()}

        {activeTab === 'stack' && renderCallStack()}

        {activeTab === 'logs' && renderLogs()}
      </div>
    </div>
  );
};
