import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Calculator, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  Copy, 
  Plus, 
  Minus, 
  Info, 
  Hash, 
  Binary, 
  TrendingUp, 
  X, 
  Activity, 
  Cpu, 
  BookOpen, 
  FileCode2, 
  History, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

import { PROBLEMS } from './data/prefixMathProblems';
import { CPP_SNIPPETS } from './algorithms/cppSnippets';
import { generateSimulation } from './algorithms/prefixMathAlgorithms';
import { Problem, SimulationStep, SimulationData } from './types';

export default function App() {
  // Navigation & Problem selection
  const [currentProblemIdx, setCurrentProblemIdx] = useState(0);
  const problem = PROBLEMS[currentProblemIdx];

  // Tab control in right panel: 'cpp' | 'inspector' | 'proofs' | 'log'
  const [activeTab, setActiveTab] = useState<'cpp' | 'inspector' | 'proofs' | 'log'>('cpp');

  // Input States (problem-specific dynamic controllers)
  const [arrayInputStr, setArrayInputStr] = useState('');
  const [numericTarget, setNumericTarget] = useState(7);
  const [numericA, setNumericA] = useState(54);
  const [numericB, setNumericB] = useState(24);
  const [numericX, setNumericX] = useState(12345678);
  const [numericMod, setNumericMod] = useState(1000);
  const [updatesStr, setUpdatesStr] = useState('1,3,2; 2,4,3; 0,2,-2');

  // Simulation play state
  const [simulation, setSimulation] = useState<SimulationData | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // seconds per step, we will use it with interval
  const [isCopied, setIsCopied] = useState(false);
  const [isProblemDetailsExpanded, setIsProblemDetailsExpanded] = useState(false);

  // Auto-scroll ref for C++ code trace
  const codeContainerRef = useRef<HTMLDivElement>(null);

  // Sync Input States when problem changes
  useEffect(() => {
    if (problem.inputSchema.type === 'array') {
      const defaultValue = problem.defaultInput.nums;
      setArrayInputStr(Array.isArray(defaultValue) ? defaultValue.join(', ') : '');
    } else if (problem.inputSchema.type === 'range-add-args') {
      if (problem.id === 'lc370') {
        setNumericTarget(problem.defaultInput.size);
        setUpdatesStr(problem.defaultInput.updates);
      } else {
        const defaultValue = problem.defaultInput.nums;
        setArrayInputStr(Array.isArray(defaultValue) ? defaultValue.join(', ') : '');
        setNumericTarget(problem.defaultInput.k || 7);
      }
    } else if (problem.inputSchema.type === 'two-numbers') {
      setNumericA(problem.defaultInput.a);
      setNumericB(problem.defaultInput.b);
    } else if (problem.inputSchema.type === 'number') {
      setNumericX(problem.defaultInput.n || problem.defaultInput.x || 100);
    } else if (problem.inputSchema.type === 'pow-args') {
      setNumericA(problem.defaultInput.base);
      setNumericB(problem.defaultInput.exp);
      setNumericMod(problem.defaultInput.mod);
    }
    
    // Auto trigger simulation generation on problem load
    handleTriggerSimulation(problem);
    setIsProblemDetailsExpanded(false);
  }, [currentProblemIdx]);

  // Construct Simulation State based on inputs
  const handleTriggerSimulation = (targetProblem = problem) => {
    let payload: Record<string, any> = {};

    if (targetProblem.inputSchema.type === 'array') {
      if (targetProblem.id === 'lc171_168') {
        payload = { columnTitle: arrayInputStr || 'FXSH' };
      } else {
        payload = { nums: arrayInputStr.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x)) };
      }
    } else if (targetProblem.inputSchema.type === 'range-add-args') {
      if (targetProblem.id === 'lc370') {
        payload = { size: numericTarget, updates: updatesStr };
      } else {
        payload = {
          nums: arrayInputStr.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x)),
          k: numericTarget
        };
      }
    } else if (targetProblem.inputSchema.type === 'two-numbers') {
      payload = { a: numericA, b: numericB };
    } else if (targetProblem.inputSchema.type === 'number') {
      payload = { n: numericX, x: numericX };
    } else if (targetProblem.inputSchema.type === 'pow-args') {
      payload = { base: numericA, exp: numericB, mod: numericMod };
    }

    const result = generateSimulation(targetProblem.id, payload);
    setSimulation(result);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  // Keyboard navigation & spacebar controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return; // ignore when typing in input
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(p => !p);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepBackward();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [simulation, currentStepIdx]);

  // Playback timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying && simulation) {
      const intervalMs = Math.max(200, 1500 / playbackSpeed);
      timer = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev < simulation.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, intervalMs);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, simulation, playbackSpeed]);

  // Helper step controls
  const handleStepForward = () => {
    if (!simulation) return;
    setCurrentStepIdx(prev => Math.min(simulation.steps.length - 1, prev + 1));
  };

  const handleStepBackward = () => {
    setCurrentStepIdx(prev => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const copyCodeToClipboard = () => {
    const codeText = CPP_SNIPPETS[problem.id]?.code || '';
    navigator.clipboard.writeText(codeText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Automatic scrolling for active C++ code line
  useEffect(() => {
    if (!simulation || !simulation.steps[currentStepIdx]) return;
    const activeLine = simulation.steps[currentStepIdx].line;
    const lineEl = document.getElementById(`cpp-line-${activeLine}`);
    if (lineEl && codeContainerRef.current) {
      const parent = codeContainerRef.current;
      const top = lineEl.offsetTop - parent.offsetTop - 40;
      parent.scrollTo({ top, behavior: 'smooth' });
    }
  }, [currentStepIdx, simulation]);

  const currentStep = simulation?.steps[currentStepIdx] || null;

  // Build Chronological logs
  const getLogsUpToCurrent = () => {
    if (!simulation) return [];
    return simulation.steps.slice(0, currentStepIdx + 1).map(s => s.logEntry).filter(Boolean) as string[];
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FAF9F6]">
      {/* ZONE 1: TOP STICKY HEADER */}
      <header className="h-16 flex shrink-0 items-center justify-between border-b border-slate-200 px-6 bg-white z-20">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-200 flex items-center justify-center">
            <Calculator className="w-4.5 h-4.5 text-amber-800 font-bold" />
          </div>
          <div>
            <span className="text-lg font-serif font-semibold text-slate-900 tracking-tight">Sigma Math Engine</span>
            <span className="ml-2 text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 bg-amber-100 border border-amber-200 rounded text-amber-800">
              Interactive
            </span>
          </div>
        </div>

        {/* Sequential Navigation Dropdown */}
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentProblemIdx(p => Math.max(0, p - 1))}
            disabled={currentProblemIdx === 0}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Previous Problem"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <select 
            value={currentProblemIdx}
            onChange={(e) => setCurrentProblemIdx(parseInt(e.target.value, 10))}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <optgroup label="1. Prefix Sum & Range Queries">
              {PROBLEMS.filter(p => p.moduleId === 'prefix-1d').map(p => (
                <option key={p.id} value={PROBLEMS.indexOf(p)}>
                  {p.seqNumber.toString().padStart(2, '0')}. {p.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="2. Hash Map Subarrays & Difference">
              {PROBLEMS.filter(p => p.moduleId === 'prefix-hashmap').map(p => (
                <option key={p.id} value={PROBLEMS.indexOf(p)}>
                  {p.seqNumber.toString().padStart(2, '0')}. {p.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="3. Primes, GCD & Powers">
              {PROBLEMS.filter(p => p.moduleId === 'number-theory').map(p => (
                <option key={p.id} value={PROBLEMS.indexOf(p)}>
                  {p.seqNumber.toString().padStart(2, '0')}. {p.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="4. Integer & Digit Algebra">
              {PROBLEMS.filter(p => p.moduleId === 'integer-math').map(p => (
                <option key={p.id} value={PROBLEMS.indexOf(p)}>
                  {p.seqNumber.toString().padStart(2, '0')}. {p.title}
                </option>
              ))}
            </optgroup>
          </select>

          <button 
            onClick={() => setCurrentProblemIdx(p => Math.min(PROBLEMS.length - 1, p + 1))}
            disabled={currentProblemIdx === PROBLEMS.length - 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Next Problem"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Setup actions / Preset resets */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleTriggerSimulation(problem)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 border border-amber-200 text-amber-950 transition-colors shadow-sm whitespace-nowrap"
          >
            Generate Simulation
          </button>
        </div>
      </header>

      {/* BODY WORKSPACE */}
      <main className="flex-1 flex flex-col min-h-0 px-6 py-4 overflow-hidden">
        
        {/* TOP QUESTION & TEST CASE CARD */}
        <section className="shrink-0 mb-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1 font-mono">
                <span>{problem.leetcodeTag}</span>
                <span>·</span>
                <span>Seq {problem.seqNumber.toString().padStart(2, '0')}</span>
                <span>·</span>
                <span className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                  problem.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700' :
                  problem.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
              <h2 className="text-xl font-serif font-bold text-slate-900 leading-snug">
                {problem.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsProblemDetailsExpanded(!isProblemDetailsExpanded)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                {isProblemDetailsExpanded ? "Hide Blueprint" : "Details & Invariants"}
              </button>
            </div>
          </div>

          {/* Collapsible Blueprint & Details */}
          {isProblemDetailsExpanded && (
            <div className="mt-3 p-4 bg-[#FAF9F6] border border-slate-200 rounded-xl text-sm text-slate-700 transition-all duration-300 shadow-2xs">
              <div className="whitespace-pre-line font-sans font-normal leading-relaxed text-slate-800 space-y-2">
                {problem.details}
              </div>
              <div className="mt-3 p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-lg text-xs font-mono text-amber-900 flex items-center gap-2">
                <span className="font-semibold text-amber-800 uppercase text-[9px] tracking-wider shrink-0 bg-amber-100 px-1.5 py-0.5 rounded">
                  Invariance Rule
                </span>
                <span>{problem.invariant}</span>
              </div>
            </div>
          )}

          {/* Test Case Inputs Panel */}
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            <div className="md:col-span-9 flex flex-wrap gap-3 items-center">
              {problem.inputSchema.type === 'array' && (
                <div className="flex-1 min-w-[200px] flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {problem.id === 'lc171_168' ? 'Excel Column Input (Title string or Column index number)' : 'Array Input (Comma-separated)'}
                  </label>
                  <input
                    type="text"
                    value={arrayInputStr}
                    onChange={(e) => setArrayInputStr(e.target.value)}
                    className="h-9 px-3 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              )}

              {problem.inputSchema.type === 'range-add-args' && (
                <>
                  {problem.id === 'lc370' ? (
                    <div className="w-24 flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Array Size</label>
                      <input
                        type="number"
                        min={3}
                        max={10}
                        value={numericTarget}
                        onChange={(e) => setNumericTarget(parseInt(e.target.value, 10) || 5)}
                        className="h-9 px-3 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  ) : (
                    <div className="flex-1 min-w-[180px] flex flex-col gap-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Array Input</label>
                      <input
                        type="text"
                        value={arrayInputStr}
                        onChange={(e) => setArrayInputStr(e.target.value)}
                        className="h-9 px-3 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-[180px] flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      {problem.id === 'lc370' ? 'Updates (L,R,val; separated by semicolons)' : 'Target Sum (k)'}
                    </label>
                    <input
                      type="text"
                      value={problem.id === 'lc370' ? updatesStr : numericTarget}
                      onChange={(e) => problem.id === 'lc370' ? setUpdatesStr(e.target.value) : setNumericTarget(parseInt(e.target.value, 10) || 0)}
                      className="h-9 px-3 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </>
              )}

              {problem.inputSchema.type === 'two-numbers' && (
                <>
                  <div className="w-28 flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Number A</label>
                    <input
                      type="number"
                      value={numericA}
                      onChange={(e) => setNumericA(parseInt(e.target.value, 10) || 0)}
                      className="h-9 px-3 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="w-28 flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Number B</label>
                    <input
                      type="number"
                      value={numericB}
                      onChange={(e) => setNumericB(parseInt(e.target.value, 10) || 0)}
                      className="h-9 px-3 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </>
              )}

              {problem.inputSchema.type === 'number' && (
                <div className="w-40 flex flex-col gap-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Input Value (N / X)</label>
                  <input
                    type="number"
                    value={numericX}
                    onChange={(e) => setNumericX(parseInt(e.target.value, 10) || 0)}
                    className="h-9 px-3 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              )}

              {problem.inputSchema.type === 'pow-args' && (
                <>
                  <div className="w-24 flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Base (x)</label>
                    <input
                      type="number"
                      value={numericA}
                      onChange={(e) => setNumericA(parseInt(e.target.value, 10) || 0)}
                      className="h-9 px-3 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="w-24 flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Power (n)</label>
                    <input
                      type="number"
                      min={0}
                      value={numericB}
                      onChange={(e) => setNumericB(parseInt(e.target.value, 10) || 0)}
                      className="h-9 px-3 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div className="w-28 flex flex-col gap-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Modulo (m)</label>
                    <input
                      type="number"
                      min={1}
                      value={numericMod}
                      onChange={(e) => setNumericMod(parseInt(e.target.value, 10) || 1)}
                      className="h-9 px-3 border border-slate-200 rounded-lg text-sm font-mono text-slate-800 w-full focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1 text-slate-500">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">Expected Result</span>
                <span className="h-9 flex items-center px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-800">
                  {simulation?.expectedOutput || 'N/A'}
                </span>
              </div>
            </div>

            {/* Simulate Execution Action Button */}
            <div className="md:col-span-3 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => {
                  // Restore presets
                  if (problem.inputSchema.type === 'array') {
                    if (problem.id === 'lc171_168') {
                      setArrayInputStr(problem.defaultInput.columnTitle);
                    } else {
                      setArrayInputStr(problem.defaultInput.nums.join(', '));
                    }
                  } else if (problem.inputSchema.type === 'range-add-args') {
                    if (problem.id === 'lc370') {
                      setNumericTarget(problem.defaultInput.size);
                      setUpdatesStr(problem.defaultInput.updates);
                    } else {
                      setArrayInputStr(problem.defaultInput.nums.join(', '));
                      setNumericTarget(problem.defaultInput.k);
                    }
                  } else if (problem.inputSchema.type === 'two-numbers') {
                    setNumericA(problem.defaultInput.a);
                    setNumericB(problem.defaultInput.b);
                  } else if (problem.inputSchema.type === 'number') {
                    setNumericX(problem.defaultInput.n || problem.defaultInput.x);
                  } else if (problem.inputSchema.type === 'pow-args') {
                    setNumericA(problem.defaultInput.base);
                    setNumericB(problem.defaultInput.exp);
                    setNumericMod(problem.defaultInput.mod);
                  }
                  setTimeout(() => handleTriggerSimulation(problem), 50);
                }}
                className="px-3 h-9 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
              >
                Reset Default
              </button>

              <button
                onClick={() => handleTriggerSimulation(problem)}
                className="px-4 h-9 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 border border-amber-400 text-amber-950 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                Simulate
              </button>
            </div>
          </div>
        </section>

        {/* SIDE-BY-SIDE SPLIT WORKSPACE (Viewport Constraint Applied) */}
        <div className="flex-1 flex gap-6 min-h-0 overflow-hidden">
          
          {/* LEFT COLUMN: VISUAL DUAL CANVAS */}
          <div className="flex-[7] flex flex-col h-full min-h-0">
            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-6 min-h-0 overflow-auto relative flex flex-col justify-center shadow-xs">
              
              {/* NO WORKSPACE LOADED EMPTY STATE */}
              {!simulation || simulation.steps.length === 0 ? (
                <div className="text-center py-10 max-w-md mx-auto">
                  <Calculator className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 text-sm">Please generate or click "Simulate" to load the active visual workspace.</p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col justify-center py-4">
                  
                  {/* MODULE RENDERER 1: 1D Prefix Sum & Range Query Foundations */}
                  {problem.moduleId === 'prefix-1d' && currentStep && (
                    problem.id === 'lc42' ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-semibold text-slate-500 tracking-wide">Elevation Map & Trapped Rainwater</span>
                          <span className="text-[10px] font-mono text-slate-400">water[i] = min(leftMax[i], rightMax[i]) - height[i]</span>
                        </div>

                        {/* Rain Accumulation Visual Grid */}
                        <div className="flex gap-4 justify-center items-end h-56 bg-slate-900/5 border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
                          {/* Rain falling visual overlay lines */}
                          <div className="absolute inset-0 pointer-events-none opacity-40">
                            <div className="absolute top-2 left-1/4 w-0.5 h-6 bg-blue-300 rounded animate-bounce delay-100" />
                            <div className="absolute top-6 left-1/2 w-0.5 h-8 bg-blue-300 rounded animate-bounce delay-300" />
                            <div className="absolute top-1 left-2/3 w-0.5 h-5 bg-blue-300 rounded animate-bounce delay-200" />
                            <div className="absolute top-4 left-4/5 w-0.5 h-7 bg-blue-300 rounded animate-bounce delay-500" />
                            <div className="absolute top-8 left-10 w-0.5 h-4 bg-blue-300 rounded animate-bounce delay-700" />
                          </div>

                          {currentStep.array?.map((height, idx) => {
                            const lMax = currentStep.variables.leftMax?.[idx] ?? 0;
                            const rMax = currentStep.variables.rightMax?.[idx] ?? 0;
                            const bound = Math.min(lMax, rMax);
                            const trapped = currentStep.variables.water?.[idx] ?? 0;
                            const isActive = currentStep.activeIndex === idx;

                            return (
                              <div key={idx} className="flex flex-col items-center flex-1 max-w-[60px] h-full justify-end relative">
                                {/* Boundary indicators */}
                                {isActive && (
                                  <div className="absolute inset-x-0 -top-8 flex flex-col items-center">
                                    <span className="text-[9px] font-mono font-bold bg-amber-500 text-amber-950 px-1 py-0.5 rounded shadow-sm whitespace-nowrap">
                                      min({lMax},{rMax})={bound}
                                    </span>
                                    <div className="w-0.5 h-8 bg-dashed border-l border-amber-500" />
                                  </div>
                                )}

                                {/* Stack column of blocks */}
                                <div className="w-full relative flex flex-col justify-end rounded-lg overflow-hidden border border-slate-300 shadow-2xs h-full bg-slate-100/50">
                                  {/* Water segment */}
                                  {trapped > 0 && (
                                    <div 
                                      className="bg-blue-400/80 border-t border-blue-500 flex items-center justify-center text-[10px] font-mono font-bold text-white transition-all duration-500 relative"
                                      style={{ height: `${(trapped / 4) * 100}%` }}
                                    >
                                      <span className="relative z-10">+{trapped}</span>
                                      {/* animated rain ripple */}
                                      <div className="absolute inset-0 bg-blue-300/30 animate-pulse" />
                                    </div>
                                  )}

                                  {/* Solid height segment */}
                                  <div 
                                    className={`transition-all duration-500 ${
                                      isActive 
                                        ? 'bg-amber-600 border-t-2 border-amber-400 text-white font-bold' 
                                        : 'bg-slate-700 text-slate-100'
                                    } flex items-center justify-center text-xs font-mono`}
                                    style={{ height: `${(height / 4) * 100}%` }}
                                  >
                                    {height}
                                  </div>
                                </div>

                                <span className="text-[10px] font-mono text-slate-400 mt-2">i={idx}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Interactive Dynamic Water Step Calculations Card */}
                        {typeof currentStep.activeIndex === 'number' && (
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-4 gap-2 text-center text-xs font-mono">
                            <div className="p-1">
                              <span className="block text-[9px] uppercase text-slate-400">Left Max</span>
                              <span className="font-bold text-slate-700">{currentStep.variables.leftMax?.[currentStep.activeIndex]}</span>
                            </div>
                            <div className="p-1">
                              <span className="block text-[9px] uppercase text-slate-400">Right Max</span>
                              <span className="font-bold text-slate-700">{currentStep.variables.rightMax?.[currentStep.activeIndex]}</span>
                            </div>
                            <div className="p-1">
                              <span className="block text-[9px] uppercase text-slate-400">Elevation</span>
                              <span className="font-bold text-amber-800">{currentStep.array?.[currentStep.activeIndex]}</span>
                            </div>
                            <div className="p-1 bg-blue-50 border border-blue-100 rounded-lg">
                              <span className="block text-[9px] uppercase text-blue-500 font-bold">Trapped Water</span>
                              <span className="font-bold text-blue-700">+{currentStep.variables.water?.[currentStep.activeIndex] ?? 0}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-12">
                        {/* Upper Track: Original Array */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-slate-500 tracking-wide">Original Array nums[i]</span>
                            <span className="text-[10px] font-mono text-slate-400">0-based index</span>
                          </div>
                          <div className="flex gap-2 justify-center">
                            {currentStep.array?.map((val, idx) => {
                              const isHighlighted = currentStep.activeIndex === idx;
                              const isRangeHighlighted = currentStep.leftRightRange && idx >= currentStep.leftRightRange[0] && idx <= currentStep.leftRightRange[1];
                              const highlightStyle = isHighlighted
                                ? 'bg-amber-500 text-amber-950 border-amber-600 font-bold scale-105'
                                : isRangeHighlighted
                                ? 'bg-amber-50 border-amber-200 text-amber-900'
                                : 'bg-slate-50 border-slate-200 text-slate-700';

                              return (
                                <div key={idx} className="flex flex-col items-center">
                                  <div className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-sm font-mono shadow-xs transition-all duration-300 ${highlightStyle}`}>
                                    {val}
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-400 mt-1">i={idx}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Connection Curved Visualizations or Cumulative Flow Arcs */}
                        <div className="relative h-10 flex items-center justify-center">
                          {currentStep.variables.phase === 'constructor' && typeof currentStep.activeIndex === 'number' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-xs font-mono px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 animate-pulse flex items-center gap-1.5">
                                <span>prefix[{currentStep.activeIndex + 1}] = prefix[{currentStep.activeIndex}] + nums[{currentStep.activeIndex}]</span>
                              </div>
                            </div>
                          )}
                          {currentStep.variables.phase === 'query' && currentStep.leftRightRange && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-xs font-mono px-3 py-1 bg-rose-50 border border-rose-200 rounded-full text-rose-800 flex items-center gap-2">
                                <span>Sum({currentStep.leftRightRange[0]}, {currentStep.leftRightRange[1]}) = prefix[{currentStep.leftRightRange[1] + 1}] - prefix[{currentStep.leftRightRange[0]}]</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Lower Track: Prefix Sum Array */}
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-semibold text-slate-500 tracking-wide">Cumulative prefix[i]</span>
                            <span className="text-[10px] font-mono text-slate-400">1-indexed sentinel prefix[0] = 0</span>
                          </div>
                          <div className="flex gap-2 justify-center">
                            {currentStep.prefixArray?.map((val, idx) => {
                              const activeIdx = currentStep.activeIndex;
                              const isSentinel = idx === 0;
                              
                              // Highlight newly constructed cells
                              const isJustAdded = typeof activeIdx === 'number' && idx === activeIdx + 1;
                              const isLeftQuery = currentStep.variables.phase === 'query' && currentStep.leftRightRange && idx === currentStep.leftRightRange[0];
                              const isRightQuery = currentStep.variables.phase === 'query' && currentStep.leftRightRange && idx === currentStep.leftRightRange[1] + 1;

                              let bgStyle = 'bg-slate-50 border-slate-200 text-slate-700';
                              if (isSentinel) bgStyle = 'bg-slate-100/80 border-slate-300 text-slate-400 font-normal';
                              if (isJustAdded) bgStyle = 'bg-amber-500 border-amber-600 text-amber-950 font-bold scale-105';
                              if (isLeftQuery) bgStyle = 'bg-emerald-500 border-emerald-600 text-white font-bold scale-105';
                              if (isRightQuery) bgStyle = 'bg-rose-500 border-rose-600 text-white font-bold scale-105';

                              return (
                                <div key={idx} className="flex flex-col items-center">
                                  <div className={`w-14 h-14 rounded-lg border-2 flex items-center justify-center text-sm font-mono shadow-xs transition-all duration-300 ${bgStyle}`}>
                                    {val}
                                  </div>
                                  <span className="text-[10px] font-mono text-slate-400 mt-1">i={idx}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {/* MODULE RENDERER 2: Prefix Sum with Hash Map Lookups */}
                  {problem.moduleId === 'prefix-hashmap' && currentStep && (
                    <div className="space-y-6">
                      
                      {/* Array Track (For LC 370 Difference array, render separately) */}
                      {problem.id !== 'lc370' && (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-semibold text-slate-500">Array nums[i]</span>
                            <span className="text-[10px] font-mono text-slate-400">Current index i = {currentStep.variables.i}</span>
                          </div>
                          <div className="flex gap-2 justify-center">
                            {currentStep.array?.map((val, idx) => {
                              const isCurrent = currentStep.variables.i === idx;
                              const highlight = isCurrent 
                                ? 'bg-amber-500 text-amber-950 border-amber-600 font-bold scale-105' 
                                : 'bg-slate-50 border-slate-200 text-slate-600';
                              
                              return (
                                <div key={idx} className="flex flex-col items-center">
                                  <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-mono transition-all duration-300 ${highlight}`}>
                                    {val}
                                  </div>
                                  <span className="text-[9px] font-mono text-slate-400 mt-1">i={idx}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* State Ribbon & Formulas */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-3 gap-4">
                        <div className="text-center border-r border-slate-200">
                          <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">Running Sum</span>
                          <span className="text-lg font-mono font-bold text-slate-800">{currentStep.variables.currSum ?? 0}</span>
                        </div>
                        <div className="text-center border-r border-slate-200">
                          <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            {problem.id === 'lc523' ? 'Mod Remainder % k' : 'Target Search (currSum - k)'}
                          </span>
                          <span className="text-lg font-mono font-bold text-amber-700">
                            {problem.id === 'lc523' ? (currentStep.variables.rem ?? 'N/A') : (currentStep.variables.targetSearch ?? 'N/A')}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="block text-[10px] font-mono uppercase tracking-wider text-slate-400">
                            {problem.id === 'lc523' ? 'Valid Subarray?' : 'Subarrays Found'}
                          </span>
                          <span className="text-lg font-mono font-bold text-emerald-700">
                            {problem.id === 'lc523' 
                              ? (currentStep.variables.isValid ? 'YES! ✔' : 'NO') 
                              : (currentStep.variables.count ?? currentStep.variables.maxLen ?? 0)}
                          </span>
                        </div>
                      </div>

                      {/* LC #370: Range Addition & Difference Array Visualization */}
                      {problem.id === 'lc370' && currentStep.diffArray && (
                        <div className="space-y-6">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-semibold text-slate-500">Difference Array diff[i]</span>
                              <span className="text-[10px] font-mono text-slate-400">Step details</span>
                            </div>
                            <div className="flex gap-2 justify-center">
                              {currentStep.diffArray.map((val, idx) => {
                                const isStartHighlight = currentStep.variables.start === idx;
                                const isEndHighlight = currentStep.variables.nextEnd === idx;
                                const isSweepActive = currentStep.variables.phase === 'prefix-sweep' && currentStep.variables.i === idx;

                                let borderStyle = 'border-slate-200 bg-slate-50 text-slate-700';
                                if (isStartHighlight) borderStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold scale-105';
                                if (isEndHighlight) borderStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold scale-105';
                                if (isSweepActive) borderStyle = 'border-amber-500 bg-amber-50 text-amber-950 font-bold scale-105';

                                return (
                                  <div key={idx} className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xs font-mono transition-all duration-300 ${borderStyle}`}>
                                      {val}
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-400 mt-1">i={idx}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Query card inside Visual Canvas */}
                          {currentStep.variables.phase === 'updates' && (
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center font-mono text-xs text-slate-700">
                              <span>Applying Update Query: Range [{currentStep.variables.start}, {currentStep.variables.end}] with val {currentStep.variables.val}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Hash Map Table */}
                      {problem.id !== 'lc370' && currentStep.hashMap && (
                        <div>
                          <div className="text-xs font-semibold text-slate-500 mb-2">Hash Map Table state (prefixSum → frequency/earliestIndex)</div>
                          <div className="max-h-28 overflow-y-auto border border-slate-200 rounded-lg bg-slate-50/50">
                            <table className="w-full text-xs font-mono text-slate-600">
                              <thead>
                                <tr className="border-b border-slate-200 bg-slate-100/50">
                                  <th className="px-4 py-1 text-left font-semibold">Key (Prefix Sum / Remainder)</th>
                                  <th className="px-4 py-1 text-right font-semibold">Value (Frequency / Earliest Index)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Object.keys(currentStep.hashMap).length === 0 ? (
                                  <tr>
                                    <td colSpan={2} className="px-4 py-2 text-center text-slate-400 italic">Empty map</td>
                                  </tr>
                                ) : (
                                  Object.entries(currentStep.hashMap).map(([key, value]) => {
                                    const isTargetKey = problem.id === 'lc523' 
                                      ? (currentStep.variables.rem?.toString() === key)
                                      : (currentStep.variables.targetSearch?.toString() === key || currentStep.variables.currSum?.toString() === key);
                                    
                                    const rowBg = isTargetKey ? 'bg-emerald-50 text-emerald-950 font-bold' : '';

                                    return (
                                      <tr key={key} className={`border-b border-slate-100 transition-colors ${rowBg}`}>
                                        <td className="px-4 py-1.5 flex items-center gap-1.5">
                                          {isTargetKey && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                                          {key}
                                        </td>
                                        <td className="px-4 py-1.5 text-right">{value.toString()}</td>
                                      </tr>
                                    );
                                  })
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODULE RENDERER 3: Essential Number Theory & Prime Algorithms */}
                  {problem.moduleId === 'number-theory' && currentStep && (
                    <div className="space-y-6">
                      
                      {/* Euclidean GCD Geometric Demonstration */}
                      {problem.id === 'gcd' && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                              <span className="block text-[10px] font-mono text-slate-400">Dividend (a)</span>
                              <span className="text-lg font-mono font-bold text-slate-800">{currentStep.variables.a}</span>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                              <span className="block text-[10px] font-mono text-slate-400">Divisor (b)</span>
                              <span className="text-lg font-mono font-bold text-amber-700">{currentStep.variables.b}</span>
                            </div>
                          </div>

                          {/* Relative Proportion Bars */}
                          <div className="space-y-3 p-4 bg-slate-50/50 border border-slate-200 rounded-lg flex flex-col justify-center min-h-[140px]">
                            {currentStep.variables.b !== 0 ? (
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                                    <span>Bar a ({currentStep.variables.a})</span>
                                  </div>
                                  <div 
                                    className="h-8 bg-slate-800 rounded-lg transition-all duration-500 ease-in-out flex items-center px-3 text-xs font-mono text-white font-semibold"
                                    style={{ width: `${Math.max(10, (currentStep.variables.a / Math.max(currentStep.variables.originalA, 1)) * 100)}%` }}
                                  >
                                    {currentStep.variables.a}
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                                    <span>Bar b ({currentStep.variables.b})</span>
                                  </div>
                                  <div 
                                    className="h-8 bg-amber-500 rounded-lg transition-all duration-500 ease-in-out flex items-center px-3 text-xs font-mono text-amber-950 font-semibold"
                                    style={{ width: `${Math.max(10, (currentStep.variables.b / Math.max(currentStep.variables.originalA, 1)) * 100)}%` }}
                                  >
                                    {currentStep.variables.b}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                                <span className="text-sm font-mono font-semibold text-emerald-800">
                                  GCD Found: {currentStep.variables.a}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Count Primes / Sieve of Eratosthenes Sieve Grid */}
                      {problem.id === 'lc204' && (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-slate-500">Sieve Grid (2 to N-1)</span>
                            <span className="text-[10px] font-mono text-slate-400">Current Prime: p = {currentStep.variables.p ?? 'None'}</span>
                          </div>

                          <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 justify-center">
                            {Array.from({ length: currentStep.variables.n - 2 }, (_, i) => {
                              const num = i + 2;
                              const isCurrentP = currentStep.activeP === num;
                              const isMultipleActive = currentStep.activeMultiple === num;
                              
                              // Check if index is composite according to step snapshot
                              const isCompositeSnapshot = currentStep.variables.isPrime 
                                ? (currentStep.variables.isPrime[num] === false)
                                : false;

                              let cellStyle = 'bg-white border-slate-200 text-slate-700';
                              
                              if (isCurrentP) {
                                cellStyle = 'bg-emerald-500 text-white border-emerald-600 font-bold scale-105 shadow-md';
                              } else if (isMultipleActive) {
                                cellStyle = 'bg-rose-500 text-white border-rose-600 font-bold scale-105 shadow-md animate-pulse';
                              } else if (isCompositeSnapshot) {
                                cellStyle = 'bg-slate-100 border-slate-200 text-slate-400 line-through opacity-70';
                              } else if (currentStep.variables.phase === 'counting' && currentStep.variables.isPrime?.[num]) {
                                cellStyle = 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold';
                              }

                              return (
                                <div 
                                  key={num} 
                                  className={`h-12 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-mono transition-all duration-300 relative overflow-hidden ${cellStyle}`}
                                >
                                  <span className="font-bold text-sm">{num}</span>
                                  <span className="text-[8px] opacity-75">
                                    {isCurrentP ? 'PRIME' : isMultipleActive ? 'STRIKE' : isCompositeSnapshot ? 'COMP' : 'WAIT'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Binary Modular Exponentiation Register */}
                      {problem.id === 'lc50' && (
                        <div className="space-y-6">
                          {/* Top calculations */}
                          <div className="grid grid-cols-4 gap-2 text-center">
                            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                              <span className="block text-[9px] font-mono text-slate-400">Base</span>
                              <span className="text-sm font-mono font-bold text-slate-800">{currentStep.variables.base}</span>
                            </div>
                            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                              <span className="block text-[9px] font-mono text-slate-400">Exponent</span>
                              <span className="text-sm font-mono font-bold text-slate-800">{currentStep.variables.exp}</span>
                            </div>
                            <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg">
                              <span className="block text-[9px] font-mono text-slate-400">Modulo</span>
                              <span className="text-sm font-mono font-bold text-slate-800">{currentStep.variables.mod}</span>
                            </div>
                            <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
                              <span className="block text-[9px] font-mono text-amber-800">Current Ans</span>
                              <span className="text-sm font-mono font-bold text-amber-950">{currentStep.variables.ans}</span>
                            </div>
                          </div>

                          {/* Exponent in Binary Register */}
                          <div>
                            <span className="block text-xs font-semibold text-slate-500 mb-2">Exponent Binary Register</span>
                            <div className="flex gap-2 justify-center">
                              {currentStep.variables.originalExp.toString(2).split('').map((bit: string, idx: number, arr: string[]) => {
                                // Determine if this bit position is active / current
                                const currentBitLen = currentStep.variables.exp.toString(2).length;
                                const totalBitLen = arr.length;
                                const isActive = (totalBitLen - idx) === currentBitLen;

                                let bitStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                                if (isActive) {
                                  bitStyle = bit === '1' 
                                    ? 'bg-emerald-500 border-emerald-600 text-white font-bold scale-105'
                                    : 'bg-amber-500 border-amber-600 text-white font-bold scale-105';
                                }

                                return (
                                  <div key={idx} className="flex flex-col items-center">
                                    <div className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center text-sm font-mono transition-all duration-300 ${bitStyle}`}>
                                      {bit}
                                    </div>
                                    <span className="text-[9px] font-mono text-slate-400 mt-1">2^{totalBitLen - idx - 1}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* MODULE RENDERER 4: Integer Manipulation & Digit Math */}
                  {problem.moduleId === 'integer-math' && currentStep && (
                    <div className="space-y-6">
                      
                      {/* Sub-view A: Excel Column Conversions (lc171_168) */}
                      {problem.id === 'lc171_168' && (
                        <div className="space-y-4">
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                            <span className="block text-xs font-semibold text-slate-500">Spreadsheet Bijective Conversion Tracker</span>
                            <div className="flex justify-center items-center gap-2">
                              {currentStep.variables.s ? (
                                // Title to Number
                                <div className="flex gap-2">
                                  {currentStep.variables.s.split('').map((char: string, idx: number) => {
                                    const isCurrent = currentStep.variables.charIndex === idx;
                                    const style = isCurrent 
                                      ? 'bg-amber-500 border-amber-600 text-amber-950 font-bold scale-105'
                                      : idx < currentStep.variables.charIndex
                                      ? 'bg-slate-100 border-slate-200 text-slate-400'
                                      : 'bg-white border-slate-200 text-slate-700';
                                    return (
                                      <div key={idx} className={`w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center text-xs font-mono transition-all duration-300 ${style}`}>
                                        <span className="text-sm font-bold">{char}</span>
                                        <span className="text-[9px] opacity-75">x26</span>
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                // Number to Title
                                <div className="text-center font-mono py-2">
                                  <div className="text-xs text-slate-400 mb-1">Target Number to Convert</div>
                                  <div className="text-xl font-bold text-slate-800">{currentStep.variables.originalNumber}</div>
                                </div>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200 text-center">
                              <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                                <span className="block text-[10px] font-mono text-slate-400">Current Accumulator / Char Val</span>
                                <span className="text-sm font-mono font-bold text-amber-900">{currentStep.variables.charVal ?? currentStep.variables.rem ?? 'N/A'}</span>
                              </div>
                              <div className="bg-white p-2.5 rounded-lg border border-slate-100">
                                <span className="block text-[10px] font-mono text-slate-400">Title Result / Number Result</span>
                                <span className="text-sm font-mono font-bold text-emerald-800">{currentStep.variables.result ?? currentStep.variables.titleResult ?? 'N/A'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sub-view B: Factorial Trailing Zeroes (lc172) */}
                      {problem.id === 'lc172' && (
                        <div className="space-y-4">
                          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                            <span className="block text-xs font-semibold text-slate-500">Trailing Zeros Distribution (Factors of 5)</span>
                            <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-100 text-center">
                              <div>
                                <span className="block text-[9px] font-mono text-slate-400 font-bold">Current N</span>
                                <span className="text-base font-mono font-bold text-slate-800">{currentStep.variables.n}</span>
                              </div>
                              <div className="text-slate-300">/ 5 →</div>
                              <div>
                                <span className="block text-[9px] font-mono text-slate-400 font-bold">Added Zeros</span>
                                <span className="text-base font-mono font-bold text-amber-700">{currentStep.variables.addedZeros ?? '0'}</span>
                              </div>
                              <div className="text-slate-300">Sum →</div>
                              <div>
                                <span className="block text-[9px] font-mono text-amber-800 font-bold font-bold">Total Zeroes</span>
                                <span className="text-base font-mono font-bold text-emerald-800">{currentStep.variables.count}</span>
                              </div>
                            </div>

                            {/* visual scale factors card */}
                            <div className="flex gap-2 justify-center py-2">
                              {[5, 25, 125, 625].map((power) => {
                                const isCurrentPower = currentStep.variables.power5 === power;
                                const isExhausted = power > currentStep.variables.originalN;
                                const style = isCurrentPower
                                  ? 'bg-amber-500 border-amber-600 text-amber-950 font-bold scale-105'
                                  : isExhausted
                                  ? 'bg-slate-100 border-slate-200 text-slate-300'
                                  : 'bg-white border-slate-200 text-slate-700';

                                return (
                                  <div key={power} className={`px-3 py-1.5 rounded-lg border text-xs font-mono flex flex-col items-center transition-all duration-300 ${style}`}>
                                    <span className="font-semibold">5^{[5,25,125,625].indexOf(power) + 1}</span>
                                    <span className="text-[9px] opacity-75">Val: {power}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Sub-view C: General digit extraction (lc7, lc9) */}
                      {(problem.id === 'lc7' || problem.id === 'lc9') && (
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <span className="text-xs font-semibold text-slate-500">Live Digit Extraction Stream</span>
                            <span className="text-[10px] font-mono text-slate-400">Current x = {currentStep.variables.x ?? '0'}</span>
                          </div>

                          <div className="flex items-center justify-center gap-6 py-2">
                            {/* Input Number Remaining digits */}
                            <div className="text-center">
                              <span className="block text-[10px] font-mono text-slate-400 mb-1">Remaining N</span>
                              <span className="text-xl font-mono font-bold text-slate-700 bg-white border border-slate-200 px-4 py-2 rounded-lg shadow-2xs">
                                {currentStep.variables.x ?? '0'}
                              </span>
                            </div>

                            <ArrowRight className="w-5 h-5 text-slate-300" />

                            {/* Extracted Digit indicator */}
                            <div className="text-center">
                              <span className="block text-[10px] font-mono text-slate-400 mb-1">Popped Digit</span>
                              <span className="text-xl font-mono font-bold text-amber-950 bg-amber-500 border border-amber-400 px-4 py-2 rounded-lg shadow-2xs">
                                {currentStep.variables.digit ?? currentStep.variables.pop ?? '0'}
                              </span>
                            </div>

                            <ArrowRight className="w-5 h-5 text-slate-300" />

                            {/* Accumulated Result */}
                            <div className="text-center">
                              <span className="block text-[10px] font-mono text-slate-400 mb-1">Accumulator (rev)</span>
                              <span className="text-xl font-mono font-bold text-emerald-950 bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-lg shadow-2xs">
                                {currentStep.variables.rev ?? currentStep.variables.reversedNum ?? currentStep.variables.count ?? currentStep.variables.result ?? '0'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* INT OVERFLOW GAUGE (for Reverse Integer / Palindrome) */}
                      {(problem.id === 'lc7' || problem.id === 'lc9') && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-mono text-slate-400">
                            <span>INT_MIN (-2147483648)</span>
                            <span>Overflow Boundary Monitor</span>
                            <span>INT_MAX (2147483647)</span>
                          </div>
                          <div className="h-4 w-full bg-slate-100 rounded-full border border-slate-200 overflow-hidden relative">
                            {/* Marker of current accumulation */}
                            <div 
                              className="absolute top-0 bottom-0 w-2 bg-amber-500 rounded-full transition-all duration-300"
                              style={{ 
                                left: `${50 + ((currentStep.variables.rev ?? currentStep.variables.reversedNum ?? 0) / 2147483647) * 50}%` 
                              }}
                            />
                            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* DOCKED PLAYBACK BAR */}
            <div className="shrink-0 mt-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              {/* Stepper Scrubber Slider */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono text-slate-400 shrink-0 select-none">
                  Step {currentStepIdx + 1} of {simulation?.steps.length || 1}
                </span>
                <input
                  type="range"
                  min={0}
                  max={(simulation?.steps.length || 1) - 1}
                  value={currentStepIdx}
                  onChange={(e) => {
                    setCurrentStepIdx(parseInt(e.target.value, 10));
                    setIsPlaying(false);
                  }}
                  className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons row */}
              <div className="flex items-center justify-between gap-4">
                {/* Simulation playback trigger buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleReset}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    title="Reset Simulation (Shortcut: R)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleStepBackward}
                    disabled={currentStepIdx === 0}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    title="Step Backward (Shortcut: Left)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsPlaying(p => !p)}
                    className="h-10 px-5 rounded-lg bg-amber-500 hover:bg-amber-600 border border-amber-400 text-amber-950 font-semibold transition-colors shadow-sm flex items-center gap-2"
                    title="Play / Pause (Shortcut: Space)"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-amber-950" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>

                  <button
                    onClick={handleStepForward}
                    disabled={!simulation || currentStepIdx === simulation.steps.length - 1}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
                    title="Step Forward (Shortcut: Right)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Speed and keyboard helper labels */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <span className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded">Space</span> play/pause
                    <span className="px-1 py-0.5 bg-slate-100 border border-slate-200 rounded ml-1">←/→</span> step
                  </div>
                  
                  <select
                    value={playbackSpeed}
                    onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                    className="h-9 px-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700"
                  >
                    <option value={0.5}>0.5x Speed</option>
                    <option value={1}>1.0x Speed</option>
                    <option value={2}>2.0x Speed</option>
                  </select>
                </div>
              </div>

              {/* Real-time Operational Description Banner */}
              {currentStep && (
                <div className="mt-3 p-3 bg-amber-50/40 border border-amber-200/50 rounded-lg flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                  <p className="text-xs font-medium text-amber-950 leading-relaxed">
                    {currentStep.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: SYNCHRONIZED TRACE & STATE INSPECTOR */}
          <div className="flex-[5] flex flex-col h-full min-h-0 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            {/* Tabs Header */}
            <div className="shrink-0 h-11 flex border-b border-slate-200 bg-slate-50/50">
              <button
                onClick={() => setActiveTab('cpp')}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'cpp' 
                    ? 'border-amber-500 text-slate-900 bg-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileCode2 className="w-4 h-4" />
                C++ Trace
              </button>
              <button
                onClick={() => setActiveTab('inspector')}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'inspector' 
                    ? 'border-amber-500 text-slate-900 bg-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Cpu className="w-4 h-4" />
                Live State
              </button>
              <button
                onClick={() => setActiveTab('proofs')}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'proofs' 
                    ? 'border-amber-500 text-slate-900 bg-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Proofs
              </button>
              <button
                onClick={() => setActiveTab('log')}
                className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold border-b-2 transition-all ${
                  activeTab === 'log' 
                    ? 'border-amber-500 text-slate-900 bg-white' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <History className="w-4 h-4" />
                Chronological Log
              </button>
            </div>

            {/* Tabs Content */}
            <div className="flex-1 overflow-auto p-4">
              
              {/* TAB 1: C++ TRACE CODE PANEL */}
              {activeTab === 'cpp' && (
                <div className="h-full flex flex-col relative min-h-0">
                  <div className="absolute top-1 right-1 z-10">
                    <button
                      onClick={copyCodeToClipboard}
                      className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex items-center gap-1 text-[10px]"
                      title="Copy Source Snippet"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div 
                    ref={codeContainerRef}
                    className="flex-1 overflow-y-auto bg-slate-950 rounded-lg p-3 font-mono text-[11px] leading-relaxed text-slate-300 scroll-smooth min-h-0"
                  >
                    {CPP_SNIPPETS[problem.id]?.code.split('\n').map((lineText, idx) => {
                      const lineNum = idx + 1;
                      const isActive = currentStep?.line === lineNum;
                      
                      return (
                        <div 
                          key={lineNum} 
                          id={`cpp-line-${lineNum}`}
                          className={`flex items-start transition-all duration-300 py-0.5 px-2 rounded -mx-1 ${
                            isActive 
                              ? 'bg-amber-500/20 text-amber-300 border-l-2 border-amber-500 font-medium' 
                              : ''
                          }`}
                        >
                          <span className="w-6 shrink-0 text-slate-600 select-none text-right pr-2 font-mono">
                            {lineNum}
                          </span>
                          <pre className="whitespace-pre-wrap word-break break-all">{lineText || ' '}</pre>
                        </div>
                      );
                    })}
                  </div>

                  {/* Line explanation hover helper */}
                  {currentStep && CPP_SNIPPETS[problem.id]?.lineDescriptions[currentStep.line] && (
                    <div className="mt-3 p-2 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-600 font-mono">
                      <span className="font-bold text-slate-800">C++ Line {currentStep.line}: </span>
                      {CPP_SNIPPETS[problem.id].lineDescriptions[currentStep.line]}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: LIVE STATE INSPECTOR CARD */}
              {activeTab === 'inspector' && (
                <div className="space-y-4 font-mono text-xs">
                  {currentStep ? (
                    <>
                      <div className="bg-[#FAF9F6] border border-slate-200 rounded-lg p-3 space-y-2">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Memory Registers</span>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(currentStep.variables).map(([key, val]) => {
                            if (typeof val === 'object' && val !== null) return null;
                            return (
                              <div key={key} className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-500">{key}:</span>
                                <span className="font-semibold text-slate-800">{val.toString()}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Display problem-specific diagnostic arrays */}
                      {currentStep.array && (
                        <div className="bg-[#FAF9F6] border border-slate-200 rounded-lg p-3 space-y-1">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Nums Vector</span>
                          <span className="text-slate-700 font-semibold text-[11px] block break-all">
                            [{currentStep.array.join(', ')}]
                          </span>
                        </div>
                      )}

                      {currentStep.prefixArray && (
                        <div className="bg-[#FAF9F6] border border-slate-200 rounded-lg p-3 space-y-1">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Prefix Vector</span>
                          <span className="text-slate-700 font-semibold text-[11px] block break-all">
                            [{currentStep.prefixArray.join(', ')}]
                          </span>
                        </div>
                      )}

                      {currentStep.diffArray && (
                        <div className="bg-[#FAF9F6] border border-slate-200 rounded-lg p-3 space-y-1">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Diff Vector</span>
                          <span className="text-slate-700 font-semibold text-[11px] block break-all">
                            [{currentStep.diffArray.join(', ')}]
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-slate-400 py-6 italic">No active step loaded.</div>
                  )}
                </div>
              )}

              {/* TAB 3: MATHEMATICAL PROOFS & INVARIANTS CARD */}
              {activeTab === 'proofs' && (
                <div className="prose text-xs text-slate-600 leading-relaxed font-sans space-y-4">
                  <h3 className="font-serif font-bold text-sm text-slate-800">Proofs & Theoretical Foundations</h3>
                  
                  {problem.moduleId === 'prefix-1d' && (
                    problem.id === 'lc42' ? (
                      <div className="space-y-3">
                        <p>
                          <strong>Trapping Rain Water Theorem:</strong> The amount of trapped water on top of any index <code className="font-mono bg-slate-50 px-1 py-0.5 rounded text-amber-800">i</code> is authoritatively bounded by the minimum of the highest peaks on its left and right boundaries:
                        </p>
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg font-mono text-xs text-amber-900 font-bold text-center">
                          {"water[i] = min(leftMax[i], rightMax[i]) - height[i]"}
                        </div>
                        <p>
                          By precalculating <code className="font-mono">leftMax</code> (prefix peak sweep) and <code className="font-mono">rightMax</code> (suffix peak sweep), we eliminate quadratic O(N²) scanning searches down to constant time <code className="font-mono text-amber-800 font-bold">O(1)</code> queries per element, solving the full profile in linear <code className="font-mono font-bold">O(N)</code> time.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p>
                          The cumulative sum precalculation constructs an auxiliary array <code className="font-mono bg-slate-50 px-1 py-0.5 rounded text-amber-800">P</code> of size <code className="font-mono">{"N + 1"}</code>.
                        </p>
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-800 leading-normal">
                          {"P[0] = 0"}<br />
                          {"P[i] = P[i-1] + nums[i-1] (for i >= 1)"}
                        </div>
                        <p>
                          By subtracting the left prefix sentinel, we obtain the interval slice sum in absolute <code className="font-mono text-amber-800 font-bold">O(1)</code> complexity:
                        </p>
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg font-mono text-xs text-amber-900 font-bold text-center">
                          {"Sum(L, R) = P[R + 1] - P[L]"}
                        </div>
                        <p>
                          This approach entirely eliminates repetitive linear scanning operations across multiple query transactions.
                        </p>
                      </div>
                    )
                  )}

                  {problem.moduleId === 'prefix-hashmap' && (
                    <div className="space-y-3">
                      <p>
                        For subarray targets <code className="font-mono">{"Sum(i, j) = k"}</code>, we leverage the associative identity:
                      </p>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-800 leading-normal text-center">
                        {"Prefix[j] - Prefix[i - 1] = k"}<br />
                        {"=> Prefix[i - 1] = Prefix[j] - k"}
                      </div>
                      <p>
                        By tracking cumulative sums sequentially inside a Hash Map, we search for matching gaps on the left boundaries dynamically in a single pass, resulting in linear <code className="font-mono text-amber-800 font-bold">O(N)</code> execution.
                      </p>
                    </div>
                  )}

                  {problem.moduleId === 'number-theory' && (
                    <div className="space-y-3">
                      <p>
                        <strong>Euclidean GCD:</strong> The greatest common divisor of <code className="font-mono">a</code> and <code className="font-mono">b</code> matches the divisor of the reduced modulo remainder:
                      </p>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-800 text-center">
                        gcd(a, b) = gcd(b, a mod b)
                      </div>
                      <p>
                        <strong>Sieve of Eratosthenes:</strong> Sieve complexity is bounded by prime reciprocals summing to log-log, specifically <code className="font-mono text-amber-800 font-bold">O(N log log N)</code>.
                      </p>
                    </div>
                  )}

                  {problem.moduleId === 'integer-math' && (
                    <div className="space-y-3">
                      <p>
                        <strong>Legendre's Formula:</strong> Trailing zeros in a factorial correspond to factor counts of prime 10, which depend directly on the frequency of factors of 5:
                      </p>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-800 text-center">
                        Trailing Zeros = ∑ floor(n / 5^k)
                      </div>
                      <p>
                        <strong>Bijective Base-26 Conversion:</strong> Excel titles utilize bijective number representations without 0 digits, mapping indices directly between [1-26] and [A-Z].
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CHRONOLOGICAL PROCESS LOG */}
              {activeTab === 'log' && (
                <div className="h-full flex flex-col min-h-0">
                  <div className="flex-1 overflow-y-auto bg-slate-50 rounded-lg p-3 font-mono text-[11px] leading-relaxed text-slate-600 min-h-0 space-y-1.5 border border-slate-200">
                    {getLogsUpToCurrent().length === 0 ? (
                      <div className="text-center text-slate-400 italic py-6">No execution logs logged.</div>
                    ) : (
                      getLogsUpToCurrent().map((log, idx) => (
                        <div key={idx} className="flex items-start gap-2 py-0.5 border-b border-slate-100 last:border-b-0">
                          <span className="text-slate-400 shrink-0 select-none">[{idx + 1}]</span>
                          <span className="text-slate-700">{log}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
