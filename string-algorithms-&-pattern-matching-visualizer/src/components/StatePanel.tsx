import React, { useState, useEffect, useRef } from 'react';
import { SimulationStep, AlgorithmId } from '../types';
import { CPP_SNIPPETS } from '../algorithms/cppSnippets';
import { Copy, Check, Table, ListTodo, FileCode2, Info } from 'lucide-react';

interface StatePanelProps {
  step: SimulationStep;
  algorithmId: AlgorithmId;
  allSteps: SimulationStep[];
}

type TabId = 'cpp' | 'state' | 'stack' | 'log';

export default function StatePanel({ step, algorithmId, allSteps }: StatePanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('state');
  const [copied, setCopied] = useState(false);
  const activeLineRef = useRef<HTMLDivElement>(null);
  const codeContainerRef = useRef<HTMLDivElement>(null);

  const snippet = CPP_SNIPPETS[algorithmId];

  // Auto-scroll C++ code when active line changes
  useEffect(() => {
    if (activeLineRef.current && codeContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [step.line]);

  const handleCopy = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Helper to colorize C++ types without raw double-quote overlap bugs
  const colorizeCppLine = (line: string) => {
    if (!line) return '';

    // First escape the original line for safe HTML rendering
    const escaped = line
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Match comments, double-quoted strings, single-quoted strings, type keywords, control keywords, and constant keywords
    const regex = /(\/\/.*)|("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*')|(\b(?:const|int|char|bool|long|void|double|string|vector|std::string)\b)|(\b(?:for|while|if|else|return|break|continue)\b)|(\b(?:true|false|NULL|INT_MIN|INT_MAX)\b)/g;

    const formatted = escaped.replace(regex, (match, comment, dstr, sstr, typeKey, flowKey, constKey) => {
      if (comment) {
        return `<span class="text-slate-400 italic font-mono">${comment}</span>`;
      }
      if (dstr) {
        return `<span class="text-rose-400 font-medium">${dstr}</span>`;
      }
      if (sstr) {
        return `<span class="text-rose-400 font-medium">${sstr}</span>`;
      }
      if (typeKey) {
        return `<span class="text-sky-400 font-semibold">${typeKey}</span>`;
      }
      if (flowKey) {
        return `<span class="text-fuchsia-400 font-semibold">${flowKey}</span>`;
      }
      if (constKey) {
        return `<span class="text-emerald-400 font-semibold">${constKey}</span>`;
      }
      return match;
    });

    return <code dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  const renderCppTab = () => {
    if (!snippet) return null;

    return (
      <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-b-xl overflow-hidden relative select-none">
        {/* Code Header Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-[10px] uppercase font-bold tracking-wider text-slate-400">
          <span>Source C++ Code</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {/* Code Content Container */}
        <div
          ref={codeContainerRef}
          className="flex-1 p-3 overflow-y-auto font-mono text-[11px] leading-relaxed select-text"
        >
          {snippet.lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isActive = lineNum === step.line;

            return (
              <div
                key={idx}
                ref={isActive ? activeLineRef : null}
                className={`flex gap-3 px-2 py-0.5 rounded transition-colors duration-150 ${
                  isActive ? 'bg-amber-500/20 text-white font-semibold border-l-2 border-amber-500' : 'hover:bg-slate-800/40'
                }`}
              >
                <span className="w-5 text-right text-slate-500 font-mono select-none text-[10px]">
                  {lineNum}
                </span>
                <span className="flex-1 whitespace-pre">
                  {colorizeCppLine(line)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderLiveStateTab = () => {
    return (
      <div className="flex-1 p-4 bg-white rounded-b-xl overflow-y-auto border-t-0 border border-slate-200 flex flex-col gap-4 font-sans select-none">
        {/* Dynamic specific state panels based on algorithm class */}
        <div className="flex flex-col gap-3.5">
          {/* Category Header */}
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Live Algorithmic State</span>
          </div>

          {/* Render state keys based on active properties */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* General state values */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Pointer (i)</span>
                <h4 className="text-xl font-mono text-slate-800 font-bold mt-1">
                  {step.textPointer !== -1 ? step.textPointer : 'N/A'}
                </h4>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 font-mono">
                S[i] = {step.text[step.textPointer] ? `"${step.text[step.textPointer]}"` : 'EOF'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secondary Pointer (j)</span>
                <h4 className="text-xl font-mono text-slate-800 font-bold mt-1">
                  {step.patternPointer !== -1 ? step.patternPointer : 'N/A'}
                </h4>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 font-mono">
                {step.pattern ? `P[j] = "${step.pattern[step.patternPointer] || 'EOF'}"` : 'Not applicable'}
              </p>
            </div>

            {/* Render KMP search matches if present */}
            {algorithmId === 'kmp_search' && step.matchedIndices && (
              <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl col-span-2">
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Matched Start Indices list</span>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {step.matchedIndices.length === 0 ? (
                    <span className="text-xs italic text-emerald-700/80">Scanning for matches...</span>
                  ) : (
                    step.matchedIndices.map((matchVal, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-950 font-mono text-xs font-bold rounded shadow-sm">
                        Index {matchVal}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Custom Rabin-Karp Spurious Hit verification */}
            {algorithmId === 'rabin_karp' && step.hashTarget !== undefined && (
              <div className="col-span-2 p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-700 flex flex-col gap-1">
                <span className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-wider">Rolling Calculation Parameters</span>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <span>Modulus M: <strong>{step.hashMod}</strong></span>
                  <span>Base Radix B: <strong>{step.hashBase}</strong></span>
                  <span>Target Hash H(P): <strong>{step.hashTarget}</strong></span>
                  <span>Current Window Hash: <strong className={step.hashCurrent === step.hashTarget ? 'text-emerald-700' : ''}>{step.hashCurrent}</strong></span>
                </div>
              </div>
            )}

            {/* Custom atoi state representation */}
            {algorithmId === 'atoi' && step.atoiState && (
              <div className="col-span-2 p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State Machine (atoi)</span>
                <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs">
                  <div className={`p-1.5 border rounded-lg ${step.atoiState.stage === 'whitespace' ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold' : 'bg-white text-slate-400 border-slate-100'}`}>Whitespace</div>
                  <div className={`p-1.5 border rounded-lg ${step.atoiState.stage === 'sign' ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold' : 'bg-white text-slate-400 border-slate-100'}`}>Sign: {step.atoiState.sign}</div>
                  <div className={`p-1.5 border rounded-lg ${step.atoiState.stage === 'digits' || step.atoiState.stage === 'clamp' ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold' : 'bg-white text-slate-400 border-slate-100'}`}>Digits: {step.atoiState.num}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCallStackTab = () => {
    const variables = Object.entries(step.vars || {}).filter(([_, v]) => v !== undefined);

    return (
      <div className="flex-1 p-4 bg-white rounded-b-xl overflow-y-auto border-t-0 border border-slate-200 font-sans select-none">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-3">
          <ListTodo className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Call Stack Variables</span>
        </div>

        <div className="border border-slate-100 rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <th className="p-2.5">Variable</th>
                <th className="p-2.5">Type</th>
                <th className="p-2.5">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {variables.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-4 text-center text-slate-400 italic font-sans">
                    No active call stack variables defined.
                  </td>
                </tr>
              ) : (
                variables.map(([key, value]) => {
                  let varType: string = typeof value;
                  if (Array.isArray(value)) {
                    varType = 'array';
                  } else if (key === 's' || typeof value === 'string') {
                    varType = 'string';
                  }

                  return (
                    <tr key={key} className="hover:bg-slate-50/50">
                      <td className="p-2.5 font-bold text-indigo-700">{key}</td>
                      <td className="p-2.5 text-slate-400">{varType}</td>
                      <td className="p-2.5 text-slate-800 break-all">
                        {Array.isArray(value) ? `[${value.join(', ')}]` : String(value)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderLogTab = () => {
    // Collect preceding steps
    const history = allSteps.slice(0, step.stepIndex + 1);

    return (
      <div className="flex-1 p-4 bg-white rounded-b-xl overflow-y-auto border-t-0 border border-slate-200 font-sans select-none">
        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-3">
          <Table className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide font-sans">Execution Chronological Log</span>
        </div>

        <div className="flex flex-col gap-2.5 h-[180px] overflow-y-auto">
          {history.length === 0 ? (
            <div className="text-center py-6 text-slate-400 italic text-xs">
              No logged events yet.
            </div>
          ) : (
            history.map((histStep, idx) => {
              const isCurrent = histStep.stepIndex === step.stepIndex;
              return (
                <div
                  key={idx}
                  className={`flex gap-2.5 text-xs p-2 rounded-lg transition-colors border ${
                    isCurrent ? 'bg-amber-50/60 border-amber-200 text-amber-950 font-medium' : 'bg-slate-50/50 border-slate-100 text-slate-600'
                  }`}
                >
                  <span className="font-mono text-[10px] text-slate-400 tabular-nums self-start">
                    #{(histStep.stepIndex + 1).toString().padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <p className="leading-relaxed">{histStep.description}</p>
                    <span className="text-[9px] font-mono text-slate-400 block mt-0.5">C++ Line {histStep.line}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab Switch Headers */}
      <div className="flex items-center bg-slate-100 p-1 rounded-t-xl border border-slate-200 select-none border-b-0 shrink-0">
        <button
          onClick={() => setActiveTab('state')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'state' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          <span>Live State</span>
        </button>

        <button
          onClick={() => setActiveTab('cpp')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'cpp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-3.5 h-3.5" />
          <span>C++ Trace</span>
        </button>

        <button
          onClick={() => setActiveTab('stack')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'stack' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ListTodo className="w-3.5 h-3.5" />
          <span>Call Stack</span>
        </button>

        <button
          onClick={() => setActiveTab('log')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            activeTab === 'log' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          <span>History Log</span>
        </button>
      </div>

      {/* Tabs Viewports */}
      <div className="flex-1 min-h-0 overflow-hidden bg-white shadow-sm rounded-b-xl border border-t-0 border-slate-200">
        {activeTab === 'cpp' && renderCppTab()}
        {activeTab === 'state' && renderLiveStateTab()}
        {activeTab === 'stack' && renderCallStackTab()}
        {activeTab === 'log' && renderLogTab()}
      </div>
    </div>
  );
}
