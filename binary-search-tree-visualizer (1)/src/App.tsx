import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AlgorithmId,
  BSTNode,
  SimulationStep,
} from './types';
import {
  buildBSTFromValues,
  TREE_PRESETS,
  getTreeHeight,
  countNodes,
  inorderValues,
  cloneTree,
} from './utils/treeUtils';
import { runAlgorithm, ALGORITHM_METADATA } from './algorithms';
import { Header } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { TreeCanvas } from './components/TreeCanvas';
import { TraceAndStatePanel } from './components/TraceAndStatePanel';
import { SimulationControls } from './components/SimulationControls';
import { BST_PROBLEMS_SEQUENCE, BST_PROBLEMS_MAP, BSTProblem } from './data/bstProblems';

export default function App() {
  // Tree state initialized with balanced preset
  const [tree, setTree] = useState<BSTNode | null>(() =>
    buildBSTFromValues(TREE_PRESETS[0].values)
  );

  // Active problem from the ordered sequence (default: Search in BST - Problem #1)
  const [activeAlgorithmId, setActiveAlgorithmId] = useState<AlgorithmId>('search');

  // Dynamic parameters for the current algorithm
  const [currentParams, setCurrentParams] = useState<Record<string, any>>({
    value: 37,
    k: 3,
    kthMode: 'smallest',
    low: 25,
    high: 65,
    pVal: 12,
    qVal: 37,
    sortedArrayStr: '12, 25, 37, 50, 62, 75, 87',
    preorderStr: '50, 25, 12, 37, 75, 62, 87',
  });

  // Simulation State
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [traceLogs, setTraceLogs] = useState<string[]>([]);

  // Timer ref for play/pause interval
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const activeProblem: BSTProblem =
    BST_PROBLEMS_MAP[activeAlgorithmId] || BST_PROBLEMS_SEQUENCE[0];

  // Helper to parse arrays from string inputs
  const parseParams = useCallback((params: Record<string, any>) => {
    const parsed = { ...params };
    if (typeof parsed.sortedArrayStr === 'string') {
      parsed.sortedArray = parsed.sortedArrayStr
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n));
    }
    if (typeof parsed.preorderStr === 'string') {
      parsed.preorderArray = parsed.preorderStr
        .split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n));
    }
    return parsed;
  }, []);

  // Central simulation trigger
  const startSimulation = useCallback(
    (algId: AlgorithmId, currentTree: BSTNode | null, rawParams: Record<string, any> = {}) => {
      setIsPlaying(false);
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);

      const parsedParams = parseParams(rawParams);
      const generatedSteps = runAlgorithm(algId, currentTree, parsedParams);
      setSteps(generatedSteps);
      setCurrentStepIndex(0);

      // Extract logs
      const logs = generatedSteps.map((s) => s.log).filter(Boolean);
      setTraceLogs(logs);

      // Auto start playback if more than 1 step
      if (generatedSteps.length > 1) {
        setIsPlaying(true);
      }
    },
    [parseParams]
  );

  // When active problem is selected from the Sequence Dropdown
  const handleSelectProblem = (id: AlgorithmId) => {
    setActiveAlgorithmId(id);
    const prob = BST_PROBLEMS_MAP[id];
    if (prob) {
      const mergedParams = {
        ...currentParams,
        ...prob.testCase.defaultParams,
      };
      setCurrentParams(mergedParams);

      // If problem suggests a tree and current tree is empty or altered, set it
      if (prob.testCase.defaultTreeValues && (!tree || ['sorted_array_to_bst', 'bst_from_preorder'].includes(activeAlgorithmId))) {
        const newTree = buildBSTFromValues(prob.testCase.defaultTreeValues);
        setTree(newTree);
        startSimulation(id, newTree, mergedParams);
        return;
      }

      startSimulation(id, tree, mergedParams);
    }
  };

  // Reset tree and parameters to the problem's sample test case
  const handleLoadTestCase = () => {
    const prob = activeProblem;
    const testCaseValues = prob.testCase.defaultTreeValues || TREE_PRESETS[0].values;
    const newTree = buildBSTFromValues(testCaseValues);
    setTree(newTree);

    const mergedParams = {
      ...currentParams,
      ...prob.testCase.defaultParams,
    };
    setCurrentParams(mergedParams);
    startSimulation(prob.id, newTree, mergedParams);
  };

  // Run on execute from question card
  const handleExecuteAlgorithm = (params: Record<string, any>) => {
    startSimulation(activeAlgorithmId, tree, params);
  };

  // Initialize simulation on mount
  useEffect(() => {
    startSimulation('search', tree, { value: 37 });
  }, []);

  // Preset Tree Loader
  const handleSelectPreset = (presetId: string) => {
    const preset = TREE_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const newTree = buildBSTFromValues(preset.values);
      setTree(newTree);
      startSimulation(activeAlgorithmId, newTree, currentParams);
    }
  };

  // Random Tree Generator
  const handleRandomTree = () => {
    const size = Math.floor(Math.random() * 3) + 7; // 7 to 9 nodes
    const valuesSet = new Set<number>();
    while (valuesSet.size < size) {
      valuesSet.add(Math.floor(Math.random() * 88) + 11);
    }
    const newTree = buildBSTFromValues(Array.from(valuesSet));
    setTree(newTree);
    startSimulation(activeAlgorithmId, newTree, currentParams);
  };

  // Reset Tree
  const handleClearTree = () => {
    const newTree = buildBSTFromValues(TREE_PRESETS[0].values);
    setTree(newTree);
    startSimulation(activeAlgorithmId, newTree, currentParams);
  };

  // Playback timer handling
  useEffect(() => {
    if (isPlaying) {
      const delay = Math.max(250, 1350 / speed);
      playIntervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            if (playIntervalRef.current) clearInterval(playIntervalRef.current);
            return prev;
          }
        });
      }, delay);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }

    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  // Sync tree upon simulation completion if mutating
  useEffect(() => {
    if (steps.length > 0 && currentStepIndex === steps.length - 1) {
      const finalSnapshot = steps[steps.length - 1].treeSnapshot;
      if (
        finalSnapshot !== undefined &&
        ['insert', 'delete', 'prune', 'sorted_array_to_bst', 'bst_from_preorder', 'binary_tree_to_bst', 'greater_sum_tree', 'recover_bst'].includes(
          activeAlgorithmId
        )
      ) {
        setTree(cloneTree(finalSnapshot));
      }
    }
  }, [currentStepIndex, steps, activeAlgorithmId]);

  // Playback controls
  const handlePlayPause = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleSeek = (index: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(index);
  };

  // Keyboard Shortcuts (Space, ArrowLeft, ArrowRight, R)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepBackward();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentStepIndex, steps.length]);

  // Active step state
  const activeStep = steps[currentStepIndex] || null;
  const currentDisplayTree = activeStep?.treeSnapshot !== undefined ? activeStep.treeSnapshot : tree;
  const highlightedNodes = activeStep?.highlightedNodeIds || {};
  const highlightedEdges = activeStep?.highlightedEdgeKeys || {};
  const activeCodeLine = activeStep?.activeCodeLine || 1;
  const callStack = activeStep?.callStack || [];
  const currentAlgorithmMeta = ALGORITHM_METADATA[activeAlgorithmId];

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col selection:bg-amber-100 selection:text-amber-900 font-sans">
      {/* 1. Header with App Title, PROMINENT PROBLEM SEQUENCE DROPDOWN & Tree Tools */}
      <Header
        currentAlgorithmId={activeAlgorithmId}
        onSelectProblem={handleSelectProblem}
        nodeCount={countNodes(currentDisplayTree)}
        treeHeight={getTreeHeight(currentDisplayTree)}
        onSelectPreset={handleSelectPreset}
        onRandomTree={handleRandomTree}
        onClearTree={handleClearTree}
      />

      {/* 2. Main Container: Compact, viewport-fitted layout so user doesn't have to scroll */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2.5 sm:p-4 space-y-3">
        {/* A. QUESTION & SAMPLE TEST CASE CARD AT THE TOP */}
        <QuestionCard
          problem={activeProblem}
          onExecute={handleExecuteAlgorithm}
          onLoadTestCase={handleLoadTestCase}
          currentParams={currentParams}
          onParamChange={setCurrentParams}
        />

        {/* B. SIDE-BY-SIDE VISUALIZER WORKSPACE (Fitted to viewport, no vertical overflow) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
          {/* Left Column (7 cols): Tree Canvas & Docked Playback Bar */}
          <div className="lg:col-span-7 flex flex-col space-y-2">
            <TreeCanvas
              tree={currentDisplayTree}
              highlightedNodes={highlightedNodes}
              highlightedEdges={highlightedEdges}
              activeNodeId={activeStep?.activeNodeId}
              arrayVisualizer={activeStep?.arrayVisualizer}
            />

            <SimulationControls
              currentStep={currentStepIndex}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              speed={speed}
              description={activeStep?.description || ''}
              onPlayPause={handlePlayPause}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onReset={handleReset}
              onSeek={handleSeek}
              onSpeedChange={setSpeed}
            />
          </div>

          {/* Right Column (5 cols): Synchronized C++ Trace & State Panel */}
          <div className="lg:col-span-5 flex flex-col">
            <TraceAndStatePanel
              cppCode={currentAlgorithmMeta.cppCode}
              activeLine={activeCodeLine}
              algorithmTitle={currentAlgorithmMeta.title}
              activeLineDesc={activeStep?.description}
              callStack={callStack}
              logs={traceLogs}
              bounds={activeStep?.bounds}
              inorderSuccessorTrace={activeStep?.inorderSuccessorTrace}
              rangeSumState={activeStep?.rangeSumState}
              kthState={activeStep?.kthState}
              lcaState={activeStep?.lcaState}
              twoSumState={activeStep?.twoSumState}
              greaterSumState={activeStep?.greaterSumState}
              recoverBSTState={activeStep?.recoverBSTState}
              closestValueState={activeStep?.closestValueState}
            />
          </div>
        </div>
      </main>

      {/* 3. Sleek, Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-2 px-4 text-center text-xs text-slate-500 font-sans mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <p className="text-[11px] text-slate-600">
            BST Algorithms Visualizer &bull; Step-by-Step C++ Tracing
          </p>
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span>Space: Play/Pause</span>
            <span>&bull;</span>
            <span>&larr; / &rarr;: Step</span>
            <span>&bull;</span>
            <span>R: Reset</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
