import React from 'react';
import { Code, Eye, FileText, ListOrdered, Copy, Check } from 'lucide-react';
import { ProblemId, SimulationStep } from '../types';
import { CPP_SNIPPETS } from '../algorithms/cppSnippets';

interface TraceAndStatePanelProps {
  problemId: ProblemId;
  activeStep: SimulationStep;
  variables: Record<string, any>;
  stack: any[];
  secondaryStack?: any[];
  logs: string[];
}

export const TraceAndStatePanel: React.FC<TraceAndStatePanelProps> = ({
  problemId,
  activeStep,
  variables = {},
  stack = [],
  secondaryStack = [],
  logs = []
}) => {
  const [activeTab, setActiveTab] = React.useState<'cpp' | 'inspector' | 'callstack' | 'log'>('cpp');
  const [copied, setCopied] = React.useState(false);
  const activeLineRef = React.useRef<HTMLDivElement | null>(null);

  // Auto-scroll C++ active line into view
  React.useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [activeStep.line, activeTab]);

  const handleCopyCode = () => {
    const code = CPP_SNIPPETS[problemId] || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCleanValue = (val: any) => {
    if (typeof val === 'object' && val !== null) {
      return JSON.stringify(val);
    }
    return String(val);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
      {/* Tab selectors */}
      <div className="flex border-b border-slate-200 bg-[#FAF9F6] px-2 h-10 items-center justify-between shrink-0 select-none">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('cpp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-sans font-bold transition-all ${
              activeTab === 'cpp'
                ? 'bg-white text-slate-900 border border-slate-200/60 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            C++ Trace
          </button>
          
          <button
            onClick={() => setActiveTab('inspector')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-sans font-bold transition-all ${
              activeTab === 'inspector'
                ? 'bg-white text-slate-900 border border-slate-200/60 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            id="state-inspector-tab"
          >
            <Eye className="w-3.5 h-3.5" />
            State Inspector
          </button>

          <button
            onClick={() => setActiveTab('callstack')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-sans font-bold transition-all ${
              activeTab === 'callstack'
                ? 'bg-white text-slate-900 border border-slate-200/60 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Variables & frames
          </button>

          <button
            onClick={() => setActiveTab('log')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-sans font-bold transition-all relative ${
              activeTab === 'log'
                ? 'bg-white text-slate-900 border border-slate-200/60 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            Sim Logs
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
          </button>
        </div>

        {/* Action controls inside tabs */}
        {activeTab === 'cpp' && (
          <button
            onClick={handleCopyCode}
            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
            title="Copy C++ implementation"
            id="copy-code-btn"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 font-sans text-xs">
        
        {/* TAB 1: C++ Trace */}
        {activeTab === 'cpp' && (
          <div className="font-mono text-[11px] leading-relaxed text-slate-700 bg-slate-50/50 p-2 rounded-lg border border-slate-200/50 overflow-x-auto h-full max-h-[340px] select-text">
            {(CPP_SNIPPETS[problemId] || '// Snippet not found').split('\n').map((codeLine, idx) => {
              const lineNum = idx + 1;
              const isActive = lineNum === activeStep.line;
              
              return (
                <div
                  key={idx}
                  ref={isActive ? activeLineRef : null}
                  className={`flex gap-3 px-1.5 py-0.5 rounded transition-all ${
                    isActive
                      ? 'bg-amber-100 border-l-[3px] border-amber-500 text-amber-950 font-bold'
                      : 'border-l-[3px] border-transparent'
                  }`}
                >
                  <span className="w-6 text-right text-[10px] text-slate-400 select-none">
                    {lineNum}
                  </span>
                  <pre className="whitespace-pre">{codeLine}</pre>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: Live State Inspector */}
        {activeTab === 'inspector' && (
          <div className="space-y-4 h-full min-h-0 select-none">
            {/* Expression-specific States */}
            {['infix-to-postfix', 'infix-to-prefix', 'postfix-to-infix', 'prefix-to-infix', 'basic-calculator'].includes(problemId) && (
              <div className="space-y-2">
                <h4 className="font-sans font-bold text-slate-800 border-b border-slate-100 pb-1">
                  Expression Scraper State
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200/50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Scanned Token</p>
                    <p className="font-mono text-sm font-bold text-indigo-700">
                      {activeStep.inputTokens?.[activeStep.inputCursor]?.value || 'EOF'}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200/50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Stack Contents</p>
                    <p className="font-mono text-sm font-bold text-slate-800">
                      [{stack.map(it => it.value).join(', ')}]
                    </p>
                  </div>
                  <div className="col-span-2 bg-slate-50 p-2 rounded border border-slate-200/50">
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Output built so far</p>
                    <p className="font-mono text-sm font-bold text-emerald-700">
                      "{variables.output || activeStep.outputString || ''}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Monotonic stack invariant values */}
            {['next-greater-element', 'daily-temperatures', 'online-stock-span', 'largest-rectangle', 'trapping-rain-water', 'remove-k-digits'].includes(problemId) && (
              <div className="space-y-2">
                <h4 className="font-sans font-bold text-slate-800 border-b border-slate-100 pb-1">
                  Monotonic stack Invariant
                </h4>
                <div className="bg-amber-50/20 border border-amber-200/60 p-2.5 rounded-lg text-[11px] leading-relaxed text-slate-700">
                  <p className="font-semibold text-amber-900 mb-1">Invariant constraint:</p>
                  <p className="font-mono text-[10px] bg-white border border-slate-100 rounded px-1.5 py-0.5 inline-block mb-1 text-slate-800">
                    {problemId === 'largest-rectangle'
                      ? 'Stack stores indices of strictly increasing heights'
                      : 'Stack stores indices of strictly decreasing values'}
                  </p>
                  <p className="text-slate-600">
                    Values of indices in Stack: <span className="font-mono text-indigo-700 font-bold">
                      [{stack.map(it => it.subValue || it.value).join(', ')}]
                    </span>
                  </p>
                </div>
              </div>
            )}

            {/* Histogram state specifics */}
            {(problemId === 'largest-rectangle' || problemId === 'maximal-rectangle') && activeStep.histogramState && (
              <div className="space-y-2">
                <h4 className="font-sans font-bold text-slate-800 border-b border-slate-100 pb-1">
                  Histogram Rectangle Calculation
                </h4>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200/50">
                    <p className="text-[10px] text-slate-400 font-sans font-bold">Popped Height</p>
                    <p className="text-sm font-bold text-slate-800">{activeStep.histogramState.currentHeight}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200/50">
                    <p className="text-[10px] text-slate-400 font-sans font-bold">Calculated Width</p>
                    <p className="text-sm font-bold text-slate-800">{activeStep.histogramState.currentWidth}</p>
                  </div>
                  <div className="col-span-2 bg-slate-50 p-2 rounded border border-slate-200/50 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] text-slate-400 font-sans font-bold">Calculated Area</p>
                      <p className="text-base font-bold text-indigo-700">
                        {activeStep.histogramState.currentHeight} × {activeStep.histogramState.currentWidth} = {activeStep.histogramState.currentArea}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-sans font-bold">Max Area Record</p>
                      <p className="text-base font-bold text-emerald-600">{activeStep.histogramState.maxArea}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trapping rain water state specifics */}
            {problemId === 'trapping-rain-water' && activeStep.waterState && (
              <div className="space-y-2">
                <h4 className="font-sans font-bold text-slate-800 border-b border-slate-100 pb-1">
                  Water Volume Calculation
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200/50">
                    <p className="text-[10px] text-slate-400 font-sans uppercase font-bold">Left boundary idx</p>
                    <p className="font-mono text-sm font-bold text-slate-800">{activeStep.waterState.currentLeft}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200/50">
                    <p className="text-[10px] text-slate-400 font-sans uppercase font-bold">Right boundary idx</p>
                    <p className="font-mono text-sm font-bold text-slate-800">{activeStep.waterState.currentRight}</p>
                  </div>
                  <div className="col-span-2 bg-slate-50 p-2 rounded border border-slate-200/50">
                    <p className="text-[10px] text-slate-400 font-sans uppercase font-bold">Total Trapped Water Volume</p>
                    <p className="font-mono text-base font-bold text-cyan-600">
                      {activeStep.waterState.totalWater} units
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* General fallback widget */}
            <div className="space-y-1.5">
              <h4 className="font-sans font-bold text-slate-800 border-b border-slate-100 pb-1">
                Active Snapshot State
              </h4>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="bg-slate-50 p-2 rounded border border-slate-200/50">
                  <p className="text-[9px] text-slate-400 font-sans font-bold">Stack Top Peek</p>
                  <p className="text-xs font-bold text-slate-800">
                    {stack.length > 0 ? getCleanValue(stack[stack.length - 1].value) : 'None (Underflow)'}
                  </p>
                </div>
                <div className="bg-slate-50 p-2 rounded border border-slate-200/50">
                  <p className="text-[9px] text-slate-400 font-sans font-bold">Stack Size</p>
                  <p className="text-xs font-bold text-slate-800">{stack.length} elements</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Call Stack & Variables */}
        {activeTab === 'callstack' && (
          <div className="space-y-3 select-none">
            <h4 className="font-sans font-bold text-slate-800 border-b border-slate-100 pb-1">
              Active Scope Variables
            </h4>
            <div className="bg-slate-50 border border-slate-200/55 rounded-lg overflow-hidden">
              <table className="w-full text-left font-mono text-[10.5px]">
                <thead className="bg-slate-100/70 text-slate-500 font-sans text-[9.5px]">
                  <tr>
                    <th className="p-2 font-bold uppercase tracking-wider">Variable</th>
                    <th className="p-2 font-bold uppercase tracking-wider">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(variables).map(([name, val]) => (
                    <tr key={name} className="hover:bg-slate-50">
                      <td className="p-2 text-indigo-700 font-semibold">{name}</td>
                      <td className="p-2 text-slate-700">{getCleanValue(val)}</td>
                    </tr>
                  ))}
                  {Object.keys(variables).length === 0 && (
                    <tr>
                      <td colSpan={2} className="p-2 text-slate-400 italic text-center font-sans">
                        No variables tracked in current state frame
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Chronological Simulation Log */}
        {activeTab === 'log' && (
          <div className="space-y-2 h-full max-h-[340px] overflow-y-auto select-none">
            {logs.length === 0 ? (
              <p className="text-slate-400 italic text-center py-4">No simulation steps tracked</p>
            ) : (
              <div className="space-y-1.5 font-mono text-[10.5px]">
                {logs.map((logMsg, idx) => (
                  <div
                    key={idx}
                    className={`p-1.5 rounded flex items-start gap-2 leading-relaxed ${
                      idx === logs.length - 1
                        ? 'bg-amber-500/10 text-slate-900 border-l-[3px] border-amber-500 font-bold'
                        : 'bg-slate-50 text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <span className="text-slate-300 font-sans select-none">{idx + 1}.</span>
                    <span>{logMsg}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
