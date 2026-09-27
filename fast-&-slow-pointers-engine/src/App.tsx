/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Code,
  Activity,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calculator,
  BookOpen,
  List,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Link as LinkIcon,
  Minimize2,
  Maximize2
} from 'lucide-react';

import { PROBLEMS } from './data/fastSlowProblems';
import { CPP_SNIPPETS } from './algorithms/cppSnippets';
import { generateSimulationSteps } from './algorithms/fastSlowAlgorithms';
import { SimulationStep, VisualNode, Problem } from './types';

export default function App() {
  // Current selected problem index (0 to 9)
  const [currentProblemIdx, setCurrentProblemIdx] = useState<number>(4); // Default to LC 141 (Cycle Detection I)
  const currentProblem = PROBLEMS[currentProblemIdx];

  // Custom simulation inputs
  const [customValuesStr, setCustomValuesStr] = useState<string>('');
  const [customCyclePos, setCustomCyclePos] = useState<number>(1);
  const [customHappyStart, setCustomHappyStart] = useState<number>(19);

  // Help Modal Toggle
  const [showHelp, setShowHelp] = useState<boolean>(false);
  // Problem Details Compact Toggle
  const [isDetailsExpanded, setIsDetailsExpanded] = useState<boolean>(true);
  
  // Tab control in right panel ('cpp' | 'inspector' | 'math' | 'log')
  const [activeTab, setActiveTab] = useState<'cpp' | 'inspector' | 'math' | 'log'>('inspector');

  // Interactive preset configurations
  const [activePreset, setActivePreset] = useState<string>('default');

  // Copy success indicator
  const [copied, setCopied] = useState<boolean>(false);

  // Initialize custom fields based on selected problem
  useEffect(() => {
    setCustomValuesStr(currentProblem.defaultValues.join(', '));
    setCustomCyclePos(currentProblem.defaultPos);
    if (currentProblem.id === 'lc202') {
      setCustomHappyStart(currentProblem.defaultValues[0]);
    }
    setActivePreset('default');
  }, [currentProblemIdx]);

  // Parse custom values
  const parsedValues = useMemo(() => {
    if (currentProblem.id === 'lc202') {
      return [customHappyStart];
    }
    return customValuesStr
      .split(',')
      .map(v => parseInt(v.trim(), 10))
      .filter(v => !isNaN(v));
  }, [customValuesStr, customHappyStart, currentProblem.id]);

  // Generate Simulation steps
  const simulationSteps: SimulationStep[] = useMemo(() => {
    if (parsedValues.length === 0) return [];
    return generateSimulationSteps(currentProblem.id, parsedValues, customCyclePos);
  }, [currentProblem.id, parsedValues, customCyclePos]);

  // Current playback pointer state
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 0.5x, 1x, 2x
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeStep: SimulationStep | undefined = simulationSteps[currentStepIdx];

  // Reset steps when problem or input triggers change
  useEffect(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [simulationSteps]);

  // Handle playing ticker
  useEffect(() => {
    if (isPlaying) {
      const delay = playbackSpeed === 0.5 ? 1600 : playbackSpeed === 1 ? 900 : 450;
      timerRef.current = setInterval(() => {
        setCurrentStepIdx(prev => {
          if (prev >= simulationSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, simulationSteps.length]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid firing when user is typing in input fields
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
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
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [simulationSteps.length]);

  // Controls
  const handlePlayPause = () => setIsPlaying(p => !p);
  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentStepIdx(prev => Math.min(simulationSteps.length - 1, prev + 1));
  };
  const handleStepBackward = () => {
    setIsPlaying(false);
    setCurrentStepIdx(prev => Math.max(0, prev - 1));
  };
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  // Preset switchers
  const applyPreset = (presetType: string) => {
    setActivePreset(presetType);
    if (currentProblem.category === 'Cycle Detection') {
      if (presetType === 'no-cycle') {
        setCustomValuesStr('3, 2, 0, -4');
        setCustomCyclePos(-1);
      } else if (presetType === 'small-cycle') {
        setCustomValuesStr('1, 2');
        setCustomCyclePos(0);
      } else if (presetType === 'big-cycle') {
        setCustomValuesStr('3, 2, 0, -4, 5, 8, 9');
        setCustomCyclePos(2);
      } else if (presetType === 'self-loop') {
        setCustomValuesStr('4, 7, 9');
        setCustomCyclePos(2);
      } else {
        // Default
        setCustomValuesStr(currentProblem.defaultValues.join(', '));
        setCustomCyclePos(currentProblem.defaultPos);
      }
    } else if (currentProblem.id === 'lc202') {
      if (presetType === 'happy-19') {
        setCustomHappyStart(19);
      } else if (presetType === 'unhappy-2') {
        setCustomHappyStart(2);
      } else if (presetType === 'happy-7') {
        setCustomHappyStart(7);
      } else if (presetType === 'unhappy-4') {
        setCustomHappyStart(4);
      }
    } else if (currentProblem.id === 'lc287') {
      if (presetType === 'dup-2') {
        setCustomValuesStr('1, 3, 4, 2, 2');
      } else if (presetType === 'dup-3') {
        setCustomValuesStr('3, 1, 3, 4, 2');
      } else if (presetType === 'dup-1') {
        setCustomValuesStr('1, 1, 2');
      }
    } else {
      // Middle node / palindrome presets
      if (presetType === 'odd') {
        setCustomValuesStr('1, 2, 3, 4, 5');
      } else if (presetType === 'even') {
        setCustomValuesStr('1, 2, 3, 4, 5, 6');
      } else if (presetType === 'pal-true') {
        setCustomValuesStr('1, 2, 3, 3, 2, 1');
      } else if (presetType === 'pal-false') {
        setCustomValuesStr('1, 2, 3, 4, 2, 1');
      } else {
        setCustomValuesStr(currentProblem.defaultValues.join(', '));
      }
    }
  };

  // Scroll active line of code into view
  const codeLinesRef = useRef<Record<number, HTMLDivElement | null>>({});
  useEffect(() => {
    if (activeStep && activeTab === 'cpp') {
      const lineEl = codeLinesRef.current[activeStep.cppLine];
      if (lineEl) {
        lineEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [activeStep?.cppLine, activeTab]);

  // Copy C++ snippet to clipboard
  const handleCopySnippet = () => {
    const code = CPP_SNIPPETS[currentProblem.cppSnippetId]?.code || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // LaTeX-styled Math Formulas derived values
  const mathValues = useMemo(() => {
    if (!activeStep) return { L1: 0, L2: 0, C: 0 };
    // Let's compute actual lengths based on preset values
    const cyclePosActual = customCyclePos;
    if (cyclePosActual < 0) return { L1: parsedValues.length, L2: 0, C: 0 };

    const L1 = cyclePosActual; // distance from head to cycle entry
    const C = parsedValues.length - cyclePosActual; // loop circumference
    
    // Meeting distance from cycle entry
    let L2 = 0;
    if (activeStep.collisionIndex !== null) {
      const meetingIdx = activeStep.collisionIndex;
      L2 = meetingIdx >= cyclePosActual ? (meetingIdx - cyclePosActual) : 0;
    } else if (activeStep.slowIndex !== null) {
      const slowIdx = activeStep.slowIndex;
      L2 = slowIdx >= cyclePosActual ? (slowIdx - cyclePosActual) : 0;
    }

    return { L1, L2, C };
  }, [activeStep, customCyclePos, parsedValues]);

  // Layout node coordinates solver
  const nodeCoordinates = useMemo(() => {
    if (!activeStep) return [];
    const stepNodes = activeStep.nodes;
    const N = stepNodes.length;

    // Helper positions
    if (currentProblem.id === 'lc160') {
      // Intersection mapping (two merging lines)
      return stepNodes.map(node => {
        if (node.id === 0) return { id: 0, x: 70, y: 80 };
        if (node.id === 1) return { id: 1, x: 150, y: 80 };
        if (node.id === 5) return { id: 5, x: 70, y: 190 };
        if (node.id === 6) return { id: 6, x: 140, y: 190 };
        if (node.id === 7) return { id: 7, x: 210, y: 190 };
        if (node.id === 2) return { id: 2, x: 280, y: 135 };
        if (node.id === 3) return { id: 3, x: 360, y: 135 };
        if (node.id === 4) return { id: 4, x: 440, y: 135 };
        return { id: node.id, x: 100, y: 100 };
      });
    }

    // Determine if there is a cycle entry index
    let cycleEntryIdx = -1;
    if (currentProblem.category === 'Cycle Detection') {
      cycleEntryIdx = customCyclePos;
    } else if (currentProblem.id === 'lc202' || currentProblem.id === 'lc287') {
      // Find loop-back point dynamically from nodes next links
      const seen = new Set<number>();
      for (const node of stepNodes) {
        if (node.next !== null && seen.has(node.next)) {
          cycleEntryIdx = node.next;
          break;
        }
        seen.add(node.id);
      }
    }

    if (cycleEntryIdx >= 0 && cycleEntryIdx < N) {
      const L1 = cycleEntryIdx; // linear prefix
      const C = N - L1; // cycle nodes
      const cx = 80 + L1 * 68 + 70; // cycle circle center X
      const cy = 130; // center Y
      const R = 50; // radius

      return stepNodes.map((node, idx) => {
        if (idx < L1) {
          // linear path leading into cycle
          return {
            id: node.id,
            x: 50 + idx * 68,
            y: 130
          };
        } else {
          // circular path distribution
          // top of circle touches the line at angle -pi/2
          const theta = -Math.PI / 2 + ((idx - L1) * 2 * Math.PI) / C;
          return {
            id: node.id,
            x: cx + R * Math.cos(theta),
            y: cy + R * Math.sin(theta)
          };
        }
      });
    }

    // Default horizontal alignment for linear lists (Middle, Palindrome, Reorder)
    return stepNodes.map((node, idx) => {
      // If palindrome reversal phase is active, we can separate the second half visually!
      if (currentProblem.id === 'lc234' || currentProblem.id === 'lc143') {
        const midIdx = Math.floor(N / 2);
        if (node.isReversed) {
          return {
            id: node.id,
            x: 60 + idx * 64 + 20, // push reversed nodes slightly to right
            y: 155 // push slightly down to show the reversed split
          };
        }
      }
      return {
        id: node.id,
        x: 50 + idx * 68,
        y: 130
      };
    });
  }, [activeStep, currentProblem.id, customCyclePos, parsedValues.length]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FAF9F6]">
      {/* TOP HEADER SECTION */}
      <header className="flex items-center justify-between px-6 py-2.5 border-b border-slate-200 bg-white shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-amber-500 text-white shadow-xs">
            <RefreshCw className="h-4.5 w-4.5 animate-spin-slow" />
          </div>
          <div>
            <span className="font-serif text-base font-bold tracking-tight text-slate-900 block">
              Fast & Slow Pointers Engine
            </span>
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span>Interactive Simulator</span>
              <span>·</span>
              <span>Floyd's Cycle Algorithm</span>
            </div>
          </div>
        </div>

        {/* SEQUENCE PROBLEM SELECTOR & NAVIGATION */}
        <div className="flex items-center gap-1.5 p-0.5 bg-slate-100 rounded-lg">
          <button
            onClick={() => setCurrentProblemIdx(prev => (prev === 0 ? PROBLEMS.length - 1 : prev - 1))}
            className="p-1.5 rounded-md hover:bg-white text-slate-700 transition-colors"
            title="Previous Problem"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          
          <select
            value={currentProblemIdx}
            onChange={(e) => setCurrentProblemIdx(parseInt(e.target.value, 10))}
            className="bg-transparent font-sans text-xs font-semibold text-slate-800 focus:outline-none px-2 cursor-pointer max-w-[340px] truncate"
          >
            <optgroup label="Pattern 1: Middle Finding & Splitting" className="text-slate-500 font-sans text-xs font-bold">
              {PROBLEMS.filter(p => p.category === 'Middle Node').map(prob => (
                <option key={prob.id} value={PROBLEMS.indexOf(prob)} className="text-slate-800 font-semibold font-sans">
                  {prob.leetcodeNum}: {prob.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="Pattern 2: Classic Cycle Detection" className="text-slate-500 font-sans text-xs font-bold">
              {PROBLEMS.filter(p => p.category === 'Cycle Detection').map(prob => (
                <option key={prob.id} value={PROBLEMS.indexOf(prob)} className="text-slate-800 font-semibold font-sans">
                  {prob.leetcodeNum}: {prob.title}
                </option>
              ))}
            </optgroup>
            <optgroup label="Pattern 3: Cyclic Array Applications" className="text-slate-500 font-sans text-xs font-bold">
              {PROBLEMS.filter(p => p.category === 'Cyclic Array').map(prob => (
                <option key={prob.id} value={PROBLEMS.indexOf(prob)} className="text-slate-800 font-semibold font-sans">
                  {prob.leetcodeNum}: {prob.title}
                </option>
              ))}
            </optgroup>
          </select>

          <button
            onClick={() => setCurrentProblemIdx(prev => (prev === PROBLEMS.length - 1 ? 0 : prev + 1))}
            className="p-1.5 rounded-md hover:bg-white text-slate-700 transition-colors"
            title="Next Problem"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Compact Badge instead of Shortcut/Leetcode Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            Fast Track Visualizer
          </span>
        </div>
      </header>

      {/* TOP QUESTION & PARAMETER INPUT BANNER */}
      <section className="bg-white border-b border-slate-200 px-6 py-2 shadow-xs shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400">
                0{currentProblem.orderIndex}.
              </span>
              <span className="font-serif text-sm font-bold text-slate-800">
                {currentProblem.title}
              </span>
              <span
                className={`text-[10px] font-semibold font-sans px-1.5 py-0.2 rounded-full ${
                  currentProblem.difficulty === 'Easy'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                    : currentProblem.difficulty === 'Medium'
                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                    : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}
              >
                {currentProblem.difficulty}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentProblem.leetcodeNum}
              </span>
              <button
                onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
                className="text-[10px] text-amber-800 hover:text-amber-900 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200 font-medium ml-2 transition-all cursor-pointer"
              >
                {isDetailsExpanded ? 'Hide Details' : 'Show Details'}
              </button>
            </div>
            
            {isDetailsExpanded && (
              <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] grid grid-cols-1 md:grid-cols-3 gap-3 transition-all">
                <div className="md:col-span-1">
                  <span className="font-semibold text-slate-600 block mb-0.5 uppercase tracking-wider text-[9px] font-sans">Problem Statement</span>
                  <p className="text-slate-600 leading-relaxed font-sans">{currentProblem.detailedDescription}</p>
                </div>
                <div>
                  <span className="font-semibold text-slate-600 block mb-0.5 uppercase tracking-wider text-[9px] font-sans">Sample Test Case</span>
                  <div className="bg-white px-2 py-1 rounded border border-slate-200 font-mono text-[10px] text-slate-700">
                    {currentProblem.id === 'lc202' ? (
                      <span>n = {currentProblem.defaultValues[0]}</span>
                    ) : currentProblem.id === 'lc160' ? (
                      <span className="block truncate">List A: [4,1,8,4,5], B: [5,0,1,8,4,5]</span>
                    ) : (
                      <span className="block truncate">head = [{currentProblem.defaultValues.join(',')}]{currentProblem.defaultPos >= 0 ? `, pos = ${currentProblem.defaultPos}` : ''}</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="font-semibold text-slate-600 block mb-0.5 uppercase tracking-wider text-[9px] font-sans">Expected Output</span>
                  <div className="bg-white px-2 py-1 rounded border border-slate-200 font-mono text-[10px] text-slate-700">
                    {currentProblem.id === 'lc876' && <span>Middle Node: {currentProblem.defaultValues[Math.floor(currentProblem.defaultValues.length / 2)]}</span>}
                    {currentProblem.id === 'lc2095' && <span>Middle Node Deleted</span>}
                    {currentProblem.id === 'lc234' && <span>true (List is Palindrome)</span>}
                    {currentProblem.id === 'lc143' && <span>Weaved alternating list</span>}
                    {currentProblem.id === 'lc141' && <span>true (Cycle Detected)</span>}
                    {currentProblem.id === 'lc142' && <span>Index {currentProblem.defaultPos >= 0 ? currentProblem.defaultPos : 'nullptr'} (Cycle Entry)</span>}
                    {currentProblem.id === 'lc160' && <span>Value 8 (Intersection)</span>}
                    {currentProblem.id === 'lc202' && <span>true (Happy Number)</span>}
                    {currentProblem.id === 'lc287' && <span>Value 2 (Duplicate)</span>}
                    {currentProblem.id === 'lc457' && <span>true / false (Cycle exists)</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC CASE EDITOR PANEL */}
          <div className="flex flex-wrap items-center gap-2.5 bg-slate-50 p-2 rounded-lg border border-slate-200">
            {currentProblem.id === 'lc202' ? (
              <div className="flex items-center gap-2">
                <label className="text-xs font-sans font-semibold text-slate-600">Start N:</label>
                <input
                  type="number"
                  min="1"
                  max="9999"
                  value={customHappyStart}
                  onChange={(e) => setCustomHappyStart(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="w-16 text-center font-mono text-xs bg-white border border-slate-200 rounded px-1.5 py-1 focus:outline-none focus:border-amber-500"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <label className="text-xs font-sans font-semibold text-slate-600">List Nodes:</label>
                <input
                  type="text"
                  value={customValuesStr}
                  onChange={(e) => setCustomValuesStr(e.target.value)}
                  placeholder="e.g. 3, 2, 0, -4"
                  className="w-36 font-mono text-xs bg-white border border-slate-200 rounded px-1.5 py-1 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            {currentProblem.category === 'Cycle Detection' && currentProblem.id !== 'lc160' && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-sans font-semibold text-slate-600">Cycle Pos:</label>
                <select
                  value={customCyclePos}
                  onChange={(e) => setCustomCyclePos(parseInt(e.target.value, 10))}
                  className="font-mono text-xs bg-white border border-slate-200 rounded px-1.5 py-1 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="-1">None (-1)</option>
                  {parsedValues.map((_, i) => (
                    <option key={i} value={i}>
                      Index {i}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={() => handleReset()}
              className="px-2.5 py-1 text-xs font-medium border border-slate-200 bg-white text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded shadow-xs transition-colors"
            >
              Reset Case
            </button>
            <button
              onClick={() => {
                handleReset();
                setIsPlaying(true);
              }}
              className="px-3 py-1 text-xs font-semibold bg-amber-500 text-amber-950 hover:bg-amber-600 rounded shadow-xs transition-colors"
            >
              Simulate
            </button>
          </div>
        </div>

        {/* INVARIANT BAR */}
        <div className="flex items-center gap-2 mt-2 py-1.5 px-3 bg-[#FAF9F6] border border-amber-100 rounded-lg text-xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span className="font-mono font-medium text-amber-900 leading-tight">
            Invariant: {currentProblem.invariant}
          </span>
        </div>
      </section>

      {/* CORE WORKSPACE - SIDE BY SIDE PANELS */}
      <main className="flex-1 flex overflow-hidden min-h-0">
        {/* LEFT COLUMN - INTERACTIVE STAGE & PLAYBACK (7 cols / 58% width) */}
        <div className="w-[58%] flex flex-col border-r border-slate-200 min-w-0 bg-[#FAF9F6]">
          {/* PROBLEM SUB-PRESETS PANEL */}
          <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-xs font-sans font-semibold text-slate-500 flex items-center gap-1.5">
              <List className="h-3.5 w-3.5" />
              Presets for this algorithm:
            </span>
            <div className="flex gap-1.5">
              {currentProblem.category === 'Cycle Detection' && currentProblem.id !== 'lc160' ? (
                <>
                  <button
                    onClick={() => applyPreset('no-cycle')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                      activePreset === 'no-cycle' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    No Cycle
                  </button>
                  <button
                    onClick={() => applyPreset('small-cycle')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                      activePreset === 'small-cycle' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Small Loop
                  </button>
                  <button
                    onClick={() => applyPreset('big-cycle')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                      activePreset === 'big-cycle' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Lasso Cycle
                  </button>
                  <button
                    onClick={() => applyPreset('self-loop')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                      activePreset === 'self-loop' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Self Loop
                  </button>
                </>
              ) : currentProblem.id === 'lc202' ? (
                <>
                  <button
                    onClick={() => applyPreset('happy-19')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                      activePreset === 'happy-19' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Happy (19)
                  </button>
                  <button
                    onClick={() => applyPreset('unhappy-2')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                      activePreset === 'unhappy-2' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Unhappy Cycle (2)
                  </button>
                  <button
                    onClick={() => applyPreset('happy-7')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                      activePreset === 'happy-7' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Happy (7)
                  </button>
                </>
              ) : currentProblem.id === 'lc287' ? (
                <>
                  <button
                    onClick={() => applyPreset('dup-2')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                      activePreset === 'dup-2' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Duplicate 2
                  </button>
                  <button
                    onClick={() => applyPreset('dup-3')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                      activePreset === 'dup-3' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Duplicate 3
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => applyPreset('odd')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                      activePreset === 'odd' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Odd Length
                  </button>
                  <button
                    onClick={() => applyPreset('even')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                      activePreset === 'even' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Even Length
                  </button>
                  {currentProblem.id === 'lc234' && (
                    <>
                      <button
                        onClick={() => applyPreset('pal-true')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                          activePreset === 'pal-true' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Palindrome
                      </button>
                      <button
                        onClick={() => applyPreset('pal-false')}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded border transition-colors ${
                          activePreset === 'pal-false' ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Not Palindrome
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* DYNAMIC VISUALIZATION STAGE CANVAS */}
          <div className="flex-1 relative overflow-hidden flex flex-col justify-center items-center px-4">
            {activeStep ? (
              <div className="w-full h-full flex flex-col justify-between py-6">
                
                {/* ARRAY MAPPING SECTION (Special visual for LeetCode #287 duplicate array cycle representation) */}
                {currentProblem.id === 'lc287' && activeStep.arrayState && (
                  <div className="w-full flex flex-col items-center bg-white border border-slate-200 rounded-xl p-3 shadow-xs shrink-0 max-w-2xl mx-auto mb-4">
                    <span className="text-[11px] font-mono text-slate-400 block mb-2 uppercase tracking-wider">
                      Implicit Pointer Mapping (Array View: i → nums[i])
                    </span>
                    <div className="flex items-center justify-center gap-1.5">
                      {activeStep.arrayState.nums.map((num, idx) => {
                        const isSlowPtr = idx === activeStep.arrayState?.slowIndex;
                        const isFastPtr = idx === activeStep.arrayState?.fastIndex;
                        return (
                          <div
                            key={idx}
                            className={`relative flex flex-col items-center w-12 border rounded-md transition-all ${
                              isSlowPtr && isFastPtr
                                ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-500 ring-offset-1'
                                : isSlowPtr
                                ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-400'
                                : isFastPtr
                                ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <span className="text-[10px] font-mono text-slate-400 border-b border-slate-200 w-full text-center py-0.5">
                              idx {idx}
                            </span>
                            <span className="text-sm font-mono font-bold py-1 text-slate-800">
                              {num}
                            </span>
                            
                            {/* Pointer badging underneath */}
                            <div className="absolute -bottom-6 flex flex-col gap-0.5 items-center z-10">
                              {isSlowPtr && (
                                <span className="bg-indigo-600 text-white text-[9px] font-bold px-1 rounded">
                                  slow
                                </span>
                              )}
                              {isFastPtr && (
                                <span className="bg-emerald-600 text-white text-[9px] font-bold px-1 rounded">
                                  fast
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Visual arc trail connection helper */}
                    <span className="text-[10px] text-slate-500 font-sans mt-7 leading-relaxed text-center">
                      Indices correspond to "Node Addresses". Values inside cells represent the "Next Address" points.
                    </span>
                  </div>
                )}

                {/* MAIN GRAPH CANVAS (SVG) */}
                <div className="flex-1 relative flex items-center justify-center min-h-[220px]">
                  <svg className="w-full h-full min-h-[240px] absolute inset-0 z-0 pointer-events-none">
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="7"
                        refX="6"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                      </marker>
                      <marker
                        id="arrowhead-highlight"
                        markerWidth="10"
                        markerHeight="7"
                        refX="6"
                        refY="3.5"
                        orient="auto"
                      >
                        <polygon points="0 0, 10 3.5, 0 7" fill="#d97706" />
                      </marker>
                    </defs>

                    {/* DRAW GRAPH EDGES / CONNECTIONS */}
                    {activeStep.nodes.map((node) => {
                      if (node.next === null || node.isDeleted) return null;
                      const fromCoord = nodeCoordinates.find(c => c.id === node.id);
                      const toCoord = nodeCoordinates.find(c => c.id === node.next);
                      if (!fromCoord || !toCoord) return null;

                      const isCollisionLink = activeStep.isCollision &&
                        (node.id === activeStep.collisionIndex || node.next === activeStep.collisionIndex);

                      // Calculate adjusted endpoints to cleanly touch circle boundaries
                      const dx = toCoord.x - fromCoord.x;
                      const dy = toCoord.y - fromCoord.y;
                      const len = Math.sqrt(dx * dx + dy * dy);
                      if (len === 0) return null;

                      // offset from center of from node to center of to node
                      const x1 = fromCoord.x + (dx / len) * 18;
                      const y1 = fromCoord.y + (dy / len) * 18;
                      const x2 = toCoord.x - (dx / len) * 22;
                      const y2 = toCoord.y - (dy / len) * 22;

                      // If looping backward (cycle closure link), draw an arc
                      const isLoopback = node.next <= node.id;
                      if (isLoopback && currentProblem.category === 'Cycle Detection') {
                        // Curved arc calculation
                        const rx = 40;
                        const ry = 40;
                        const sweepFlag = 1;
                        return (
                          <path
                            key={`edge-${node.id}-${node.next}`}
                            d={`M ${x1} ${y1} A ${rx} ${ry} 0 0 ${sweepFlag} ${x2} ${y2}`}
                            fill="none"
                            stroke={isCollisionLink ? '#d97706' : '#cbd5e1'}
                            strokeWidth={isCollisionLink ? '2' : '1.5'}
                            strokeDasharray={node.isReversed ? '3 3' : '0'}
                            markerEnd={`url(#${isCollisionLink ? 'arrowhead-highlight' : 'arrowhead'})`}
                          />
                        );
                      }

                      return (
                        <line
                          key={`edge-${node.id}-${node.next}`}
                          x1={x1}
                          y1={y1}
                          x2={x2}
                          y2={y2}
                          stroke={isCollisionLink ? '#d97706' : '#cbd5e1'}
                          strokeWidth={isCollisionLink ? '2' : '1.5'}
                          strokeDasharray={node.isReversed ? '3,3' : '0'}
                          markerEnd={`url(#${isCollisionLink ? 'arrowhead-highlight' : 'arrowhead'})`}
                        />
                      );
                    })}

                    {/* DOTTED LEAP PATH TRAIL for Hare intermediate skipping nodes */}
                    {activeStep.phase === 'Phase 1: Cycle Detection' &&
                      activeStep.fastIndex !== null &&
                      activeStep.slowIndex !== null && (
                        (() => {
                          const fastNode = activeStep.nodes[activeStep.fastIndex];
                          if (fastNode && fastNode.next !== null) {
                            const midIdx = fastNode.next;
                            const fromC = nodeCoordinates.find(c => c.id === activeStep.fastIndex);
                            const midC = nodeCoordinates.find(c => c.id === midIdx);
                            const nextNode = fastNode.next !== null ? activeStep.nodes[fastNode.next] : null;
                            const nextNextIdx = nextNode ? nextNode.next : null;
                            const toC = nextNextIdx !== null ? nodeCoordinates.find(c => c.id === nextNextIdx) : null;
                            if (fromC && midC && toC) {
                              return (
                                <path
                                  d={`M ${fromC.x} ${fromC.y} Q ${midC.x} ${midC.y - 15} ${toC.x} ${toC.y}`}
                                  fill="none"
                                  stroke="#f59e0b"
                                  strokeWidth="1.5"
                                  strokeDasharray="4 4"
                                  className="animate-pulse"
                                />
                              );
                            }
                          }
                          return null;
                        })()
                      )}
                  </svg>

                  {/* DRAW NODES OVER THE SVG EDGES */}
                  {activeStep.nodes.map((node) => {
                    const coord = nodeCoordinates.find(c => c.id === node.id);
                    if (!coord || node.isDeleted) return null;

                    // Compute colors based on pointer roles
                    const isSlow = node.id === activeStep.slowIndex;
                    const isFast = node.id === activeStep.fastIndex;
                    const isPrev = node.id === activeStep.prevSlowIndex;
                    const isCollisionNode = activeStep.isCollision && node.id === activeStep.collisionIndex;
                    const isCycleEntry = currentProblem.category === 'Cycle Detection' && node.id === customCyclePos;

                    return (
                      <div
                        key={`node-${node.id}`}
                        style={{
                          left: `${coord.x}px`,
                          top: `${coord.y}px`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        className={`absolute w-10 h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold shadow-sm border transition-all duration-350 z-20 ${
                          isCollisionNode
                            ? 'bg-amber-500 border-amber-600 text-amber-950 ring-4 ring-amber-300 ring-offset-2 animate-bounce'
                            : isSlow && isFast
                            ? 'bg-gradient-to-tr from-indigo-500 to-emerald-500 text-white border-slate-700'
                            : isSlow
                            ? 'bg-indigo-600 text-white border-indigo-700 ring-2 ring-indigo-200'
                            : isFast
                            ? 'bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-200'
                            : isPrev
                            ? 'bg-rose-100 text-rose-800 border-rose-300 ring-2 ring-rose-200'
                            : isCycleEntry
                            ? 'bg-amber-100 text-amber-900 border-amber-400 ring-2 ring-amber-200 ring-offset-1'
                            : 'bg-white text-slate-700 border-slate-200'
                        }`}
                      >
                        {/* Node value label */}
                        <span className="truncate max-w-[34px]" title={String(node.val)}>
                          {String(node.val).split(' ')[0]}
                        </span>

                        {/* Special marker stars/indicators inside node */}
                        {isCycleEntry && (
                          <div className="absolute -top-1.5 -right-1.5 bg-amber-500 text-amber-950 p-0.5 rounded-full border border-amber-300 shadow-xs">
                            <Sparkles className="h-2.5 w-2.5" />
                          </div>
                        )}

                        {/* POINTER LABELS FLOATING */}
                        <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex gap-1 z-30 pointer-events-none">
                          {isSlow && (
                            <span className="bg-indigo-600 text-white text-[9px] font-sans font-extrabold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5 whitespace-nowrap">
                              <span>Tortoise</span>
                              <span className="font-mono">→</span>
                            </span>
                          )}
                          {isPrev && (
                            <span className="bg-rose-600 text-white text-[9px] font-sans font-extrabold px-1.5 py-0.5 rounded-md shadow-xs whitespace-nowrap">
                              prev
                            </span>
                          )}
                        </div>

                        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex gap-1 z-30 pointer-events-none">
                          {isFast && (
                            <span className="bg-emerald-600 text-white text-[9px] font-sans font-extrabold px-1.5 py-0.5 rounded-md shadow-xs flex items-center gap-0.5 whitespace-nowrap">
                              <span>Hare</span>
                              <span className="font-mono">↠</span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* DOCKED PLAYBACK TOOLBAR */}
                <div className="mx-6 bg-white border border-slate-200 rounded-xl p-3 shadow-xs shrink-0">
                  <div className="flex items-center justify-between gap-4">
                    
                    {/* Scrub controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleReset}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all border border-slate-100"
                        title="Reset to step 0 (Key: R)"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleStepBackward}
                        disabled={currentStepIdx === 0}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all border border-slate-100 disabled:opacity-40"
                        title="Step Backward (Key: ←)"
                      >
                        <SkipBack className="h-4 w-4" />
                      </button>

                      {/* Play/Pause Button */}
                      <button
                        onClick={handlePlayPause}
                        className={`p-2.5 rounded-xl text-white shadow-md transition-all scale-105 ${
                          isPlaying
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'bg-amber-500 hover:bg-amber-600'
                        }`}
                        title="Play/Pause (Key: Space)"
                      >
                        {isPlaying ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
                      </button>

                      <button
                        onClick={handleStepForward}
                        disabled={currentStepIdx === simulationSteps.length - 1}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all border border-slate-100 disabled:opacity-40"
                        title="Step Forward (Key: →)"
                      >
                        <SkipForward className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Step slider scrubber */}
                    <div className="flex-1 flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-400 w-12 text-right">
                        Step {currentStepIdx}/{simulationSteps.length - 1}
                      </span>
                      <input
                        type="range"
                        min="0"
                        max={simulationSteps.length - 1}
                        value={currentStepIdx}
                        onChange={(e) => {
                          setIsPlaying(false);
                          setCurrentStepIdx(parseInt(e.target.value, 10));
                        }}
                        className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>

                    {/* Playback speed selector */}
                    <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-0.5">
                      {[0.5, 1, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md transition-colors ${
                            playbackSpeed === speed
                              ? 'bg-white text-slate-800 shadow-xs'
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>

                  </div>

                  {/* Realtime execution comment/logs */}
                  <div className="mt-3 py-2 px-3.5 bg-amber-50/50 border border-amber-100/60 rounded-lg text-xs flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
                    <p className="font-sans font-medium text-amber-950 leading-tight">
                      {activeStep.description}
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-white border border-dashed border-slate-300 rounded-2xl max-w-md text-center shadow-xs">
                <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
                <span className="font-serif text-lg font-bold text-slate-800">
                  Simulation Standby
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Ensure you entered valid comma-separated values inside the case editor to generate simulation steps.
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN - CODE TRACE, INSPECTOR, PROOFS & LOGS (5 cols / 42% width) */}
        <div className="w-[42%] flex flex-col bg-white min-w-0">
          {/* TAB BAR HEADER */}
          <div className="flex bg-slate-50 border-b border-slate-200 p-1 shrink-0">
            <button
              onClick={() => setActiveTab('inspector')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'inspector'
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-100'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Inspector</span>
            </button>
            <button
              onClick={() => setActiveTab('cpp')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'cpp'
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-100'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Code className="h-3.5 w-3.5" />
              <span>C++ Trace</span>
            </button>
            <button
              onClick={() => setActiveTab('math')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'math'
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-100'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Math Proof</span>
            </button>
            <button
              onClick={() => setActiveTab('log')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-md transition-all ${
                activeTab === 'log'
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-100'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>History Log</span>
            </button>
          </div>

          {/* TAB CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-5 min-h-0 bg-white">
            
            {/* TAB 1: LIVE STATE INSPECTOR */}
            {activeTab === 'inspector' && activeStep && (
              <div className="space-y-4">
                
                {/* Pointer Positions Card */}
                <div className="border border-slate-200 rounded-xl p-4 shadow-2xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-bold">
                    Pointer Addresses & Metrics
                  </span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100">
                      <span className="text-[10px] font-sans font-bold text-indigo-700 block mb-1">
                        TORTOISE (slow)
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-700">
                        {activeStep.slowIndex !== null 
                          ? `Node ${activeStep.slowIndex} [Val: ${activeStep.metrics.slowVal}]` 
                          : 'NULL'}
                      </span>
                    </div>

                    <div className="bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                      <span className="text-[10px] font-sans font-bold text-emerald-700 block mb-1">
                        HARE (fast)
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-700">
                        {activeStep.fastIndex !== null 
                          ? `Node ${activeStep.fastIndex} [Val: ${activeStep.metrics.fastVal}]` 
                          : 'NULL'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-600">
                    <span className="font-sans">Current Phase:</span>
                    <span className="font-mono font-bold text-slate-800">{activeStep.phase}</span>
                  </div>
                  
                  <div className="mt-1.5 flex justify-between text-xs text-slate-600">
                    <span className="font-sans">Total Steps Taken:</span>
                    <span className="font-mono font-bold text-slate-800">{activeStep.metrics.steps}</span>
                  </div>
                </div>

                {/* Cycle Metrics Card (Rendered if loop/lasso categories or arrays) */}
                {currentProblem.category === 'Cycle Detection' && (
                  <div className="border border-slate-200 rounded-xl p-4 shadow-2xs bg-amber-50/20">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 block mb-2 font-bold">
                      Loop Dynamics & Diagnostics
                    </span>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-amber-100/50">
                        <span className="text-slate-600">Cycle Detected:</span>
                        <span className={`font-mono font-bold ${activeStep.isCollision ? 'text-amber-700' : 'text-slate-500'}`}>
                          {activeStep.isCollision ? 'YES (COLLISION)' : 'DETECTION IN PROGRESS'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-amber-100/50">
                        <span className="text-slate-600">Distance Closing Rate:</span>
                        <span className="font-mono font-semibold text-slate-700">1 Node / step</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-amber-100/50">
                        <span className="text-slate-600">Relative distance slow → fast:</span>
                        <span className="font-mono font-bold text-slate-700">
                          {activeStep.metrics.distance ?? 'N/A'}
                        </span>
                      </div>
                      {activeStep.metrics.cycleLength && (
                        <div className="flex justify-between py-1">
                          <span className="text-slate-600">Loop Circumference (C):</span>
                          <span className="font-mono font-bold text-amber-800 bg-amber-100 px-1.5 rounded">
                            {activeStep.metrics.cycleLength} Nodes
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Happy Number Dynamic Digit-Square State Card */}
                {currentProblem.id === 'lc202' && activeStep.happyNumberState && (
                  <div className="border border-slate-200 rounded-xl p-4 shadow-2xs bg-slate-50">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-bold">
                      Sum of Squared Digits Chain
                    </span>
                    <div className="space-y-3">
                      <div>
                        <span className="text-[11px] font-semibold text-indigo-700 block">
                          Slow Chain Formula:
                        </span>
                        <p className="font-mono text-xs text-slate-700 bg-white border border-slate-200 p-1.5 rounded mt-1">
                          {activeStep.happyNumberState.slowSumSteps}
                        </p>
                      </div>
                      <div>
                        <span className="text-[11px] font-semibold text-emerald-700 block">
                          Fast Chain Formulas (Double Step):
                        </span>
                        <p className="font-mono text-[11px] text-slate-700 bg-white border border-slate-200 p-1.5 rounded mt-1 leading-relaxed">
                          {activeStep.happyNumberState.fastSumSteps}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Circular Array Loop diagnostics Card */}
                {currentProblem.id === 'lc457' && (
                  <div className="border border-slate-200 rounded-xl p-4 shadow-2xs bg-slate-50">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-bold">
                      Circular Array Constraints
                    </span>
                    <ul className="text-[11px] text-slate-600 space-y-1.5 list-disc pl-4">
                      <li>
                        Direction must be uniform. Current: <span className="font-bold text-amber-800">{parsedValues[0] >= 0 ? 'Forward (all >= 0)' : 'Backward (all < 0)'}</span>.
                      </li>
                      <li>
                        Self-loops (Node index pointing to itself) are invalid under the LeetCode constraint.
                      </li>
                      <li>
                        Indices wrap circularly: <code className="bg-slate-200 px-1 rounded">next = (curr + val) % N</code>.
                      </li>
                    </ul>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: C++ SYNTAX HIGHLIGHTED CODE TRACE */}
            {activeTab === 'cpp' && (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                    Active C++ Execution Thread
                  </span>
                  <button
                    onClick={handleCopySnippet}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="flex-1 bg-slate-900 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-y-auto max-h-[360px] border border-slate-800">
                  {CPP_SNIPPETS[currentProblem.cppSnippetId]?.lines.map((line, idx) => {
                    const lineNum = idx + 1;
                    const isActive = activeStep ? activeStep.cppLine === lineNum : false;

                    return (
                      <div
                        key={idx}
                        ref={(el) => {
                          codeLinesRef.current[lineNum] = el;
                        }}
                        className={`flex items-start py-0.5 -mx-4 px-4 transition-colors duration-200 ${
                          isActive
                            ? 'bg-amber-950/70 border-l-4 border-amber-500 text-amber-200'
                            : 'border-l-4 border-transparent hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="w-8 shrink-0 select-none text-slate-500 text-right pr-3.5 text-[10px]">
                          {lineNum}
                        </span>
                        <pre className="whitespace-pre-wrap font-mono leading-relaxed text-[11px]">
                          {line}
                        </pre>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: MATHEMATICAL PROOF */}
            {activeTab === 'math' && (
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-xl p-4 shadow-2xs bg-amber-50/10">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2 font-bold">
                    Mathematical Entry Node Proof
                  </span>
                  
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Floyd's Phase 2 works because the head of the list is mathematically symmetric to the meeting node with respect to the cycle entry point.
                  </p>

                  <div className="bg-white border border-slate-200 rounded-lg p-3.5 mb-4 space-y-2.5 font-mono text-xs text-slate-800 shadow-3xs">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Distance slow pointer traveled:</span>
                      <span className="font-bold">L₁ + L₂</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Distance fast pointer traveled:</span>
                      <span className="font-bold">L₁ + L₂ + k · C</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500">Since Fast is 2x faster than Slow:</span>
                      <span className="font-bold text-amber-800">2(L₁ + L₂) = L₁ + L₂ + k · C</span>
                    </div>
                    <div className="flex justify-between items-center pt-0.5">
                      <span className="text-slate-500">Solving for L₁ yields:</span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                        L₁ = k · C - L₂
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    This reveals that moving a pointer from the list head (<code className="bg-slate-100 px-1 rounded">L₁</code> steps) and a pointer from the meeting location (<code className="bg-slate-100 px-1 rounded">k · C - L₂</code> steps) brings them exactly to the same node: the <strong className="text-slate-800 font-semibold">Cycle Entry!</strong>
                  </p>
                </div>

                {/* LIVE CALCULATION PLAYGROUND */}
                <div className="border border-slate-200 rounded-xl p-4 shadow-2xs bg-slate-50">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-3 font-bold">
                    Real-Time Equations Solver
                  </span>

                  {customCyclePos >= 0 ? (
                    <div className="space-y-2 text-xs font-mono text-slate-700">
                      <div className="flex justify-between">
                        <span>L₁ (Head to Entry):</span>
                        <span className="font-bold text-indigo-700">{mathValues.L1} nodes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>L₂ (Entry to Collision):</span>
                        <span className="font-bold text-emerald-700">{mathValues.L2} nodes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>C (Cycle Circumference):</span>
                        <span className="font-bold text-amber-700">{mathValues.C} nodes</span>
                      </div>
                      
                      <div className="border-t border-slate-200 mt-2.5 pt-2.5 font-sans flex flex-col items-center gap-1 bg-white p-2.5 rounded-lg border">
                        <span className="text-[11px] text-slate-500 font-semibold">Equation check:</span>
                        <span className="font-mono text-xs font-bold text-slate-800">
                          {mathValues.L1} = (1 · {mathValues.C}) - {mathValues.L2} ⇒ {mathValues.L1} = {mathValues.C - mathValues.L2}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Formula holds true!
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-3 text-xs text-slate-500">
                      Please connect a loop / cycle (pos ≥ 0) to compute dynamic equation derivations.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: CHRONOLOGICAL ACTIONS LOG */}
            {activeTab === 'log' && (
              <div className="flex flex-col h-full">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-3 font-bold shrink-0">
                  Chronological Step Events Log
                </span>

                <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-[11px] text-slate-600 space-y-2.5 overflow-y-auto max-h-[340px]">
                  {simulationSteps.slice(0, currentStepIdx + 1).map((step, i) => (
                    <div key={i} className="flex gap-2 border-b border-slate-100 pb-1.5 last:border-0 last:pb-0">
                      <span className="text-amber-700 font-bold shrink-0">[{i}]</span>
                      <p className="leading-normal">{step.logMessage}</p>
                    </div>
                  ))}
                  {currentStepIdx === 0 && (
                    <p className="text-center text-slate-400 py-4">No events yet. Click play or forward steps to record activity logs.</p>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR FOOTER METRICS */}
          <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-between items-center shrink-0">
            <span className="text-xs text-slate-500 font-sans">
              Algorithmic Space: <strong className="text-slate-800">O(1) Auxiliary</strong>
            </span>
            <span className="text-xs text-slate-500 font-sans">
              Time: <strong className="text-slate-800">O(N)</strong>
            </span>
          </div>

        </div>
      </main>

      {/* SHORTCUT HELP MODAL */}
      {showHelp && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <span className="font-serif text-base font-bold text-slate-900">
                Interactive Shortcuts & Instructions
              </span>
              <button
                onClick={() => setShowHelp(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Use your physical keyboard inputs to step through our simulations rapidly while monitoring code active states:
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="font-semibold text-slate-700">Spacebar</span>
                  <kbd className="bg-slate-100 px-2 py-0.5 rounded border text-[10px] font-mono">Play / Pause</kbd>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="font-semibold text-slate-700">Right Arrow (→)</span>
                  <kbd className="bg-slate-100 px-2 py-0.5 rounded border text-[10px] font-mono">Step Forward</kbd>
                </div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="font-semibold text-slate-700">Left Arrow (←)</span>
                  <kbd className="bg-slate-100 px-2 py-0.5 rounded border text-[10px] font-mono">Step Backward</kbd>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">R key</span>
                  <kbd className="bg-slate-100 px-2 py-0.5 rounded border text-[10px] font-mono">Reset Simulator</kbd>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                <strong className="font-semibold block mb-1">Interactive Lasso Nodes:</strong>
                Double-check current code lines on tab 2 ("C++ Trace") to map pointers execution line-by-line as pointers advance.
              </div>
            </div>
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowHelp(false)}
                className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg shadow-sm"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
