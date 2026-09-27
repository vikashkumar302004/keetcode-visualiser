/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  TrackId, 
  AlgoId, 
  SimulationStep, 
  PRESETS, 
  CODE_TEMPLATES 
} from './types';
import { 
  generateSingleNumberSteps,
  generateHammingWeightSteps,
  generatePowerOfTwoSteps,
  generateMergeIntervalsSteps,
  generateInsertIntervalSteps,
  generateEraseOverlapSteps,
  generateMeetingRoomsSteps,
  generateMeetingRoomsIISteps
} from './simulationEngine';
import { TrackSelector } from './components/TrackSelector';
import { BitManipulationVisualizer } from './components/BitManipulationVisualizer';
import { IntervalVisualizer } from './components/IntervalVisualizer';
import { CppTracePanel } from './components/CppTracePanel';
import { Info, BookOpen, GraduationCap, ArrowLeft, Cpu, Code } from 'lucide-react';

const QUESTION_GUIDE_DATA: Record<AlgoId, {
  title: string;
  statement: string;
  getTestCaseDesc: (customInput: any) => { inputLabel: string; inputValue: string; expectedOutput: string; logic: string };
  bg: string;
  border: string;
}> = {
  'single-number': {
    title: 'LeetCode 136: Single Number',
    statement: 'Given a non-empty array of integers where every element appears twice except for one, find that single unique element. Can you do it in linear time O(N) without using extra memory O(1)?',
    getTestCaseDesc: (customInput) => {
      const arr = customInput || [4, 1, 2, 1, 2];
      const counts: Record<number, number> = {};
      arr.forEach((x: number) => { counts[x] = (counts[x] || 0) + 1; });
      const ans = Object.keys(counts).find(k => counts[Number(k)] === 1) || '?';
      return {
        inputLabel: 'Array of Numbers (nums):',
        inputValue: JSON.stringify(arr),
        expectedOutput: String(ans),
        logic: `All elements (except ${ans}) appear twice. Under XOR rules, duplicates cancel out (X ^ X = 0), leaving only ${ans}.`
      };
    },
    bg: 'bg-indigo-50/40',
    border: 'border-indigo-100/85'
  },
  'hamming-weight': {
    title: 'LeetCode 191: Number of 1 Bits',
    statement: 'Write a function that takes the binary representation of a positive integer and returns the number of set bits (also known as the Hamming weight) it contains.',
    getTestCaseDesc: (customInput) => {
      const val = customInput !== null && customInput !== undefined ? customInput : 11;
      const binary = (val >>> 0).toString(2);
      const count = (binary.match(/1/g) || []).length;
      return {
        inputLabel: 'Positive Integer (n):',
        inputValue: `${val} (Binary: ${binary})`,
        expectedOutput: String(count),
        logic: `There are exactly ${count} set bits ('1' digits) in the 32-bit binary representation of ${val}.`
      };
    },
    bg: 'bg-indigo-50/40',
    border: 'border-indigo-100/85'
  },
  'power-of-two': {
    title: 'LeetCode 231: Power of Two',
    statement: 'Given an integer n, return true if it is a power of two. Otherwise, return false. An integer n is a power of two if there exists an integer x such that n == 2^x.',
    getTestCaseDesc: (customInput) => {
      const val = customInput !== null && customInput !== undefined ? customInput : 16;
      const isPower = val > 0 && (val & (val - 1)) === 0;
      return {
        inputLabel: 'Integer (n):',
        inputValue: String(val),
        expectedOutput: String(isPower),
        logic: isPower 
          ? `${val} is a power of two because its binary form contains exactly one single set bit.` 
          : `${val} is NOT a power of two because its binary form has either zero or multiple set bits.`
      };
    },
    bg: 'bg-indigo-50/40',
    border: 'border-indigo-100/85'
  },
  'merge-intervals': {
    title: 'LeetCode 56: Merge Intervals',
    statement: 'Given an array of intervals where intervals[i] = [start, end], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the input intervals.',
    getTestCaseDesc: (customInput) => {
      const intervals = customInput || [[1, 3], [2, 6], [8, 10], [15, 18]];
      return {
        inputLabel: 'Loaded Intervals:',
        inputValue: JSON.stringify(intervals),
        expectedOutput: '[[1, 6], [8, 10], [15, 18]]',
        logic: 'Intervals like [1,3] and [2,6] overlap because 2 <= 3, so they are merged into [1,6]. Other intervals are separate.'
      };
    },
    bg: 'bg-amber-50/40',
    border: 'border-amber-100/80'
  },
  'insert-interval': {
    title: 'LeetCode 57: Insert Interval',
    statement: 'You are given an array of non-overlapping intervals sorted by their start times, and a newInterval. Insert newInterval into the sorted list, merging overlaps if necessary, while maintaining sorted order.',
    getTestCaseDesc: (customInput) => {
      const data = customInput || { intervals: [[1, 3], [6, 9]], newInterval: [2, 5] };
      return {
        inputLabel: 'Existing & New Interval:',
        inputValue: `List: ${JSON.stringify(data.intervals)} | New: ${JSON.stringify(data.newInterval)}`,
        expectedOutput: '[[1, 5], [6, 9]]',
        logic: `The new interval ${JSON.stringify(data.newInterval)} overlaps with [1,3], combining them into a single merged interval [1,5].`
      };
    },
    bg: 'bg-amber-50/40',
    border: 'border-amber-100/80'
  },
  'erase-overlap': {
    title: 'LeetCode 435: Non-overlapping Intervals',
    statement: 'Given an array of intervals, find the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.',
    getTestCaseDesc: (customInput) => {
      const intervals = customInput || [[1, 2], [2, 3], [3, 4], [1, 3]];
      return {
        inputLabel: 'List of Intervals:',
        inputValue: JSON.stringify(intervals),
        expectedOutput: '1',
        logic: 'Removing [1,3] resolves all collisions, leaving [1,2], [2,3], and [3,4] completely disjoint.'
      };
    },
    bg: 'bg-amber-50/40',
    border: 'border-amber-100/80'
  },
  'meeting-rooms': {
    title: 'LeetCode 252: Meeting Rooms',
    statement: 'Given an array of meeting time intervals consisting of start and end times [[s1,e1],[s2,e2],...] determine if a person could attend all meetings without any overlap.',
    getTestCaseDesc: (customInput) => {
      const intervals = customInput || [[0, 30], [5, 10], [15, 20]];
      return {
        inputLabel: 'Meeting Intervals:',
        inputValue: JSON.stringify(intervals),
        expectedOutput: 'false',
        logic: 'Meetings like [0,30] and [5,10] take place concurrently, which creates a schedule conflict.'
      };
    },
    bg: 'bg-amber-50/40',
    border: 'border-amber-100/80'
  },
  'meeting-rooms-ii': {
    title: 'LeetCode 253: Meeting Rooms II',
    statement: 'Given an array of meeting time intervals consisting of start and end times, find the minimum number of conference rooms required to schedule all meetings.',
    getTestCaseDesc: (customInput) => {
      const intervals = customInput || [[0, 30], [5, 10], [15, 20]];
      return {
        inputLabel: 'Meeting Intervals:',
        inputValue: JSON.stringify(intervals),
        expectedOutput: '2 Rooms Required',
        logic: 'At peak time (e.g., between 5 and 10), we have two meetings [0,30] and [5,10] running at the same time, requiring 2 separate rooms.'
      };
    },
    bg: 'bg-amber-50/40',
    border: 'border-amber-100/80'
  }
};

export default function App() {
  const [activeTrack, setActiveTrack] = useState<TrackId>('bit');
  const [activeAlgo, setActiveAlgo] = useState<AlgoId | null>(null);
  
  // Simulation timelines
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1500); // speed in ms
  const [customInputData, setCustomInputData] = useState<any>(null);

  // Helper to generate steps for any selected algorithm and optional custom data
  const generateStepsForAlgo = (algo: AlgoId, customData?: any): SimulationStep[] => {
    switch (algo) {
      case 'single-number':
        return generateSingleNumberSteps(customData || PRESETS['single-number']);
      case 'hamming-weight':
        return generateHammingWeightSteps(customData !== undefined ? customData : PRESETS['hamming-weight']);
      case 'power-of-two':
        return generatePowerOfTwoSteps(customData !== undefined ? customData : PRESETS['power-of-two']);
      case 'merge-intervals':
        return generateMergeIntervalsSteps(customData || PRESETS['merge-intervals']);
      case 'insert-interval': {
        const data = customData || PRESETS['insert-interval'];
        return generateInsertIntervalSteps(data.intervals, data.newInterval);
      }
      case 'erase-overlap':
        return generateEraseOverlapSteps(customData || PRESETS['erase-overlap']);
      case 'meeting-rooms':
        return generateMeetingRoomsSteps(customData || PRESETS['meeting-rooms']);
      case 'meeting-rooms-ii':
        return generateMeetingRoomsIISteps(customData || PRESETS['meeting-rooms-ii']);
      default:
        return [];
    }
  };

  // Reset or generate new simulation timeline whenever active algorithm or custom data changes
  useEffect(() => {
    if (!activeAlgo) {
      setSteps([]);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      return;
    }
    const newSteps = generateStepsForAlgo(activeAlgo, customInputData);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [activeAlgo, customInputData]);

  // Handle auto playback interval
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStepIndex((prevIndex) => {
        if (prevIndex >= steps.length - 1) {
          setIsPlaying(false);
          return prevIndex;
        }
        return prevIndex + 1;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, steps.length]);

  // Reset custom input when changing algorithm to standard preset
  const handleAlgoChange = (algo: AlgoId | null) => {
    setActiveAlgo(algo);
    setCustomInputData(null);
  };

  const handleTrackChange = (track: TrackId) => {
    setActiveTrack(track);
    setCustomInputData(null);
  };

  // Handlers for trace engine controls
  const handlePlayPause = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleCustomInput = (data: any) => {
    setCustomInputData(data);
  };

  // Safety checks
  const currentStep = steps[currentStepIndex] || {
    line: 1,
    description: 'Initializing algorithm state...',
    variables: {},
    dataState: {}
  };

  const activeCodeBlock = activeAlgo ? CODE_TEMPLATES[activeAlgo] : { language: 'cpp', code: '', lines: [] };

  return (
    <div id="app-root-container" className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Visual Navigation Top Header */}
      <header id="app-header" className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div id="header-content" className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div id="brand-logo-container" className="flex items-center gap-3">
            <div id="brand-avatar" className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <GraduationCap id="brand-icon" className="w-5.5 h-5.5" />
            </div>
            <div id="brand-titles">
              <h1 id="app-main-title" className="font-display font-bold text-xl tracking-tight text-slate-950">
                Lumina Algorithm Lab
              </h1>
              <p id="app-subtitle" className="text-xs font-sans text-slate-500 font-medium">
                Bitwise & Interval Algorithm Visualizer
              </p>
            </div>
          </div>
          
          <div id="header-badge-row" className="flex items-center gap-2">
            <span id="badge-cpp-standard" className="text-xs font-mono text-slate-500 bg-slate-100 border border-slate-200/50 px-2.5 py-1 rounded-lg">
              C++20 Standard
            </span>
            <span id="badge-educational" className="text-xs font-sans text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              Interactive Playrooms
            </span>
          </div>
        </div>
      </header>

      {/* Main Container Dashboard */}
      <main id="app-main-layout" className="max-w-7xl mx-auto px-6 mt-8 flex flex-col gap-8">
        
        {/* If NO algorithm is currently active (Dashboard Hub mode) */}
        {!activeAlgo ? (
          <>
            {/* Intro Block */}
            <section id="lab-intro-section" className="text-center max-w-3xl mx-auto flex flex-col gap-2 my-4">
              <h2 id="section-intro-heading" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-slate-950">
                Demystify Bitwise Operations & Overlapping Ranges
              </h2>
              <p id="section-intro-body" className="font-sans text-sm md:text-base text-slate-500 leading-relaxed">
                Choose a visualizer track below. Click a category card to expand its available questions, then select a question to launch the interactive workspace and C++ trace engine.
              </p>
            </section>

            {/* Category track selection tab */}
            <section id="track-selection-section" className="w-full">
              <TrackSelector
                activeTrack={activeTrack}
                onTrackChange={handleTrackChange}
                activeAlgo={activeAlgo}
                onAlgoChange={handleAlgoChange}
              />
            </section>
          </>
        ) : (
          /* If a question is selected, launch the workspace */
          <>
            {/* Breadcrumb Header Bar */}
            <div id="breadcrumb-navigation-row" className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
              <button
                id="btn-back-to-hub"
                onClick={() => setActiveAlgo(null)}
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm text-xs font-sans font-bold text-indigo-600 hover:text-indigo-800 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Category Cards</span>
              </button>

              <div id="breadcrumb-current-topic" className="flex items-center gap-2 text-xs font-sans">
                <span className="text-slate-400 font-medium">Currently Visualizing:</span>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold px-3 py-1 rounded-lg">
                  {activeTrack === 'bit' ? 'Track A (Bitwise)' : 'Track B (Intervals)'}
                </span>
                <span className="text-slate-300">/</span>
                <span className="bg-slate-100 text-slate-800 border border-slate-200/50 font-bold px-3 py-1 rounded-lg">
                  {activeAlgo === 'single-number' && 'Single Number'}
                  {activeAlgo === 'hamming-weight' && 'Hamming Weight'}
                  {activeAlgo === 'power-of-two' && 'Power of Two'}
                  {activeAlgo === 'merge-intervals' && 'Merge Intervals'}
                  {activeAlgo === 'insert-interval' && 'Insert Interval'}
                  {activeAlgo === 'erase-overlap' && 'Erase Overlap'}
                  {activeAlgo === 'meeting-rooms' && 'Meeting Rooms I'}
                  {activeAlgo === 'meeting-rooms-ii' && 'Meeting Rooms II'}
                </span>
              </div>
            </div>

            {/* Question Statement and Test Cases Explainer */}
            {activeAlgo && QUESTION_GUIDE_DATA[activeAlgo] && (() => {
              const info = QUESTION_GUIDE_DATA[activeAlgo];
              const testCase = info.getTestCaseDesc(customInputData);
              return (
                <div id="algo-theory-guide-card" className={`border ${info.border} bg-white rounded-2xl p-5 shadow-sm flex flex-col md:flex-row gap-6 items-stretch justify-between`}>
                  {/* Left Column: Problem Statement */}
                  <div className="flex-1 flex gap-3.5 items-start">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/80 shadow-sm flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="font-sans font-extrabold text-slate-900 text-sm">
                        {info.title}
                      </h3>
                      <p className="font-sans text-xs text-slate-500 font-medium leading-relaxed">
                        <strong className="text-slate-700 block text-[10px] tracking-wider uppercase mb-1">Problem Statement (सवाल क्या है?)</strong>
                        {info.statement}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Active Test Case Explanation */}
                  <div className="md:w-[320px] lg:w-[380px] shrink-0 border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-6 flex flex-col gap-2.5 justify-center">
                    <div>
                      <span className="block font-sans font-bold text-[10px] tracking-wider uppercase text-slate-400 mb-1">
                        Active Test Case (टेस्ट केस क्या है?)
                      </span>
                      <div className="flex flex-col gap-1 bg-slate-50 border border-slate-150 rounded-lg p-2.5">
                        <div className="flex justify-between text-[11px] font-sans">
                          <span className="text-slate-500 font-medium">{testCase.inputLabel}</span>
                          <span className="font-mono font-bold text-slate-800 truncate max-w-[200px]" title={testCase.inputValue}>{testCase.inputValue}</span>
                        </div>
                        <div className="flex justify-between text-[11px] font-sans border-t border-slate-200/60 pt-1 mt-1">
                          <span className="text-slate-500 font-medium">Expected Output:</span>
                          <span className="font-mono font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100/50 px-1.5 py-0.5 rounded">
                            {testCase.expectedOutput}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="font-sans text-[11px] text-slate-500 leading-normal font-medium bg-indigo-50/20 border border-indigo-100/20 p-2 rounded-lg">
                      {testCase.logic}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Dual-Column Execution Grid */}
            <section id="dual-column-dashboard" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Playground & Live Visualization Stage (7 columns on desktop) */}
              <div id="stage-column" className="lg:col-span-7 flex flex-col gap-6">
                {activeTrack === 'bit' ? (
                  <BitManipulationVisualizer
                    algoId={activeAlgo}
                    currentStep={currentStep}
                    onCustomInputSubmit={handleCustomInput}
                  />
                ) : (
                  <IntervalVisualizer
                    algoId={activeAlgo}
                    currentStep={currentStep}
                    onCustomInputSubmit={handleCustomInput}
                  />
                )}

                {/* Step Explanation Text Card - Located directly below the visualizer stage */}
                <div id="explanation-card" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div id="explanation-header" className="flex items-center gap-2 mb-3">
                    <div id="info-icon-bubble" className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                      <Info id="info-icon" className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h4 id="explanation-title" className="font-sans font-bold text-xs tracking-wider uppercase text-slate-400">
                      Step Execution Summary
                    </h4>
                  </div>
                  <p id="explanation-body" className="font-sans text-sm text-slate-700 leading-relaxed font-medium">
                    {currentStep.description}
                  </p>
                </div>
              </div>

              {/* Right Column: C++ Source Code Trace Engine (5 columns on desktop) */}
              <div id="debugger-column" className="lg:col-span-5 h-full">
                <CppTracePanel
                  codeBlock={activeCodeBlock}
                  currentLine={currentStep.line}
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  onReset={handleReset}
                  speed={speed}
                  onSpeedChange={setSpeed}
                  variables={currentStep.variables}
                  currentStepIndex={currentStepIndex}
                  totalSteps={steps.length}
                />
              </div>

            </section>
          </>
        )}

      </main>
    </div>
  );
}
