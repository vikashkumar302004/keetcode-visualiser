/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Link2,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Terminal,
  Activity,
  Cpu,
  Copy,
  Check,
  ChevronDown,
  Info,
  Undo2,
  Eye,
  EyeOff,
  SlidersHorizontal,
} from 'lucide-react';
import { PROBLEMS, PROBLEM_SECTIONS } from './data/linkedListProblems';
import { CPP_SNIPPETS } from './algorithms/cppSnippets';
import { generateSimulationSteps } from './algorithms/linkedListAlgorithms';
import { AlgorithmId, SimulationStep, ListNodeState, PointerState } from './types';

export default function App() {
  // Navigation & Problem Select
  const [activeProblemId, setActiveProblemId] = useState<AlgorithmId>('reverse-list');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(true);

  // Problem Metadata
  const currentProblem = PROBLEMS.find(p => p.id === activeProblemId)!;

  // Custom List Inputs & Parameters
  const [list1Value, setList1Value] = useState(currentProblem.defaultValues);
  const [list2Value, setList2Value] = useState('2 -> 4 -> 6');
  const [list3Value, setList3Value] = useState('7 -> 8 -> 9');
  const [params, setParams] = useState<Record<string, number>>(currentProblem.defaultParams);

  // Sync state if active problem changes
  useEffect(() => {
    setList1Value(currentProblem.defaultValues);
    setParams(currentProblem.defaultParams);
    
    // Set specialized defaults for multi-list problems
    if (activeProblemId === 'add-two') {
      setList1Value('2 -> 4 -> 3');
      setList2Value('5 -> 6 -> 4');
    } else if (activeProblemId === 'merge-two') {
      setList1Value('1 -> 3 -> 5');
      setList2Value('2 -> 4 -> 6');
    } else if (activeProblemId === 'merge-k') {
      setList1Value('1 -> 4 -> 5');
      setList2Value('1 -> 3 -> 4');
      setList3Value('2 -> 6');
    } else if (activeProblemId === 'partition-list') {
      setList1Value('1 -> 4 -> 3 -> 2 -> 5 -> 2');
    } else if (activeProblemId === 'remove-duplicates') {
      setList1Value('1 -> 1 -> 2 -> 3 -> 3 -> 4');
    } else if (activeProblemId === 'remove-duplicates-ii') {
      setList1Value('1 -> 2 -> 3 -> 3 -> 4 -> 4 -> 5');
    } else if (activeProblemId === 'odd-even') {
      setList1Value('1 -> 2 -> 3 -> 4 -> 5 -> 6');
    } else if (activeProblemId === 'rotate-list') {
      setList1Value('1 -> 2 -> 3 -> 4 -> 5');
    } else if (activeProblemId === 'delete-node') {
      setList1Value('4 -> 5 -> 1 -> 9');
    } else if (activeProblemId === 'remove-nth') {
      setList1Value('1 -> 2 -> 3 -> 4 -> 5');
    }
  }, [activeProblemId, currentProblem]);

  // Simulation Steps State
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 0.5x, 1x, 2x

  // Active Tab: right workspace column
  const [activeTab, setActiveTab] = useState<'trace' | 'state' | 'memory' | 'logs'>('trace');
  const [copied, setCopied] = useState(false);

  // Re-run simulator whenever presets or custom setups are modified
  const runSimulation = () => {
    const generated = generateSimulationSteps(activeProblemId, list1Value, list2Value, list3Value, params);
    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Run on initial mount & problem switch
  useEffect(() => {
    runSimulation();
  }, [activeProblemId, list1Value, list2Value, list3Value, params]);

  // Handle auto-playback
  useEffect(() => {
    if (!isPlaying) return;
    if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const intervalTime = (1000 / playbackSpeed);
    const timer = setTimeout(() => {
      setCurrentStepIndex(prev => prev + 1);
    }, intervalTime);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, playbackSpeed]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid triggering when user is typing inside text fields
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
        stepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepBackward();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        resetSimulation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [steps.length]);

  // Playback Control Handlers
  const stepForward = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const stepBackward = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const resetSimulation = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // C++ copy snippet handler
  const currentSnippet = CPP_SNIPPETS[activeProblemId];
  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentSnippet.code.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to determine active pointers for a given node id
  const getPointersForNode = (nodeId: string, currentStep: SimulationStep | undefined) => {
    if (!currentStep) return [];
    const pointers = currentStep.pointers;
    return Object.entries(pointers)
      .filter(([_, targetId]) => targetId === nodeId)
      .map(([name]) => name);
  };

  const currentStep = steps[currentStepIndex];

  // Helper for preset inputs
  const selectPreset = (values: string, problemId: AlgorithmId) => {
    setList1Value(values);
    setActiveProblemId(problemId);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#FAF9F6] font-sans flex flex-col text-slate-800">
      
      {/* 1. TOP STICKY HEADER */}
      <header className="h-14 border-b border-slate-200 bg-white px-6 shrink-0 flex items-center justify-between z-30 shadow-xs">
        {/* Left Zone: App Branding */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-amber-50 border border-amber-200 rounded-md text-amber-600">
            <Link2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-serif text-base font-bold tracking-tight text-slate-900">
              Linked List Pointer Engine
            </h1>
            <div className="flex items-center gap-1.5 -mt-0.5">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-semibold">Interactive Sandbox</span>
              <span className="text-slate-300 text-[10px] font-mono">·</span>
              <span className="text-[9px] uppercase font-mono text-amber-600 font-bold bg-amber-50 px-1 rounded">In-Place visualizer</span>
            </div>
          </div>
        </div>

        {/* Middle Zone: Sequential Problem Navigator & Dropdown */}
        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={() => {
              const idx = PROBLEMS.findIndex(p => p.id === activeProblemId);
              if (idx > 0) setActiveProblemId(PROBLEMS[idx - 1].id);
            }}
            disabled={PROBLEMS.findIndex(p => p.id === activeProblemId) === 0}
            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 transition-colors"
            title="Previous Problem"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className="flex items-center justify-between gap-3 px-3 py-1.5 w-64 border border-slate-200 bg-white rounded-md text-xs font-semibold hover:bg-slate-50 active:bg-slate-100 transition-all text-left relative z-10"
          >
            <span className="truncate text-slate-900">
              {PROBLEMS.findIndex(p => p.id === activeProblemId) + 1}. {currentProblem.title}
            </span>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
          </button>

          <button
            onClick={() => {
              const idx = PROBLEMS.findIndex(p => p.id === activeProblemId);
              if (idx < PROBLEMS.length - 1) setActiveProblemId(PROBLEMS[idx + 1].id);
            }}
            disabled={PROBLEMS.findIndex(p => p.id === activeProblemId) === PROBLEMS.length - 1}
            className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 transition-colors"
            title="Next Problem"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Sequential Dropdown Overlay */}
          {isDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
              <div className="absolute top-11 left-1/2 -translate-x-1/2 w-80 max-h-96 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-2">
                {PROBLEM_SECTIONS.map((section, sIdx) => (
                  <div key={sIdx} className="mb-2 last:mb-0">
                    <div className="px-2 py-1 text-[10px] font-mono uppercase font-bold text-slate-400 tracking-wider border-b border-slate-50 pb-0.5 mb-1">
                      {section.title}
                    </div>
                    <div className="space-y-0.5 mt-1">
                      {section.problemIds.map((pId) => {
                        const prob = PROBLEMS.find(p => p.id === pId)!;
                        const globalIdx = PROBLEMS.findIndex(p => p.id === pId) + 1;
                        const isSelected = activeProblemId === pId;
                        return (
                          <button
                            key={pId}
                            onClick={() => {
                              setActiveProblemId(pId);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-amber-50 text-amber-900 border-l-2 border-amber-500'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <span className="truncate pr-1">
                              {globalIdx}. {prob.title}
                            </span>
                            <span className={`text-[9px] font-mono px-1 rounded shrink-0 ${
                              prob.difficulty === 'Easy' ? 'bg-emerald-50 text-emerald-700' :
                              prob.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' :
                              'bg-rose-50 text-rose-700'
                            }`}>
                              {prob.leetcodeTag}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Zone: Reset Sandbox & Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setList1Value(currentProblem.defaultValues);
              setParams(currentProblem.defaultParams);
              runSimulation();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white text-xs font-semibold text-slate-600 hover:bg-slate-50 active:bg-slate-100 rounded-md transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Case
          </button>

          <button
            onClick={runSimulation}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 text-amber-950 text-xs font-bold rounded-md hover:bg-amber-600 active:bg-amber-700 cursor-pointer shadow-xs transition-colors"
          >
            <Activity className="w-3.5 h-3.5" />
            Simulate
          </button>
        </div>
      </header>

      {/* 2. TOP QUESTION & TEST CASE CARD - HIGHLY COMPACT */}
      <section className="bg-slate-50 border-b border-slate-200 py-2 px-6 shrink-0 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col gap-2">
          
          {/* Title Row & Clear description Toggle Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm font-bold ${
                currentProblem.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                currentProblem.difficulty === 'Medium' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                'bg-rose-100 text-rose-800 border border-rose-200'
              }`}>
                {currentProblem.leetcodeTag} · {currentProblem.difficulty}
              </span>
              <h2 className="font-serif text-sm font-bold text-slate-900">{currentProblem.title}</h2>
            </div>
            
            {/* Highly tactile toggle button */}
            <button
              onClick={() => setIsDetailsExpanded(prev => !prev)}
              className="text-xs px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md shadow-xs text-slate-600 hover:text-slate-800 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {isDetailsExpanded ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                  <span>Hide Details</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Show Details</span>
                </>
              )}
            </button>
          </div>

          {/* Expandable Simple English Description Panel */}
          {isDetailsExpanded && (
            <div className="bg-white border border-slate-200 rounded-md p-3 text-xs text-slate-600 leading-relaxed shadow-xs transition-all duration-200 grid grid-cols-3 gap-4">
              
              {/* Col 1: Plain English Statement */}
              <div className="col-span-2 border-r border-slate-100 pr-4">
                <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Question Description</span>
                <p className="text-slate-700 font-medium">
                  {currentProblem.questionText || currentProblem.description}
                </p>
              </div>

              {/* Col 2: Test Case Example (Plain English style) */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Example Case</span>
                  <div className="font-mono text-[11px] text-slate-600 space-y-0.5">
                    <div><span className="text-slate-400 font-semibold">Input:</span> {currentProblem.exampleInput || currentProblem.defaultValues}</div>
                    <div><span className="text-slate-400 font-semibold">Expected:</span> {currentProblem.expectedOutput || 'Output matches algorithm'}</div>
                  </div>
                </div>

                <div className="mt-2 bg-amber-50 border border-amber-100 p-1.5 rounded flex items-center gap-1.5 text-amber-900">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-mono text-[10px] font-semibold truncate">Safe cache invariant active.</span>
                </div>
              </div>
            </div>
          )}

          {/* Compact Custom Parameter / Input Fields */}
          <div className="flex flex-wrap items-center gap-4 bg-white border border-slate-200 rounded-md p-2 text-xs shadow-xs">
            {/* List 1 Text Field */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-400 font-semibold shrink-0">Head List:</span>
              <input
                type="text"
                value={list1Value}
                onChange={(e) => setList1Value(e.target.value)}
                placeholder="1 -> 2 -> 3"
                className="px-2 py-0.5 border border-slate-200 rounded font-mono text-xs w-44 focus:outline-hidden focus:border-amber-400 bg-slate-50/50"
              />
            </div>

            {/* List 2 (Dynamic depending on Problem type) */}
            {(activeProblemId === 'merge-two' || activeProblemId === 'add-two' || activeProblemId === 'merge-k') && (
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-400 font-semibold shrink-0">List 2:</span>
                <input
                  type="text"
                  value={list2Value}
                  onChange={(e) => setList2Value(e.target.value)}
                  placeholder="2 -> 4 -> 6"
                  className="px-2 py-0.5 border border-slate-200 rounded font-mono text-xs w-44 focus:outline-hidden focus:border-amber-400 bg-slate-50/50"
                />
              </div>
            )}

            {/* List 3 (For Merge K lists) */}
            {activeProblemId === 'merge-k' && (
              <div className="flex items-center gap-2">
                <span className="font-mono text-slate-400 font-semibold shrink-0">List 3:</span>
                <input
                  type="text"
                  value={list3Value}
                  onChange={(e) => setList3Value(e.target.value)}
                  placeholder="3 -> 5 -> 9"
                  className="px-2 py-0.5 border border-slate-200 rounded font-mono text-xs w-44 focus:outline-hidden focus:border-amber-400 bg-slate-50/50"
                />
              </div>
            )}

            {/* In-Place bounds parameter config */}
            {Object.keys(currentProblem.defaultParams).map((paramKey) => (
              <div key={paramKey} className="flex items-center gap-2">
                <span className="font-mono text-slate-400 font-semibold shrink-0">
                  {currentProblem.paramLabels[paramKey] || paramKey}:
                </span>
                <input
                  type="number"
                  value={params[paramKey] ?? currentProblem.defaultParams[paramKey]}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v)) {
                      setParams(prev => ({ ...prev, [paramKey]: v }));
                    }
                  }}
                  className="px-1.5 py-0.5 border border-slate-200 rounded font-mono text-xs w-14 text-center focus:outline-hidden focus:border-amber-400 bg-slate-50/50"
                />
              </div>
            ))}

            {/* Presets Quick-Click Buttons */}
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Presets:</span>
              <button
                onClick={() => selectPreset('1 -> 2 -> 3 -> 4 -> 5', activeProblemId)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-[10px] rounded font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                Linear
              </button>
              <button
                onClick={() => selectPreset('1 -> 1 -> 2 -> 3 -> 3', activeProblemId)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-[10px] rounded font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                Duplicates
              </button>
              <button
                onClick={() => selectPreset('4 -> 2 -> 1 -> 3', activeProblemId)}
                className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-[10px] rounded font-semibold text-slate-600 transition-colors cursor-pointer"
              >
                Unordered
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SIDE-BY-SIDE SPLIT WORKSPACE - SCREEN-FIT LAYOUT */}
      <main className="flex-grow flex overflow-hidden max-w-7xl w-full mx-auto px-6 py-3 gap-4 min-h-0">
        
        {/* LEFT COLUMN: Interactive Linked List Canvas + Playback Deck */}
        <section className="w-7/12 flex flex-col h-full gap-3 min-h-0">
          
          {/* Main Visualizer Stage */}
          <div className="flex-grow bg-white border border-slate-200 rounded-xl relative p-4 flex flex-col justify-center overflow-y-auto min-h-0 shadow-xs">
            
            {/* Track Renderer */}
            <div className="space-y-10 w-full py-2 relative">
              {currentStep && currentStep.tracks && currentStep.tracks.length > 0 ? (
                currentStep.tracks.map((track, tIdx) => {
                  const nodeStateList = track.nodeIds.map(nodeId => currentStep.nodes.find(n => n.id === nodeId)).filter(Boolean) as ListNodeState[];

                  return (
                    <div key={tIdx} className="relative flex flex-col">
                      {/* Track Title Indicator */}
                      <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold mb-4 flex items-center gap-1">
                        <Layers className="w-3 h-3 text-amber-500" />
                        {track.title}
                      </div>

                      {/* Flex track container of horizontal nodes */}
                      <div className="flex flex-wrap items-center gap-y-8 gap-x-0 relative pl-4">
                        {nodeStateList.map((node, nodeIdx) => {
                          const activePointers = getPointersForNode(node.id, currentStep);
                          const brokenLink = currentStep.brokenLinks.find(l => l.fromNodeId === node.id);

                          return (
                            <React.Fragment key={node.id}>
                              {/* Horizontal Node Wrapper containing floating pointers and the actual compartment card */}
                              <div className="relative flex flex-col items-center">
                                
                                {/* Floating Pointer Anchors Row */}
                                <div className="absolute -top-7 h-6 flex flex-col-reverse gap-0.5 items-center justify-end z-10">
                                  {activePointers.map((pName) => {
                                    let badgeStyle = 'bg-slate-100 text-slate-800 border-slate-300';
                                    if (pName === 'curr') badgeStyle = 'bg-indigo-100 text-indigo-900 border-indigo-300 font-semibold';
                                    if (pName === 'prev') badgeStyle = 'bg-amber-100 text-amber-900 border-amber-300 font-semibold';
                                    if (pName === 'next' || pName === 'temp') badgeStyle = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';
                                    if (pName === 'dummy') badgeStyle = 'bg-purple-100 text-purple-900 border-purple-300 border-dashed font-semibold';

                                    return (
                                      <span
                                        key={pName}
                                        className={`px-1.5 py-0.2 text-[8px] font-mono rounded-xs tracking-tight border capitalize pointer-animation shrink-0 ${badgeStyle}`}
                                      >
                                        {pName}
                                      </span>
                                    );
                                  })}
                                </div>

                                {/* Dual-Compartment Card */}
                                <div
                                  className={`flex items-stretch h-10 rounded-md border bg-white shadow-xs select-none transition-all duration-300 ${
                                    node.isDummy ? 'border-purple-300 bg-purple-50/20' :
                                    activePointers.includes('curr') ? 'ring-2 ring-indigo-400 ring-offset-2 border-indigo-200' :
                                    activePointers.includes('prev') ? 'border-amber-400 shadow-xs' :
                                    'border-slate-200'
                                  } ${node.isBypassed ? 'opacity-30 line-through scale-95' : 'opacity-100'}`}
                                >
                                  {/* Left Compartment: Node Value */}
                                  <div className="px-3 flex items-center justify-center font-mono font-bold text-xs text-slate-800 border-r border-slate-100">
                                    {node.val}
                                  </div>

                                  {/* Right Compartment: Socket + Memory Address */}
                                  <div className="px-1.5 bg-slate-50/50 rounded-r-md flex flex-col justify-center items-center">
                                    <span className="text-[7px] font-mono text-slate-400 leading-none">
                                      {node.address}
                                    </span>
                                    <div className="w-2 h-2 rounded-full bg-slate-200 border border-slate-300 mt-0.5 flex items-center justify-center relative">
                                      <div className="w-1 h-1 rounded-full bg-slate-500" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Pointer Link SVG arrow connects adjacent cards */}
                              {nodeIdx < nodeStateList.length - 1 && (
                                <div className="w-8 h-10 flex items-center justify-center relative shrink-0">
                                  {brokenLink ? (
                                    brokenLink.isRewiredBackward ? (
                                      // Glowing amber rewired backward pointer link arrow
                                      <svg className="absolute inset-0 w-full h-full overflow-visible z-20" viewBox="0 0 32 40">
                                        <path
                                          d="M 34 20 C 16 6, 16 6, -2 20"
                                          fill="none"
                                          className="stroke-amber-500 stroke-2 animate-pulse-arrow"
                                        />
                                        <polygon points="-2,20 4,16 3,22" fill="#D97706" />
                                      </svg>
                                    ) : (
                                      // Severed broken pointer link with "X" tag
                                      <svg className="absolute inset-0 w-full h-full overflow-visible z-20" viewBox="0 0 32 40">
                                        <line
                                          x1="-2"
                                          y1="20"
                                          x2="34"
                                          y2="20"
                                          stroke="#ef4444"
                                          strokeWidth="2"
                                          strokeDasharray="4 2"
                                        />
                                        <g transform="translate(16, 20)">
                                          <circle r="5" fill="#ef4444" className="stroke-white stroke-1" />
                                          <text x="0" y="2" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle">×</text>
                                        </g>
                                      </svg>
                                    )
                                  ) : (
                                    // Regular Forward SVG Arrow
                                    <svg className="absolute inset-0 w-full h-full overflow-visible z-10" viewBox="0 0 32 40">
                                      <line
                                        x1="-2"
                                        y1="20"
                                        x2="34"
                                        y2="20"
                                        stroke="#cbd5e1"
                                        strokeWidth="1.5"
                                      />
                                      <polygon points="34,20 28,16 29,20 28,24" fill="#cbd5e1" />
                                    </svg>
                                  )}
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}

                        {/* nullptr Terminating Chip */}
                        {nodeStateList.length > 0 && (
                          <div className="w-8 h-10 flex items-center justify-center shrink-0">
                            <svg className="absolute inset-0 w-full h-full overflow-visible z-10" viewBox="0 0 32 40">
                              <line
                                x1="-2"
                                y1="20"
                                x2="26"
                                y2="20"
                                stroke="#cbd5e1"
                                strokeWidth="1.5"
                              />
                              <polygon points="26,20 20,16 21,20 20,24" fill="#cbd5e1" />
                            </svg>
                          </div>
                        )}
                        
                        {nodeStateList.length > 0 && (
                          <div className="h-10 flex items-center">
                            <span className="bg-slate-100 border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded text-[8px] font-mono font-semibold uppercase tracking-wider">
                              nullptr
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Active K-Group Bracket Indicator */}
                      {currentStep && currentStep.kGroupBracket && (
                        <div className="absolute top-8 left-12 right-12 h-14 border-2 border-amber-400 border-t-0 rounded-b bg-amber-500/5 -z-10 flex items-end justify-center pb-0.5">
                          <span className="text-[8px] font-mono font-semibold uppercase text-amber-700 bg-amber-50 px-1 rounded">
                            k-Group ({currentStep.kGroupBracket.k})
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs font-mono">
                  No active tracks available.
                </div>
              )}
            </div>
          </div>

          {/* Docked Playback Bar */}
          <div className="bg-slate-900 text-white rounded-xl p-3 flex flex-col gap-2 shrink-0 shadow-md">
            
            {/* Scrubber & Controls row */}
            <div className="flex items-center justify-between gap-4">
              
              {/* Left Zone: Backward / Play / Forward buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={resetSimulation}
                  disabled={currentStepIndex === 0}
                  className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Reset to start [R]"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={stepBackward}
                  disabled={currentStepIndex === 0}
                  className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Step Backward [Left]"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {/* Main Play Toggle */}
                <button
                  onClick={() => setIsPlaying(prev => !prev)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 rounded text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  title="Toggle autoplay [Space]"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                      <span className="text-[10px] uppercase font-mono tracking-wider">Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                      <span className="text-[10px] uppercase font-mono tracking-wider">Play</span>
                    </>
                  )}
                </button>

                <button
                  onClick={stepForward}
                  disabled={currentStepIndex === steps.length - 1}
                  className="p-1.5 rounded bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
                  title="Step Forward [Right]"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Middle Zone: Playback step timeline slider */}
              <div className="flex-grow flex items-center gap-2.5">
                <input
                  type="range"
                  min="0"
                  max={Math.max(0, steps.length - 1)}
                  value={currentStepIndex}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setCurrentStepIndex(parseInt(e.target.value, 10));
                  }}
                  className="flex-grow accent-amber-500 bg-slate-700 h-1 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] font-mono text-slate-400 min-w-[45px] text-right">
                  {currentStepIndex + 1}/{steps.length || 1}
                </span>
              </div>

              {/* Right Zone: Playback speed select */}
              <div className="flex items-center gap-1.5 bg-slate-800 border border-slate-700/60 px-2 py-0.5 rounded">
                <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">Speed</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                  className="bg-transparent text-white text-[10px] font-mono focus:outline-hidden font-semibold cursor-pointer"
                >
                  <option value="0.5" className="bg-slate-900 text-white">0.5x</option>
                  <option value="1" className="bg-slate-900 text-white">1.0x</option>
                  <option value="2" className="bg-slate-900 text-white">2.0x</option>
                </select>
              </div>
            </div>

            {/* Description Banner explaining the current link modifications */}
            <div className="bg-slate-800 border-l-2 border-amber-500 p-2 text-[11px] text-slate-300 leading-relaxed font-mono flex items-start gap-2">
              <span className="text-amber-500 font-bold shrink-0">[STEP {currentStepIndex + 1}]:</span>
              <p className="flex-grow truncate-ellipsis">{currentStep ? currentStep.description : 'No steps loaded.'}</p>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Code highlights, Live status registers, Memory mapping, and Logs */}
        <section className="w-5/12 flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs min-h-0">
          
          {/* Header Segmented Filter Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 border-b border-slate-200 shrink-0">
            <button
              onClick={() => setActiveTab('trace')}
              className={`flex-grow py-1.5 text-[11px] font-bold rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'trace' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-amber-500" />
              C++ Trace
            </button>
            
            <button
              onClick={() => setActiveTab('state')}
              className={`flex-grow py-1.5 text-[11px] font-bold rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'state' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-indigo-500" />
              State
            </button>

            <button
              onClick={() => setActiveTab('memory')}
              className={`flex-grow py-1.5 text-[11px] font-bold rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'memory' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-500" />
              Heap
            </button>

            <button
              onClick={() => setActiveTab('logs')}
              className={`flex-grow py-1.5 text-[11px] font-bold rounded-md transition-all flex items-center justify-center gap-1 cursor-pointer ${
                activeTab === 'logs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Undo2 className="w-3.5 h-3.5 text-purple-500" />
              Logs
            </button>
          </div>

          {/* Tab Viewport Contents */}
          <div className="flex-grow overflow-y-auto p-3 bg-slate-50 min-h-0 relative">
            
            {/* TAB 1: C++ Trace with Synchronized Highlight */}
            {activeTab === 'trace' && (
              <div className="flex flex-col h-full gap-2.5 min-h-0">
                <div className="flex items-center justify-between shrink-0">
                  <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">C++ Pointer Code Snippet</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded text-[9px] font-semibold text-slate-600 transition-colors"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy Code'}
                  </button>
                </div>

                <div className="flex-grow bg-slate-950 rounded-lg p-2.5 font-mono text-xs overflow-auto text-slate-300 shadow-inner border border-slate-800 min-h-0">
                  {currentSnippet.code.map((line, idx) => {
                    const isHighlighted = currentStep ? currentStep.lineHighlight === (idx + 1) : false;
                    return (
                      <div
                        key={idx}
                        className={`flex items-start py-0.5 px-2 rounded-xs transition-colors ${
                          isHighlighted ? 'bg-amber-950/80 border-l-2 border-amber-500 text-amber-100 font-bold font-mono' : ''
                        }`}
                      >
                        <span className="text-slate-600 select-none w-4 text-right mr-3 text-[9px] leading-tight font-mono">
                          {idx + 1}
                        </span>
                        <pre className="whitespace-pre-wrap leading-tight font-mono text-[10px]">{line}</pre>
                      </div>
                    );
                  })}
                </div>
                
                {/* Visual Line Description callout */}
                {currentStep && currentSnippet.lineDescriptions[currentStep.lineHighlight] && (
                  <div className="bg-amber-50/70 border border-amber-200/50 p-2 rounded text-[11px] text-amber-900 leading-normal shrink-0">
                    <span className="font-bold font-serif text-amber-950 block mb-0.5">Line {currentStep.lineHighlight} Status:</span>
                    <p className="font-sans font-medium text-amber-900/95">{currentSnippet.lineDescriptions[currentStep.lineHighlight]}</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Live State Register Inspector */}
            {activeTab === 'state' && (
              <div className="space-y-3">
                
                {/* 1. Pointer registers mapping */}
                <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Pointer Registers State</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {currentStep && Object.entries(currentStep.pointers).map(([pName, nodeId]) => {
                      const matchedNode = nodeId ? currentStep.nodes.find(n => n.id === nodeId) : null;
                      return (
                        <div key={pName} className="bg-slate-50 border border-slate-100 rounded px-2 py-1.5 flex items-center justify-between">
                          <span className="font-mono text-[11px] font-semibold capitalize text-slate-500">{pName}:</span>
                          <span className={`font-mono text-[11px] ${matchedNode ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>
                            {matchedNode ? `${matchedNode.address} (val: ${matchedNode.val})` : 'nullptr'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Active Rewire Action explanation */}
                <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-xs">
                  <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Active Connections</span>
                  <div className="space-y-1">
                    {currentStep && currentStep.brokenLinks.length > 0 ? (
                      currentStep.brokenLinks.map((link, idx) => {
                        const fromNode = currentStep.nodes.find(n => n.id === link.fromNodeId);
                        const toNode = link.toNodeId ? currentStep.nodes.find(n => n.id === link.toNodeId) : null;
                        return (
                          <div key={idx} className="flex items-center gap-2 text-[11px] font-mono">
                            <span className="text-slate-600 bg-slate-100 px-1.5 rounded">{fromNode ? `Node ${fromNode.val}` : 'Unknown'}</span>
                            <span className="text-slate-400">→</span>
                            <span className={`px-1.5 rounded ${link.isRewiredBackward ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800 line-through'}`}>
                              {toNode ? `Node ${toNode.val}` : 'nullptr'}
                            </span>
                            <span className="text-[9px] text-slate-400 font-semibold uppercase">
                              ({link.isRewiredBackward ? 'REWIRED' : 'SEVERED'})
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-[11px] text-slate-500 font-mono italic">No structural modifications in progress.</div>
                    )}
                  </div>
                </div>

                {/* 3. Carry arithmetic / Math details */}
                {currentStep && currentStep.mathState && (
                  <div className="bg-amber-50/50 border border-amber-200/50 rounded-lg p-2.5">
                    <span className="text-[9px] font-mono font-bold text-amber-800 uppercase tracking-wider block mb-1">Digit addition calculations</span>
                    <div className="font-mono text-[11px] space-y-1 text-amber-900">
                      <div>L1 Digit: <span className="font-bold">{currentStep.mathState.val1 ?? 0}</span> | L2 Digit: <span className="font-bold">{currentStep.mathState.val2 ?? 0}</span></div>
                      <div>Carry: <span className="font-bold">{currentStep.mathState.carry ?? 0}</span></div>
                      <div className="border-t border-amber-200 my-1 pt-1 font-bold">
                        Sum = {currentStep.mathState.val1} + {currentStep.mathState.val2} + {currentStep.mathState.carry} = {currentStep.mathState.sum}
                      </div>
                      <div>Output Value: <span className="text-amber-700 font-bold">{currentStep.mathState.newDigit}</span> (sum % 10)</div>
                    </div>
                  </div>
                )}

                {/* 4. Partition variables representation */}
                {currentStep && currentStep.partitionState && (
                  <div className="bg-indigo-50/40 border border-indigo-200/40 rounded-lg p-2.5">
                    <span className="text-[9px] font-mono font-bold text-indigo-800 uppercase tracking-wider block mb-1">Partition tracks</span>
                    <div className="space-y-1 font-mono text-[11px] text-indigo-900">
                      <div>
                        Less: <span className="font-semibold">{currentStep.partitionState.lessIds.map(id => currentStep.nodes.find(n => n.id === id)?.val).filter(v => v !== undefined && v !== -1).join(' → ') || 'empty'}</span>
                      </div>
                      <div>
                        Greater: <span className="font-semibold">{currentStep.partitionState.greaterIds.map(id => currentStep.nodes.find(n => n.id === id)?.val).filter(v => v !== undefined && v !== -1).join(' → ') || 'empty'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Heap Map registers */}
            {activeTab === 'memory' && (
              <div className="space-y-2.5">
                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Simulated Node Memory Layout</span>
                
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                  <table className="w-full font-mono text-[10px] text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                        <th className="px-2 py-1.5 text-[9px] uppercase">Address</th>
                        <th className="px-2 py-1.5 text-[9px] uppercase">Value</th>
                        <th className="px-2 py-1.5 text-[9px] uppercase">Next</th>
                        <th className="px-2 py-1.5 text-[9px] uppercase">Pointers</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentStep && currentStep.nodes.map((node) => {
                        const targetNode = node.nextId ? currentStep.nodes.find(n => n.id === node.nextId) : null;
                        const ptrs = getPointersForNode(node.id, currentStep);
                        return (
                          <tr key={node.id} className={`hover:bg-slate-50 ${node.isDummy ? 'bg-purple-50/10' : ''}`}>
                            <td className="px-2 py-1.5 font-bold text-slate-500">{node.address}</td>
                            <td className="px-2 py-1.5 text-slate-800 font-bold">{node.val}</td>
                            <td className="px-2 py-1.5 text-slate-400">
                              {targetNode ? targetNode.address : 'nullptr'}
                            </td>
                            <td className="px-2 py-1.5">
                              <div className="flex flex-wrap gap-1">
                                {ptrs.map(p => (
                                  <span key={p} className="bg-amber-100 text-amber-800 border border-amber-200 text-[8px] px-1 rounded-sm leading-none capitalize">
                                    {p}
                                  </span>
                                ))}
                                {ptrs.length === 0 && <span className="text-slate-400">-</span>}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: Chronological log */}
            {activeTab === 'logs' && (
              <div className="flex flex-col h-full gap-2 min-h-0">
                <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block shrink-0">Chronological execution logger</span>
                <div className="flex-grow bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-[10px] text-slate-300 overflow-y-auto space-y-1.5 shadow-inner min-h-0">
                  {currentStep && currentStep.logs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 leading-normal">
                      <span className="text-amber-500 select-none font-bold">»</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  {(!currentStep || currentStep.logs.length === 0) && (
                    <div className="text-slate-500 italic">No logs generated for this step.</div>
                  )}
                </div>
              </div>
            )}

          </div>
        </section>
      </main>
    </div>
  );
}
