import React, { useState, useEffect, useRef } from 'react';
import { Code2, Compass, Cpu, History, ClipboardCheck, Copy, ArrowRight } from 'lucide-react';
import { Problem, SimulationStep } from '../types';
import { cppSnippets } from '../algorithms/cppSnippets';

interface TraceAndStatePanelProps {
  problem: Problem;
  step: SimulationStep;
  allSteps: SimulationStep[];
  currentStepIndex: number;
}

type TabId = 'trace' | 'inspector' | 'variables' | 'log';

export default function TraceAndStatePanel({
  problem,
  step,
  allSteps,
  currentStepIndex,
}: TraceAndStatePanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('trace');
  const [copied, setCopied] = useState(false);
  const codeContainerRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const codeString = cppSnippets[problem.id] || '// No trace code available';
  const codeLines = codeString.split('\n');

  // Copy code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Smooth scroll active line into view
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [step.line]);

  // Fast custom C++ syntax highlighter
  const highlightCppLine = (lineText: string) => {
    const keywords = ['if', 'else', 'while', 'for', 'return', 'continue', 'break', 'swap'];
    const types = ['int', 'bool', 'void', 'vector', 'string', 'char', 'long', 'ListNode', 'double'];

    // Escape HTML first
    let escaped = lineText
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Highlight comments
    if (escaped.trim().startsWith('//')) {
      return `<span class="text-slate-400 italic">${escaped}</span>`;
    }

    // Highlight numbers FIRST to avoid matching digits inside class names of injected HTML tags
    escaped = escaped.replace(/\b(\d+)\b/g, '<span class="text-amber-600 font-bold">$1</span>');

    // Highlight keywords
    keywords.forEach((kw) => {
      const reg = new RegExp(`\\b${kw}\\b`, 'g');
      escaped = escaped.replace(reg, `<span class="text-amber-700 font-bold">${kw}</span>`);
    });

    // Highlight types
    types.forEach((t) => {
      const reg = new RegExp(`\\b${t}\\b`, 'g');
      escaped = escaped.replace(reg, `<span class="text-indigo-600 font-semibold">${t}</span>`);
    });

    return escaped;
  };

  // Problem-specific Inspector content
  const renderInspectorContent = () => {
    const isTwoSum = problem.id === 'two-sum-ii';
    const isPalindrome = problem.id === 'valid-palindrome';
    const isWater = problem.id === 'container-with-most-water';
    const isTrapping = problem.id === 'trapping-rain-water';
    const isKadane = problem.category === 'kadane';
    const isCircularKadane = problem.id === 'maximum-sum-circular-subarray';

    if (isTwoSum) {
      const lVal = step.left !== undefined ? step.array[step.left] : '?';
      const rVal = step.right !== undefined ? step.array[step.right] : '?';
      const sum = step.currentSum ?? 0;
      const target = step.target ?? 0;
      const decision = sum === target ? 'MATCH' : sum < target ? 'Sum < Target : Move L++' : 'Sum > Target : Move R--';

      return (
        <div className="flex flex-col gap-3 font-sans">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Sorted Inward Convergence</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 font-bold block">Left (L) Pointer</span>
              <span className="text-sm font-mono font-bold text-indigo-700">Index {step.left ?? '-'}</span>
              <span className="text-xs text-slate-500 block">Value: {lVal}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 font-bold block">Right (R) Pointer</span>
              <span className="text-sm font-mono font-bold text-amber-700">Index {step.right ?? '-'}</span>
              <span className="text-xs text-slate-500 block">Value: {rVal}</span>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex flex-col gap-1.5 mt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-600 font-semibold">Active Formula:</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-amber-100 font-bold text-amber-800">
                {lVal} + {rVal} = {sum}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs border-t border-amber-200/50 pt-1.5 mt-1">
              <span className="text-slate-600 font-semibold">Comparison:</span>
              <span className="font-mono font-bold text-slate-800">
                {sum} vs target {target}
              </span>
            </div>
            <div className="text-xs font-bold text-amber-900 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>
              Decision: <span className="font-mono">{decision}</span>
            </div>
          </div>
        </div>
      );
    }

    if (isWater) {
      const lHeight = step.left !== undefined ? Number(step.array[step.left]) : 0;
      const rHeight = step.right !== undefined ? Number(step.array[step.right]) : 0;
      const width = step.right !== undefined && step.left !== undefined ? step.right - step.left : 0;
      const area = step.currentArea ?? 0;
      const mArea = step.maxArea ?? 0;

      return (
        <div className="flex flex-col gap-3 font-sans">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Greedy Boundary Analysis</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 font-bold block">Left Height h[L]</span>
              <span className="text-sm font-mono font-bold text-indigo-700">{lHeight}</span>
              <span className="text-[9px] text-slate-400 block">Pointer Index {step.left}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 font-bold block">Right Height h[R]</span>
              <span className="text-sm font-mono font-bold text-amber-700">{rHeight}</span>
              <span className="text-[9px] text-slate-400 block">Pointer Index {step.right}</span>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex flex-col gap-1 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-slate-600">Width (R - L):</span>
              <span className="font-bold text-slate-800">{width}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-slate-600">Min Wall Height:</span>
              <span className="font-bold text-slate-800">{Math.min(lHeight, rHeight)}</span>
            </div>
            <div className="flex justify-between font-mono border-t border-amber-200/50 pt-1.5 mt-1.5 text-slate-900 font-bold">
              <span>Current Area:</span>
              <span>{area}</span>
            </div>
            <div className="flex justify-between font-mono text-emerald-800 font-extrabold">
              <span>Max Area Found:</span>
              <span>{mArea}</span>
            </div>
          </div>
        </div>
      );
    }

    if (isTrapping) {
      const lHeight = step.left !== undefined ? Number(step.array[step.left]) : 0;
      const rHeight = step.right !== undefined ? Number(step.array[step.right]) : 0;
      const lMax = step.leftMax ?? 0;
      const rMax = step.rightMax ?? 0;
      const trapped = lHeight < rHeight ? Math.max(0, lMax - lHeight) : Math.max(0, rMax - rHeight);

      return (
        <div className="flex flex-col gap-3 font-sans">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Water Trapping Constraints</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-indigo-50/50 border border-indigo-100 p-2.5 rounded-lg">
              <span className="text-[9px] text-indigo-700 font-bold block">Left Max Wall</span>
              <span className="text-sm font-mono font-bold text-indigo-900">{lMax}</span>
              <span className="text-[9px] text-slate-400 block">Current Height: {lHeight}</span>
            </div>
            <div className="bg-amber-50/50 border border-amber-100 p-2.5 rounded-lg">
              <span className="text-[9px] text-amber-700 font-bold block">Right Max Wall</span>
              <span className="text-sm font-mono font-bold text-amber-900">{rMax}</span>
              <span className="text-[9px] text-slate-400 block">Current Height: {rHeight}</span>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-xs flex flex-col gap-1.5">
            <span className="font-bold text-blue-800">Dynamic Decision:</span>
            <p className="text-[11px] text-blue-900/90 leading-relaxed font-medium">
              We process the smaller height wall. Since height[left] ({lHeight}) {lHeight < rHeight ? '<' : '>= '} height[right] ({rHeight}), we compute trapping based on the{' '}
              {lHeight < rHeight ? 'Left' : 'Right'} boundary maximum.
            </p>
            <div className="border-t border-blue-200/60 pt-1.5 mt-1 font-mono font-bold text-blue-950 flex justify-between">
              <span>Trapped at Current Node:</span>
              <span>{trapped} units</span>
            </div>
          </div>
        </div>
      );
    }

    if (isKadane) {
      const activeText = step.activeRange ? `[${step.activeRange[0]} ... ${step.activeRange[1]}]` : 'Empty';
      const bestText = step.bestRange ? `[${step.bestRange[0]} ... ${step.bestRange[1]}]` : 'Empty';

      return (
        <div className="flex flex-col gap-3 font-sans">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Kadane's Real-Time State</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 font-bold block">Current Subarray Range</span>
              <span className="text-xs font-mono font-bold text-slate-800">{activeText}</span>
              <span className="text-xs font-semibold text-amber-700">Sum: {step.currentSum ?? 0}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-lg">
              <span className="text-[10px] text-slate-400 font-bold block">Max Subarray Range</span>
              <span className="text-xs font-mono font-bold text-slate-800">{bestText}</span>
              <span className="text-xs font-semibold text-emerald-700">Max Sum: {step.maxSum ?? 0}</span>
            </div>
          </div>

          {isCircularKadane && (
            <div className="bg-purple-50 border border-purple-200 p-2.5 rounded-lg text-xs flex flex-col gap-1">
              <span className="font-bold text-purple-800">Circular Array Wrapping Calculations:</span>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono font-bold text-slate-700 mt-1">
                <span>Total Sum: {step.totalSum ?? 0}</span>
                <span>Min Subarray: {step.minSum ?? 0}</span>
              </div>
              <div className="text-[11px] font-bold text-purple-950 mt-1.5 border-t border-purple-200/50 pt-1.5 flex justify-between">
                <span>Circular Option (Total - Min):</span>
                <span>{(step.totalSum ?? 0) - (step.minSum ?? 0)}</span>
              </div>
            </div>
          )}

          <div className="bg-slate-800 text-slate-100 p-3 rounded-lg text-xs font-mono flex flex-col gap-1">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Mathematical Form</div>
            <div className="text-amber-300 font-bold">currentSum = max(num, currentSum + num)</div>
            <div className="text-emerald-400 font-bold">maxSum = max(maxSum, currentSum)</div>
          </div>
        </div>
      );
    }

    // Default or fallback (Valid Palindrome, Reverse, Floyd's, etc.)
    return (
      <div className="flex flex-col gap-3 font-sans">
        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Pointers & Array Inspection</h4>
        <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg flex flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500 font-semibold">Active pointers:</span>
            <div className="flex gap-1.5 font-mono">
              {step.left !== undefined && <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded text-[10px]">L={step.left}</span>}
              {step.right !== undefined && <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px]">R={step.right}</span>}
              {step.slow !== undefined && <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded text-[10px]">Slow={step.slow}</span>}
              {step.fast !== undefined && <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px]">Fast={step.fast}</span>}
              {step.low !== undefined && <span className="bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded text-[10px]">Low={step.low}</span>}
              {step.mid !== undefined && <span className="bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded text-[10px]">Mid={step.mid}</span>}
              {step.high !== undefined && <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded text-[10px]">High={step.high}</span>}
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-normal border-t border-slate-100 pt-2 mt-1 font-medium">
            Currently analyzing elements from a local execution context. Review the Call Stack and Chronological Log tabs to trace structural pointer mutations or value swaps.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col h-[470px] overflow-hidden">
      {/* Tab Select Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-3 pt-2 flex gap-1 shrink-0">
        <button
          onClick={() => setActiveTab('trace')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-bold border-t-2 rounded-t-md transition-all ${
            activeTab === 'trace'
              ? 'border-amber-500 bg-white text-slate-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>C++ Trace</span>
        </button>

        <button
          onClick={() => setActiveTab('inspector')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-bold border-t-2 rounded-t-md transition-all ${
            activeTab === 'inspector'
              ? 'border-amber-500 bg-white text-slate-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Live Inspector</span>
        </button>

        <button
          onClick={() => setActiveTab('variables')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-bold border-t-2 rounded-t-md transition-all ${
            activeTab === 'variables'
              ? 'border-amber-500 bg-white text-slate-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Variables</span>
        </button>

        <button
          onClick={() => setActiveTab('log')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-sans font-bold border-t-2 rounded-t-md transition-all ${
            activeTab === 'log'
              ? 'border-amber-500 bg-white text-slate-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>History Log</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {/* TAB 1: C++ Trace */}
        {activeTab === 'trace' && (
          <div className="flex flex-col h-full relative">
            <button
              onClick={handleCopyCode}
              className="absolute top-0 right-0 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-xs font-sans flex items-center gap-1 transition-colors border border-slate-200 z-10 shadow-3xs"
              title="Copy C++ Code"
            >
              {copied ? (
                <>
                  <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[10px] font-semibold text-emerald-800">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-semibold">Copy</span>
                </>
              )}
            </button>

            <div
              ref={codeContainerRef}
              className="flex-1 font-mono text-xs overflow-y-auto bg-slate-50/70 border border-slate-100 p-3 rounded-lg leading-relaxed h-[360px]"
            >
              {codeLines.map((lineText, index) => {
                const lineNum = index + 1;
                const isActive = step.line === lineNum;

                return (
                  <div
                    key={lineNum}
                    ref={isActive ? activeLineRef : null}
                    className={`flex items-start gap-3 py-0.5 px-1 rounded transition-colors ${
                      isActive ? 'bg-amber-100/95 font-bold text-slate-900 border-l-4 border-amber-500 -ml-1' : 'text-slate-600'
                    }`}
                  >
                    <span className="text-[10px] text-slate-300 select-none w-5 text-right mt-0.5 font-bold">
                      {lineNum}
                    </span>
                    <pre
                      className="flex-1 overflow-x-auto whitespace-pre-wrap break-all"
                      dangerouslySetInnerHTML={{ __html: highlightCppLine(lineText) }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Live Inspector */}
        {activeTab === 'inspector' && (
          <div className="flex flex-col gap-2 h-full">
            {renderInspectorContent()}
          </div>
        )}

        {/* TAB 3: Call Stack & Variables */}
        {activeTab === 'variables' && (
          <div className="flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Local Call Stack Frame</h4>
              <span className="text-[10px] font-mono text-slate-400">Namespace: std</span>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-sans border-b border-slate-200 uppercase text-[9px] tracking-wider">
                    <th className="p-2.5 font-bold">Variable Name</th>
                    <th className="p-2.5 font-bold">Type</th>
                    <th className="p-2.5 font-bold">Runtime Value</th>
                  </tr>
                </thead>
                <tbody className="font-mono text-slate-700 divide-y divide-slate-100">
                  {/* Default loop index indicators */}
                  {step.left !== undefined && (
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-slate-800">left</td>
                      <td className="p-2.5 text-indigo-600 italic">int</td>
                      <td className="p-2.5 font-bold text-indigo-700">{step.left}</td>
                    </tr>
                  )}
                  {step.right !== undefined && (
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-slate-800">right</td>
                      <td className="p-2.5 text-indigo-600 italic">int</td>
                      <td className="p-2.5 font-bold text-amber-700">{step.right}</td>
                    </tr>
                  )}
                  {step.slow !== undefined && (
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-slate-800">slow</td>
                      <td className="p-2.5 text-indigo-600 italic">int</td>
                      <td className="p-2.5 font-bold text-indigo-700">{step.slow}</td>
                    </tr>
                  )}
                  {step.fast !== undefined && (
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-slate-800">fast</td>
                      <td className="p-2.5 text-indigo-600 italic">int</td>
                      <td className="p-2.5 font-bold text-emerald-700">{step.fast}</td>
                    </tr>
                  )}
                  {step.low !== undefined && (
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-slate-800">low</td>
                      <td className="p-2.5 text-indigo-600 italic">int</td>
                      <td className="p-2.5 font-bold text-indigo-700">{step.low}</td>
                    </tr>
                  )}
                  {step.mid !== undefined && (
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-slate-800">mid</td>
                      <td className="p-2.5 text-indigo-600 italic">int</td>
                      <td className="p-2.5 font-bold text-amber-700">{step.mid}</td>
                    </tr>
                  )}
                  {step.high !== undefined && (
                    <tr className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-slate-800">high</td>
                      <td className="p-2.5 text-indigo-600 italic">int</td>
                      <td className="p-2.5 font-bold text-rose-600">{step.high}</td>
                    </tr>
                  )}

                  {/* Problem Specific Local State Variables */}
                  {Object.entries(step.variables).map(([name, val]) => (
                    <tr key={name} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-slate-800">{name}</td>
                      <td className="p-2.5 text-indigo-600 italic">
                        {typeof val === 'number' ? 'int' : typeof val === 'boolean' ? 'bool' : 'any'}
                      </td>
                      <td className="p-2.5 text-slate-800 font-bold">
                        {typeof val === 'boolean' ? (val ? 'true' : 'false') : String(val)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: History Log */}
        {activeTab === 'log' && (
          <div className="flex flex-col gap-2 h-full">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Execution Chronicles</h4>
            <div className="flex-1 overflow-y-auto border border-slate-100 rounded-lg p-2.5 bg-slate-50/50 h-[360px] flex flex-col gap-2">
              {allSteps.slice(0, currentStepIndex + 1).map((histStep, idx) => {
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg text-xs font-sans transition-all flex gap-2.5 items-start border ${
                      isCurrent
                        ? 'bg-amber-500/10 border-amber-300 text-amber-950 font-bold scale-[1.01] shadow-2xs'
                        : 'bg-white border-slate-100 text-slate-600'
                    }`}
                  >
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 mt-0.5">
                      S{idx}
                    </span>
                    <div className="flex-1 leading-normal">
                      {histStep.log}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
