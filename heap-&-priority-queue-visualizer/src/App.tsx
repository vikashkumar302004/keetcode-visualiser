import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HEAP_PROBLEMS } from './data/heapProblems';
import { CPP_SNIPPETS } from './algorithms/cppSnippets';
import {
  simulateInsert,
  simulateExtract,
  simulateBuildHeap,
  simulateHeapSort,
  simulateKthLargest,
  simulateTopKFrequent,
  simulateKClosestPoints,
  simulateSortCharsFreq,
  simulateMedianStream,
  simulateSlidingWindowMedian,
  simulateMergeKSorted,
  simulateReorganizeString,
  simulateTaskScheduler,
  simulateConnectSticks,
  simulateKPairsSmallestSums,
  simulateMeetingRoomsII,
  simulateKthSmallestMatrix,
  simulateFurthestBuilding
} from './algorithms/heapAlgorithms';
import { ProblemDefinition, HeapType, SimulationStep } from './types';
import { Header } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { HeapTreeCanvas } from './components/HeapTreeCanvas';
import { HeapArrayCanvas } from './components/HeapArrayCanvas';
import { DualHeapCanvas } from './components/DualHeapCanvas';
import { SimulationControls } from './components/SimulationControls';
import { TraceAndStatePanel } from './components/TraceAndStatePanel';
import { OutputBox } from './components/OutputBox';

function generateSimulationSteps(
  problem: ProblemDefinition,
  testCase: Record<string, any>,
  heapType: HeapType
): SimulationStep[] {
  switch (problem.id) {
    case 'p01_insert': {
      const initial = testCase.initialHeap || [90, 75, 80, 50, 60, 40, 70];
      const val = Number(testCase.insertVal ?? 85);
      return simulateInsert(initial, val, heapType);
    }
    case 'p02_extract': {
      const h = testCase.heap || [95, 80, 85, 60, 70, 50, 65, 30, 40];
      return simulateExtract(h, heapType);
    }
    case 'p03_build_heap': {
      const arr = testCase.arr || [14, 28, 65, 32, 89, 45, 99, 12];
      return simulateBuildHeap(arr, heapType);
    }
    case 'p04_heap_sort': {
      const arr = testCase.arr || [42, 18, 91, 23, 77, 35, 60];
      return simulateHeapSort(arr);
    }
    case 'p05_kth_largest': {
      const nums = testCase.nums || [3, 2, 1, 5, 6, 4];
      const k = Number(testCase.k || 2);
      return simulateKthLargest(nums, k);
    }
    case 'p06_top_k_frequent': {
      const nums = testCase.nums || [1, 1, 1, 2, 2, 3, 4, 4, 4, 4];
      const k = Number(testCase.k || 2);
      return simulateTopKFrequent(nums, k);
    }
    case 'p07_k_closest_points': {
      const points = testCase.points || [[3, 3], [5, -1], [-2, 4], [1, 2], [2, 1]];
      const k = Number(testCase.k || 3);
      return simulateKClosestPoints(points, k);
    }
    case 'p08_sort_chars_freq': {
      const s = String(testCase.s || 'treebanana');
      return simulateSortCharsFreq(s);
    }
    case 'p09_median_stream': {
      const stream = testCase.stream || [5, 15, 1, 3, 8, 7, 9, 2];
      return simulateMedianStream(stream);
    }
    case 'p10_sliding_window_median': {
      const nums = testCase.nums || [1, 3, -1, -3, 5, 3, 6, 7];
      const k = Number(testCase.k || 3);
      return simulateSlidingWindowMedian(nums, k);
    }
    case 'p11_merge_k_sorted': {
      const lists = testCase.lists || [[1, 4, 7], [2, 5, 8], [0, 6, 9]];
      return simulateMergeKSorted(lists);
    }
    case 'p12_reorganize_string': {
      const s = String(testCase.s || 'aab');
      return simulateReorganizeString(s);
    }
    case 'p13_task_scheduler': {
      const tasks = testCase.tasks || ['A', 'A', 'A', 'B', 'B', 'B'];
      const n = Number(testCase.n || 2);
      return simulateTaskScheduler(tasks, n);
    }
    case 'p14_connect_sticks': {
      const sticks = testCase.sticks || [2, 4, 3, 1, 5];
      return simulateConnectSticks(sticks);
    }
    case 'p15_k_pairs_smallest_sums': {
      const nums1 = testCase.nums1 || [1, 7, 11];
      const nums2 = testCase.nums2 || [2, 4, 6];
      const k = Number(testCase.k || 3);
      return simulateKPairsSmallestSums(nums1, nums2, k);
    }
    case 'p16_meeting_rooms_ii': {
      const intervals = testCase.intervals || [[0, 30], [5, 10], [15, 20]];
      return simulateMeetingRoomsII(intervals);
    }
    case 'p17_kth_smallest_matrix': {
      const matrix = testCase.matrix || [[1, 5, 9], [10, 11, 13], [12, 13, 15]];
      const k = Number(testCase.k || 8);
      return simulateKthSmallestMatrix(matrix, k);
    }
    case 'p18_furthest_building': {
      const heights = testCase.heights || [4, 2, 7, 6, 9, 14, 12];
      const bricks = Number(testCase.bricks || 5);
      const ladders = Number(testCase.ladders || 1);
      return simulateFurthestBuilding(heights, bricks, ladders);
    }
    default:
      return simulateInsert([90, 75, 80], 85, 'max');
  }
}

export default function App() {
  const [currentProblem, setCurrentProblem] = useState<ProblemDefinition>(HEAP_PROBLEMS[0]);
  const [heapType, setHeapType] = useState<HeapType>(HEAP_PROBLEMS[0].defaultHeapType);
  const [testCase, setTestCase] = useState<Record<string, any>>(HEAP_PROBLEMS[0].defaultTestCase);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Generate steps whenever problem, testCase, or heapType changes
  const steps = useMemo(() => {
    return generateSimulationSteps(currentProblem, testCase, heapType);
  }, [currentProblem, testCase, heapType]);

  // Current active step snapshot
  const activeStep: SimulationStep = useMemo(() => {
    if (steps.length === 0) {
      return {
        stepNumber: 0,
        description: 'No steps generated.',
        cppLineNumber: 1,
        heap: [],
        heapType,
        nodeStates: {},
        comparingIndices: [],
        swappingIndices: [],
        satisfiedIndices: [],
        inspectorState: { type: 'heapify' },
        callStack: []
      };
    }
    const safeIndex = Math.min(Math.max(0, currentStepIndex), steps.length - 1);
    return steps[safeIndex];
  }, [steps, currentStepIndex, heapType]);

  // Handle Playback Interval
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = Math.round(1100 / speed);
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, speed, steps.length]);

  // Action handlers
  const handleSelectProblem = useCallback((problem: ProblemDefinition) => {
    setIsPlaying(false);
    setCurrentProblem(problem);
    setHeapType(problem.defaultHeapType);
    setTestCase(problem.defaultTestCase);
    setCurrentStepIndex(0);
    setHoveredIndex(null);
  }, []);

  const handleToggleHeapType = useCallback(() => {
    setHeapType((prev) => (prev === 'max' ? 'min' : 'max'));
    setCurrentStepIndex(0);
  }, []);

  const handleUpdateParam = useCallback((key: string, value: any) => {
    setTestCase((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleResetCase = useCallback(() => {
    setIsPlaying(false);
    setTestCase(currentProblem.defaultTestCase);
    setCurrentStepIndex(0);
  }, [currentProblem]);

  const handleSimulate = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handleApplyPreset = useCallback((preset: 'balanced' | 'reversed' | 'nearlySorted' | 'random') => {
    setIsPlaying(false);
    let newArr: number[];
    if (preset === 'balanced') {
      newArr = [95, 80, 85, 60, 70, 50, 65];
    } else if (preset === 'reversed') {
      newArr = [15, 25, 35, 45, 55, 65, 75];
    } else if (preset === 'nearlySorted') {
      newArr = [90, 85, 70, 60, 55, 40, 30];
    } else {
      newArr = Array.from({ length: 7 }, () => Math.floor(Math.random() * 85) + 12);
    }

    if (currentProblem.id === 'p01_insert') {
      setTestCase({ initialHeap: newArr, insertVal: Math.floor(Math.random() * 80) + 15 });
    } else if (currentProblem.id === 'p02_extract') {
      setTestCase({ heap: newArr });
    } else if (currentProblem.id === 'p03_build_heap' || currentProblem.id === 'p04_heap_sort') {
      setTestCase({ arr: newArr });
    } else if (currentProblem.id === 'p05_kth_largest' || currentProblem.id === 'p06_top_k_frequent') {
      setTestCase((prev) => ({ ...prev, nums: newArr }));
    } else if (currentProblem.id === 'p09_median_stream') {
      setTestCase({ stream: newArr });
    } else if (currentProblem.id === 'p14_connect_sticks') {
      setTestCase({ sticks: newArr.slice(0, 5) });
    } else {
      setTestCase((prev) => ({ ...prev, nums: newArr }));
    }
    setCurrentStepIndex(0);
  }, [currentProblem.id]);

  const handleBuildHeapQuick = useCallback(() => {
    const buildProblem = HEAP_PROBLEMS.find((p) => p.id === 'p03_build_heap');
    if (buildProblem) {
      handleSelectProblem(buildProblem);
    }
  }, [handleSelectProblem]);

  const handleClear = useCallback(() => {
    setIsPlaying(false);
    if (currentProblem.id === 'p01_insert') {
      setTestCase({ initialHeap: [], insertVal: 42 });
    } else if (currentProblem.id === 'p02_extract') {
      setTestCase({ heap: [] });
    } else if (currentProblem.id === 'p03_build_heap' || currentProblem.id === 'p04_heap_sort') {
      setTestCase({ arr: [] });
    }
    setCurrentStepIndex(0);
  }, [currentProblem.id]);

  const handlePlayPause = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentStepIndex, steps.length]);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
  }, [steps.length]);

  const handleStepBackward = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handleScrub = useCallback((step: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(step);
  }, []);

  // Prepare logs list
  const executionLogs = useMemo(() => {
    return steps.map((s, i) => s.logEntry || `Step ${i + 1}: ${s.description}`);
  }, [steps]);

  // C++ snippet for current problem
  const currentCppSnippet = CPP_SNIPPETS[currentProblem.id] || CPP_SNIPPETS.p01_insert;

  const isDualHeapView = !!activeStep.dualHeap?.isDual;

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#FAF9F6] text-slate-800 overflow-hidden font-sans">
      {/* 1. TOP STICKY HEADER */}
      <Header
        problems={HEAP_PROBLEMS}
        currentProblem={currentProblem}
        onSelectProblem={handleSelectProblem}
        heapType={heapType}
        onToggleHeapType={handleToggleHeapType}
        onApplyPreset={handleApplyPreset}
        onBuildHeapClick={handleBuildHeapQuick}
        onClear={handleClear}
      />

      {/* 2. TOP QUESTION & TEST CASE CARD */}
      <QuestionCard
        problem={currentProblem}
        testCase={testCase}
        onUpdateParam={handleUpdateParam}
        onResetCase={handleResetCase}
        onSimulate={handleSimulate}
        isSimulating={isPlaying}
      />

      {/* 3. SIDE-BY-SIDE SPLIT WORKSPACE (Fitted to Viewport) */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-2.5 p-2.5 overflow-hidden">
        {/* Left Column (7 cols): Dual Synchronized Canvas & Controls */}
        <section className="lg:col-span-7 flex flex-col gap-2 h-full min-h-0 overflow-hidden">
          {/* Main Visual Canvas Area */}
          <div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
            {isDualHeapView && activeStep.dualHeap ? (
              <div className="flex-1 min-h-0">
                <DualHeapCanvas
                  dualState={activeStep.dualHeap}
                  hoveredIndex={hoveredIndex}
                  onHoverIndex={setHoveredIndex}
                />
              </div>
            ) : (
              <div className="flex-1 min-h-0">
                <HeapTreeCanvas
                  heap={activeStep.heap}
                  heapLabels={activeStep.heapLabels}
                  nodeStates={activeStep.nodeStates}
                  comparingIndices={activeStep.comparingIndices}
                  swappingIndices={activeStep.swappingIndices}
                  satisfiedIndices={activeStep.satisfiedIndices}
                  heapType={activeStep.heapType}
                  hoveredIndex={hoveredIndex}
                  onHoverIndex={setHoveredIndex}
                  title={`${currentProblem.title} — Binary Tree View`}
                  badge={`${activeStep.heapType.toUpperCase()}-HEAP (N=${activeStep.heap.length})`}
                />
              </div>
            )}

            {/* Synchronized Underlying Array View */}
            <div className="shrink-0">
              <HeapArrayCanvas
                heap={activeStep.heap}
                heapLabels={activeStep.heapLabels}
                comparingIndices={activeStep.comparingIndices}
                swappingIndices={activeStep.swappingIndices}
                satisfiedIndices={activeStep.satisfiedIndices}
                extractedIndices={activeStep.extractedIndices}
                nodeStates={activeStep.nodeStates}
                hoveredIndex={hoveredIndex}
                onHoverIndex={setHoveredIndex}
                heapType={activeStep.heapType}
              />
            </div>
          </div>

          {/* Docked Playback Bar */}
          <div className="shrink-0">
            <SimulationControls
              currentStep={currentStepIndex}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onReset={handleReset}
              onScrub={handleScrub}
              speed={speed}
              onSpeedChange={setSpeed}
              description={activeStep.description}
            />
          </div>
        </section>

        {/* Right Column (5 cols): Live Output, C++ Trace & State Inspector */}
        <section className="lg:col-span-5 h-full min-h-0 overflow-hidden flex flex-col gap-2">
          {/* Live Algorithm Output Box (Moved to side column so tree visualization has 100% full height) */}
          <div className="shrink-0">
            <OutputBox
              resultOutput={activeStep.resultOutput}
              activeStep={activeStep}
              problem={currentProblem}
              totalSteps={steps.length}
              collapsible={true}
              defaultCollapsed={false}
            />
          </div>

          <div className="flex-1 min-h-0">
            <TraceAndStatePanel
              cppSnippet={currentCppSnippet}
              activeLineNumber={activeStep.cppLineNumber}
              inspectorState={activeStep.inspectorState}
              callStack={activeStep.callStack}
              executionLogs={executionLogs}
              currentStep={currentStepIndex}
              activeStep={activeStep}
              problem={currentProblem}
              totalSteps={steps.length}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
