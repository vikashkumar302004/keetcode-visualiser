import React, { useEffect, useRef, useState } from 'react';
import {
  Terminal,
  Compass,
  Layers,
  Activity,
  Copy,
  Check,
  CheckCircle2,
  XCircle,
  Split,
  ListTree,
  ArrowRightLeft,
  Target,
  TrendingUp,
  Shuffle,
  Sparkles,
} from 'lucide-react';
import { CallStackFrame } from '../types';

interface TraceAndStatePanelProps {
  cppCode: string;
  activeLine: number;
  algorithmTitle: string;
  activeLineDesc?: string;
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
  twoSumState?: {
    target: number;
    leftVal?: number;
    rightVal?: number;
    currentSum?: number;
    found: boolean;
    pair?: [number, number];
  };
  greaterSumState?: {
    runningSum: number;
    currentNodeVal?: number;
    newCumulativeVal?: number;
  };
  recoverBSTState?: {
    firstVal?: number;
    secondVal?: number;
    prevVal?: number;
    phase: 'detecting' | 'swapping' | 'done';
  };
  closestValueState?: {
    target: number;
    closestVal: number;
    minDiff: number;
    currentDiff?: number;
  };
}

export const TraceAndStatePanel: React.FC<TraceAndStatePanelProps> = ({
  cppCode,
  activeLine,
  algorithmTitle,
  activeLineDesc,
  callStack,
  logs,
  bounds,
  inorderSuccessorTrace,
  rangeSumState,
  kthState,
  lcaState,
  twoSumState,
  greaterSumState,
  recoverBSTState,
  closestValueState,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'inspector' | 'stack' | 'logs'>('code');
  const [copied, setCopied] = useState<boolean>(false);
  const activeLineRef = useRef<HTMLTableRowElement>(null);
  const consoleContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll active code line into view smoothly
  useEffect(() => {
    if (activeTab === 'code' && activeLineRef.current && consoleContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeLine, activeTab]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cppCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = cppCode.split('\n');

  // Syntax highlighter for C++
  const highlightCpp = (lineText: string) => {
    const trimmed = lineText.trim();
    if (trimmed.startsWith('//')) {
      return <span className="text-slate-400 italic">{lineText}</span>;
    }

    const tokens = lineText.split(
      /(\b(?:TreeNode|nullptr|int|bool|void|const|vector|delete|new|return|if|else|while|long|minVal|maxVal|low|high|key|val|root|left|right|mid|suc|pre|succ|temp)\b|[()\-+><=;,*{}.&])/g
    );

    return tokens.map((token, i) => {
      if (!token) return null;
      if (['TreeNode', 'int', 'bool', 'void', 'long', 'vector'].includes(token)) {
        return <span key={i} className="text-blue-600 font-semibold">{token}</span>;
      }
      if (['nullptr', 'true', 'false'].includes(token)) {
        return <span key={i} className="text-purple-600 font-semibold">{token}</span>;
      }
      if (['if', 'else', 'return', 'while', 'new', 'delete', 'const'].includes(token)) {
        return <span key={i} className="text-rose-600 font-medium">{token}</span>;
      }
      if (['root', 'left', 'right', 'succ', 'temp', 'pre', 'suc'].includes(token)) {
        return <span key={i} className="text-indigo-600">{token}</span>;
      }
      if (/^\d+$/.test(token)) {
        return <span key={i} className="text-amber-700 font-semibold">{token}</span>;
      }
      if (['->', '*', '&'].includes(token)) {
        return <span key={i} className="text-amber-600 font-bold">{token}</span>;
      }
      return <span key={i} className="text-slate-800">{token}</span>;
    });
  };

  const hasActiveInspectorData = Boolean(
    bounds ||
      inorderSuccessorTrace ||
      rangeSumState ||
      kthState ||
      lcaState ||
      twoSumState ||
      greaterSumState ||
      recoverBSTState ||
      closestValueState
  );

  return (
    <div className="flex flex-col h-[460px] lg:h-[490px] bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
      {/* Top Tab Bar Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          {/* Tab 1: C++ Code */}
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>C++ Trace</span>
            <span className="text-[10px] bg-white/20 text-slate-200 px-1 rounded font-mono">
              L{activeLine}
            </span>
          </button>

          {/* Tab 2: Live Inspector / Bounds */}
          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'inspector'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Inspector</span>
            {hasActiveInspectorData && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
          </button>

          {/* Tab 3: Call Stack */}
          <button
            onClick={() => setActiveTab('stack')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'stack'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Call Stack</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-1 rounded-full">
              {callStack.length}
            </span>
          </button>

          {/* Tab 4: Logs */}
          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'logs'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Logs</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 font-mono px-1 rounded-full">
              {logs.length}
            </span>
          </button>
        </div>

        {/* Copy button (for Code tab) */}
        {activeTab === 'code' && (
          <button
            onClick={handleCopy}
            title="Copy C++ Snippet"
            className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded px-2 py-0.5 transition-colors cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
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

      {/* Active Line Description Banner (shown across all tabs for continuous context) */}
      {activeLineDesc && (
        <div className="bg-amber-50/90 border-b border-amber-200/60 px-3 py-1.5 text-xs text-amber-950 flex items-start gap-2 shrink-0">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-snug truncate">
            <span className="font-semibold font-mono text-[11px] text-amber-800 mr-1.5">
              Line {activeLine}:
            </span>
            <span className="font-sans text-[11px]">{activeLineDesc}</span>
          </div>
        </div>
      )}

      {/* Tab Content Panels */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* TAB 1: C++ CODE CONSOLE */}
        {activeTab === 'code' && (
          <div
            ref={consoleContainerRef}
            className="flex-1 overflow-y-auto overflow-x-auto p-3 font-mono text-xs leading-5.5 select-text"
          >
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((lineText, idx) => {
                  const lineNum = idx + 1;
                  const isCurrent = lineNum === activeLine;

                  return (
                    <tr
                      key={lineNum}
                      ref={isCurrent ? activeLineRef : null}
                      className={`transition-colors duration-100 ${
                        isCurrent
                          ? 'bg-amber-100/75 font-medium'
                          : 'hover:bg-slate-50/70'
                      }`}
                    >
                      <td className="w-9 pr-2 select-none text-right align-top py-0.5">
                        <div className="flex items-center justify-end gap-1">
                          {isCurrent ? (
                            <span className="text-amber-600 font-bold text-[9px] animate-pulse">
                              ▶
                            </span>
                          ) : (
                            <span className="w-1.5" />
                          )}
                          <span
                            className={`text-[11px] ${
                              isCurrent ? 'text-amber-900 font-bold' : 'text-slate-400'
                            }`}
                          >
                            {lineNum}
                          </span>
                        </div>
                      </td>
                      <td className="pl-2 pr-3 whitespace-pre font-mono py-0.5 align-top">
                        {highlightCpp(lineText)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: ALGORITHM INSPECTOR */}
        {activeTab === 'inspector' && (
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* Range Boundary Constraints */}
            {bounds && (
              <div className="bg-[#FAF9F6] border border-slate-200 rounded-xl p-3">
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
                          Valid
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Violated
                        </>
                      )}
                    </span>
                  )}
                </div>
                <div className="relative mt-2 mb-1">
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden flex">
                    <div className="w-full bg-blue-500/80 rounded-full" />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-600 mt-1.5">
                    <span>Min: <strong className="text-slate-900">{bounds.min}</strong></span>
                    {bounds.currentVal !== undefined && (
                      <span className="text-amber-900 bg-amber-100 px-1.5 rounded font-bold">
                        Node: {bounds.currentVal}
                      </span>
                    )}
                    <span>Max: <strong className="text-slate-900">{bounds.max}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Inorder Successor Resolution (Case 3 Deletion) */}
            {inorderSuccessorTrace && (
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-purple-950 flex items-center gap-1.5">
                    <ListTree className="w-3.5 h-3.5 text-purple-600" />
                    Inorder Successor Resolution
                  </span>
                  <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.2 rounded font-semibold uppercase">
                    {inorderSuccessorTrace.phase}
                  </span>
                </div>
                <p className="text-xs text-purple-900 leading-relaxed font-sans">
                  {inorderSuccessorTrace.details}
                </p>
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-purple-200/60 text-xs font-mono">
                  <span>Target: <strong className="text-purple-950">{inorderSuccessorTrace.targetVal}</strong></span>
                  {inorderSuccessorTrace.successorVal !== undefined && (
                    <span>Successor: <strong className="text-emerald-700">{inorderSuccessorTrace.successorVal}</strong></span>
                  )}
                </div>
              </div>
            )}

            {/* Range Sum Accumulator */}
            {rangeSumState && (
              <div className="bg-[#FAF9F6] border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-800">
                    Range Accumulator [{rangeSumState.low} ... {rangeSumState.high}]
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                    Sum: {rangeSumState.currentSum}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  <span>Elements: </span>
                  <span className="font-mono text-slate-800 font-medium">
                    {rangeSumState.includedValues.length > 0
                      ? rangeSumState.includedValues.join(' + ')
                      : 'None yet'}
                  </span>
                </div>
              </div>
            )}

            {/* K-th Element Counter */}
            {kthState && (
              <div className="bg-[#FAF9F6] border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-800">
                    K-th {kthState.mode === 'smallest' ? 'Smallest' : 'Largest'} Counter
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                    Count: {kthState.count} / {kthState.k}
                  </span>
                </div>
                <div className="text-xs text-slate-600">
                  {kthState.foundVal !== undefined ? (
                    <span className="text-emerald-700 font-bold">
                      Found target: Node [{kthState.foundVal}]
                    </span>
                  ) : (
                    <span>
                      Current node: {kthState.currentVal !== undefined ? `[${kthState.currentVal}]` : 'traversing...'}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* LCA State */}
            {lcaState && (
              <div className="bg-[#FAF9F6] border border-slate-200 rounded-xl p-3">
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
                    <span>Current traversal: node [{lcaState.currentVal}]</span>
                  )}
                </div>
              </div>
            )}

            {/* Two Sum IV State */}
            {twoSumState && (
              <div className="bg-[#FAF9F6] border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-indigo-600" />
                    Two Sum Target Pair (k = {twoSumState.target})
                  </span>
                  {twoSumState.found ? (
                    <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                      <Check className="w-3 h-3" /> Pair Found!
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Searching...
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-200/60 font-mono">
                  <span>Left: <strong className="text-indigo-700">{twoSumState.leftVal ?? '-'}</strong></span>
                  <span className="text-slate-400">+</span>
                  <span>Right: <strong className="text-indigo-700">{twoSumState.rightVal ?? '-'}</strong></span>
                  <span className="text-slate-400">=</span>
                  <span>Sum: <strong className={twoSumState.currentSum === twoSumState.target ? 'text-emerald-700 font-bold' : 'text-slate-800'}>{twoSumState.currentSum ?? '-'}</strong></span>
                </div>
                {twoSumState.pair && (
                  <div className="mt-2 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                    Pair: [{twoSumState.pair[0]}, {twoSumState.pair[1]}] sum to {twoSumState.target}
                  </div>
                )}
              </div>
            )}

            {/* Greater Sum Tree State */}
            {greaterSumState && (
              <div className="bg-[#FAF9F6] border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                    Reverse In-Order Accumulator
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                    Running Sum: {greaterSumState.runningSum}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-sans mt-1">
                  Traversing Right &rarr; Root &rarr; Left. Each node key is updated to include all strictly greater values.
                </p>
                {greaterSumState.currentNodeVal !== undefined && (
                  <div className="flex items-center gap-2 text-xs font-mono mt-2 pt-2 border-t border-slate-200/60">
                    <span className="text-slate-500">Node transformed:</span>
                    <span className="text-slate-700 font-semibold">[{greaterSumState.currentNodeVal}]</span>
                    <span>&rarr;</span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      [{greaterSumState.newCumulativeVal}]
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Recover BST State */}
            {recoverBSTState && (
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-purple-950 flex items-center gap-1.5">
                    <Shuffle className="w-3.5 h-3.5 text-purple-600" />
                    Inversion Violation Detector (LeetCode #99)
                  </span>
                  <span className="text-[10px] font-mono bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-semibold uppercase">
                    {recoverBSTState.phase}
                  </span>
                </div>
                <p className="text-xs text-purple-900 leading-relaxed font-sans">
                  Detects where <code className="font-mono bg-white/70 px-1 rounded text-purple-950">prev-&gt;val &gt; curr-&gt;val</code> during in-order traversal, then restores BST properties via swap.
                </p>
                <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-purple-200/60 text-xs font-mono">
                  <span>First: <strong className="text-purple-950">{recoverBSTState.firstVal !== undefined ? `[${recoverBSTState.firstVal}]` : 'pending'}</strong></span>
                  <span>Second: <strong className="text-purple-950">{recoverBSTState.secondVal !== undefined ? `[${recoverBSTState.secondVal}]` : 'pending'}</strong></span>
                </div>
              </div>
            )}

            {/* Closest Value State */}
            {closestValueState && (
              <div className="bg-[#FAF9F6] border border-slate-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-blue-600" />
                    Closest Value Target: {closestValueState.target}
                  </span>
                  <span className="text-xs font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                    Closest: [{closestValueState.closestVal}]
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-200/60 font-mono">
                  <span>Min Diff: <strong className="text-emerald-700">{closestValueState.minDiff}</strong></span>
                  {closestValueState.currentDiff !== undefined && (
                    <span>Current Diff: <strong className="text-slate-700">{closestValueState.currentDiff}</strong></span>
                  )}
                </div>
              </div>
            )}

            {!hasActiveInspectorData && (
              <div className="text-center py-10 text-slate-400 text-xs font-sans">
                <Compass className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>Run or step through the simulation to view real-time state inspections.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CALL STACK */}
        {activeTab === 'stack' && (
          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {callStack.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-8 text-center font-sans">
                Call stack is empty (Idle or returned).
              </p>
            ) : (
              [...callStack].reverse().map((frame, idx) => (
                <div
                  key={frame.id || idx}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-mono border ${
                    idx === 0
                      ? 'bg-amber-50 border-amber-200 text-amber-900 font-semibold'
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

        {/* TAB 4: TRACE LOGS */}
        {activeTab === 'logs' && (
          <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] select-text space-y-1">
            {logs.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-8 text-center font-sans">
                No logs recorded yet.
              </p>
            ) : (
              logs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 py-0.5 px-1.5 rounded hover:bg-slate-50 text-slate-700 border-b border-slate-100 last:border-0"
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

      {/* Footer Info */}
      <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex items-center justify-between shrink-0 font-sans">
        <span className="truncate">Procedure: <strong className="text-slate-800 font-mono">{algorithmTitle}</strong></span>
        <span>Line {activeLine} of {lines.length}</span>
      </div>
    </div>
  );
};
