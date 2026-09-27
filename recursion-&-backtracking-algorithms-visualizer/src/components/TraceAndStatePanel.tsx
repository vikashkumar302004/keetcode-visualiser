import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ProblemMetadata, SimulationStep } from '../types';
import CallStackView from './CallStackView';
import { Code, Search, BarChart3, Clock, Copy, Check } from 'lucide-react';

interface TraceAndStatePanelProps {
  selectedProblem: ProblemMetadata;
  activeStep: SimulationStep | null;
  historySteps: SimulationStep[];
}

function highlightCppLine(line: string): string {
  if (!line) return ' ';
  
  // Escape HTML characters first
  let escaped = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Handle comments
  const commentIndex = escaped.indexOf('//');
  let codePart = escaped;
  let commentPart = '';
  if (commentIndex !== -1) {
    codePart = escaped.substring(0, commentIndex);
    commentPart = `<span class="text-emerald-500 font-sans italic">${escaped.substring(commentIndex)}</span>`;
  }

  // Highlight string & char literals
  codePart = codePart.replace(/(["'])(.*?)\1/g, '<span class="text-emerald-400 font-mono font-semibold">$&</span>');

  // Highlight standard keywords
  const keywords = [
    'int', 'double', 'void', 'return', 'if', 'for', 'else', 'vector', 'string', 'bool', 'char', 'const', 'long', 'char'
  ];
  keywords.forEach((keyword) => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'g');
    codePart = codePart.replace(regex, `<span class="text-sky-400 font-bold">${keyword}</span>`);
  });

  // Highlight values
  const values = ['true', 'false', 'NULL', 'nullptr'];
  values.forEach((val) => {
    const regex = new RegExp(`\\b${val}\\b`, 'g');
    codePart = codePart.replace(regex, `<span class="text-amber-400 font-bold">${val}</span>`);
  });

  return codePart + commentPart;
}

export default function TraceAndStatePanel({
  selectedProblem,
  activeStep,
  historySteps,
}: TraceAndStatePanelProps) {
  const [activeTab, setActiveTab] = useState<'cpp' | 'inspector' | 'metrics' | 'log'>('cpp');
  const [copied, setCopied] = useState(false);
  const activeLineRef = useRef<HTMLDivElement>(null);

  // Auto-scroll C++ active line into view smoothly
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeStep?.highlightedLine]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedProblem.cppCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate historical logs by traversing historical steps up to the active step
  const logEvents = useMemo(() => {
    if (!activeStep) return [];
    
    const events: { stepIndex: number; type: 'CALL' | 'RETURN' | 'PRUNE' | 'BACKTRACK'; text: string }[] = [];
    
    // We can infer logs by looking at the sequential changes in description
    for (let i = 0; i <= activeStep.stepIndex; i++) {
      const step = historySteps[i];
      if (!step) continue;

      let type: 'CALL' | 'RETURN' | 'PRUNE' | 'BACKTRACK' = 'CALL';
      const desc = step.description.toLowerCase();

      if (desc.includes('backtracking') || desc.includes('rollback') || desc.includes('popping')) {
        type = 'BACKTRACK';
      } else if (desc.includes('prun') || desc.includes('conflict') || desc.includes('dead end') || desc.includes('fail')) {
        type = 'PRUNE';
      } else if (desc.includes('success') || desc.includes('return') || desc.includes('hit') || desc.includes('match')) {
        type = 'RETURN';
      }

      events.push({
        stepIndex: step.stepIndex,
        type,
        text: step.description,
      });
    }

    return events.reverse(); // Newest logs first
  }, [activeStep, historySteps]);

  const lineHighlight = activeStep?.highlightedLine ?? 0;

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-lg overflow-hidden">
      {/* Dynamic Segmented Filter Control Tab List */}
      <div className="flex items-center justify-between p-1 bg-slate-100 border-b border-slate-200">
        <div className="flex items-center gap-1 w-full">
          <button
            onClick={() => setActiveTab('cpp')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
              activeTab === 'cpp'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>C++ Trace</span>
          </button>

          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
              activeTab === 'inspector'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Inspector</span>
          </button>

          <button
            onClick={() => setActiveTab('metrics')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
              activeTab === 'metrics'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Metrics</span>
          </button>

          <button
            onClick={() => setActiveTab('log')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
              activeTab === 'log'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Log ({logEvents.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-hidden relative">
        {/* TAB 1: C++ Trace */}
        {activeTab === 'cpp' && (
          <div className="absolute inset-0 flex flex-col bg-slate-950 text-slate-100 p-3 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 shrink-0">
              <span className="font-mono text-[10px] text-slate-400">cpp_source_code.cpp</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2 py-1 bg-slate-900 hover:bg-slate-800 text-[10px] font-mono text-slate-300 rounded transition-colors border border-slate-800 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            {/* Code Block Container */}
            <div className="flex-1 overflow-auto font-mono text-[11px] leading-relaxed scrollbar-thin scrollbar-track-slate-900">
              {selectedProblem.cppCode.split('\n').map((line, idx) => {
                const lineNum = idx + 1;
                const isActive = lineNum === lineHighlight;

                return (
                  <div
                    key={lineNum}
                    ref={isActive ? activeLineRef : null}
                    className={`flex items-start ${
                      isActive ? 'bg-amber-900/30 text-amber-300 border-l-2 border-amber-500 -ml-3 pl-2.5' : 'text-slate-300'
                    }`}
                  >
                    <span className="w-8 text-right pr-3 select-none text-slate-600 text-[10px]">
                      {lineNum}
                    </span>
                    <pre
                      className="whitespace-pre flex-1 font-mono tracking-wide"
                      dangerouslySetInnerHTML={{ __html: highlightCppLine(line) }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: Inspector (Live State & Call Stack) */}
        {activeTab === 'inspector' && (
          <div className="absolute inset-0 flex flex-col p-3 gap-3 overflow-y-auto scrollbar-thin bg-[#FAF9F6]">
            {/* Call Stack Section */}
            <div className="shrink-0">
              <CallStackView stack={activeStep?.callStack ?? []} />
            </div>

            {/* Path Accumulator Inspector */}
            <div className="bg-white border border-slate-200 rounded p-2.5">
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-semibold">
                Path Accumulator (curr)
              </span>
              <div className="mt-1.5 font-mono text-xs text-slate-800 bg-slate-50 p-2 rounded border border-slate-100 flex flex-wrap gap-1">
                {activeStep && activeStep.currentPath.length > 0 ? (
                  activeStep.currentPath.map((v, i) => (
                    <span key={i} className="bg-amber-50 text-amber-800 px-1 rounded border border-amber-200/45">
                      {v}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic">No variables accumulated</span>
                )}
              </div>
            </div>

            {/* Choices Remaining */}
            <div className="bg-white border border-slate-200 rounded p-2.5">
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-semibold">
                Choices Remaining at Current Node
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {activeStep && activeStep.choices && activeStep.choices.length > 0 ? (
                  activeStep.choices.map((choice, i) => (
                    <span key={i} className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200/50">
                      {choice}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] font-mono text-slate-400 italic">No further branching decisions available</span>
                )}
              </div>
            </div>

            {/* Output Solutions list */}
            <div className="bg-white border border-slate-200 rounded p-2.5 flex-1 min-h-[120px] flex flex-col">
              <span className="text-[10px] font-mono text-slate-400 block uppercase font-semibold border-b border-slate-100 pb-1 mb-1.5">
                Output Solutions Detected ({activeStep?.solutions.length ?? 0})
              </span>
              <div className="flex-1 overflow-y-auto max-h-[160px] pr-1 space-y-1 font-mono text-xs text-slate-700 scrollbar-thin">
                {activeStep && activeStep.solutions.length > 0 ? (
                  activeStep.solutions.map((sol, index) => {
                    const formatted = Array.isArray(sol)
                      ? JSON.stringify(sol)
                      : typeof sol === 'string'
                      ? `"${sol}"`
                      : JSON.stringify(sol);

                    return (
                      <div
                        key={index}
                        className="bg-emerald-50 border border-emerald-100 text-emerald-900 rounded p-1.5 text-[10px] leading-relaxed flex justify-between gap-2"
                      >
                        <span className="text-slate-400 select-none">#{(index + 1).toString().padStart(2, '0')}:</span>
                        <span className="truncate flex-1 font-bold">{formatted}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center text-slate-400 py-6 text-[10px] italic">
                    Exploring tree... No solutions reached yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Tree Metrics */}
        {activeTab === 'metrics' && (
          <div className="absolute inset-0 p-4 overflow-y-auto bg-[#FAF9F6] space-y-4">
            <h3 className="font-serif font-bold text-slate-900 text-sm border-b border-slate-200 pb-2">
              Algorithmic Execution Metrics
            </h3>

            {activeStep ? (
              <div className="grid grid-cols-2 gap-3">
                {/* Nodes Visited */}
                <div className="bg-white border border-slate-200 rounded p-3 text-center">
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block mb-1">
                    Nodes Visited
                  </span>
                  <span className="font-mono font-bold text-2xl text-amber-600">
                    {activeStep.metrics.nodesVisited}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1">Total tree state size</span>
                </div>

                {/* Max Depth */}
                <div className="bg-white border border-slate-200 rounded p-3 text-center">
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block mb-1">
                    Max Stack Depth
                  </span>
                  <span className="font-mono font-bold text-2xl text-slate-800">
                    {activeStep.metrics.maxDepth}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1">Peak stack frames</span>
                </div>

                {/* Valid Leaves */}
                <div className="bg-white border border-slate-200 rounded p-3 text-center">
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block mb-1">
                    Valid Solutions
                  </span>
                  <span className="font-mono font-bold text-2xl text-emerald-600">
                    {activeStep.metrics.validLeaves}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1">Base success nodes</span>
                </div>

                {/* Pruned Branches */}
                <div className="bg-white border border-slate-200 rounded p-3 text-center">
                  <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold block mb-1">
                    Pruned Branches
                  </span>
                  <span className="font-mono font-bold text-2xl text-rose-500">
                    {activeStep.metrics.prunedBranches}
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1">Dead ends aborted</span>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8 text-xs italic">
                No active metrics. Run a problem simulation step.
              </div>
            )}

            {/* Efficiency Box */}
            <div className="bg-amber-50 border border-amber-100 p-3 rounded text-xs text-amber-900 leading-relaxed font-sans">
              <h4 className="font-bold mb-1 font-mono text-[10px] tracking-wide uppercase text-amber-800">
                Backtracking Complexity Invariant
              </h4>
              <p className="text-[11px] font-mono">
                By pruning early on safety checks, we avoid generating the full combinatorial tree of size{' '}
                <strong className="font-mono text-amber-900">O(branch^depth)</strong>, achieving significant runtime reduction.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: Chronological Log */}
        {activeTab === 'log' && (
          <div className="absolute inset-0 flex flex-col p-3 bg-slate-950 text-slate-300">
            <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold border-b border-slate-800 pb-1.5 mb-1.5 shrink-0">
              Live Chronological Events List
            </span>
            <div className="flex-1 overflow-y-auto pr-1 space-y-1.5 font-mono text-[10px] scrollbar-thin">
              {logEvents.length === 0 ? (
                <div className="text-center text-slate-600 italic py-8">No events logged yet</div>
              ) : (
                logEvents.map((event) => {
                  let badgeColor = 'text-amber-400 border-amber-800/40';
                  if (event.type === 'RETURN') badgeColor = 'text-emerald-400 border-emerald-800/40';
                  if (event.type === 'PRUNE') badgeColor = 'text-rose-400 border-rose-800/40';
                  if (event.type === 'BACKTRACK') badgeColor = 'text-amber-300 border-amber-700/50';

                  return (
                    <div
                      key={event.stepIndex}
                      className="border-b border-slate-900 pb-1.5 flex items-start gap-2.5 hover:bg-slate-900/40 p-1 rounded"
                    >
                      <span className="text-slate-600 select-none font-semibold text-[9px] mt-0.5">
                        [S{event.stepIndex.toString().padStart(3, '0')}]
                      </span>
                      <span className={`font-bold border px-1 rounded text-[8px] tracking-wider shrink-0 mt-0.5 ${badgeColor}`}>
                        {event.type}
                      </span>
                      <span className="text-slate-200 leading-relaxed text-[11px] font-sans">
                        {event.text}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
