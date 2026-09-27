import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AlgorithmType, GraphData } from './types';
import { PRESET_GRAPHS, ALGORITHM_METADATA_LIST } from './data/presetGraphs';
import { generateAlgorithmSteps } from './algorithms/engine';
import { Navbar } from './components/Navbar';
import { ProblemQuestionBar } from './components/ProblemQuestionBar';
import { GraphCanvas } from './components/GraphCanvas';
import { FloodFillGrid } from './components/FloodFillGrid';
import { RottenOrangesGrid } from './components/RottenOrangesGrid';
import { WordSearchGrid } from './components/WordSearchGrid';
import { CppConsole } from './components/CppConsole';
import { TraceStatePanel } from './components/TraceStatePanel';
import { PlaybackControls } from './components/PlaybackControls';
import { AlgorithmInfoModal } from './components/AlgorithmInfoModal';

export default function App() {
  // Algorithm selection
  const [currentAlgorithm, setCurrentAlgorithm] = useState<AlgorithmType>('bfs');

  // Preset graph state
  const defaultPreset = PRESET_GRAPHS[0];
  const [graph, setGraph] = useState<GraphData>(() => JSON.parse(JSON.stringify(defaultPreset.graph)));
  const [startNodeId, setStartNodeId] = useState<string>(defaultPreset.startNodeId || 'A');
  const [targetNodeId, setTargetNodeId] = useState<string>('F');

  // Interactive Tools: 'select' | 'add-node' | 'add-edge' | 'delete'
  const [activeTool, setActiveTool] = useState<'select' | 'add-node' | 'add-edge' | 'delete'>('select');

  // Flood fill dedicated grid state
  const [grid, setGrid] = useState<number[][]>([
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 2, 2, 2, 0],
    [0, 1, 1, 0, 2, 2, 2, 0],
    [0, 0, 0, 0, 2, 2, 0, 0],
    [0, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]);
  const [gridStartCell, setGridStartCell] = useState<[number, number]>([1, 4]);

  // Rotten Oranges dedicated grid state (0 = empty, 1 = fresh, 2 = rotten)
  const defaultRottenGrid: number[][] = [
    [2, 1, 1, 0, 1, 1, 1, 2],
    [1, 1, 0, 0, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 0, 1, 1],
    [1, 1, 1, 1, 0, 0, 1, 0],
    [1, 0, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 2, 1, 1, 0]
  ];
  const [rottenGrid, setRottenGrid] = useState<number[][]>(() =>
    defaultRottenGrid.map(row => [...row])
  );

  // Word Search state (LeetCode 79)
  const defaultWordSearchBoard: string[][] = [
    ['A', 'B', 'C', 'E'],
    ['S', 'F', 'C', 'S'],
    ['A', 'D', 'E', 'E']
  ];
  const [wordSearchBoard, setWordSearchBoard] = useState<string[][]>(() =>
    defaultWordSearchBoard.map(row => [...row])
  );
  const [wordSearchTarget, setWordSearchTarget] = useState<string>('ABCCED');

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);

  // Info modal state
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);

  // Current algorithm metadata
  const currentMetadata = useMemo(() => {
    return ALGORITHM_METADATA_LIST.find(a => a.id === currentAlgorithm) || ALGORITHM_METADATA_LIST[0];
  }, [currentAlgorithm]);

  // Calculate execution steps deterministically based on current graph and algorithm
  const steps = useMemo(() => {
    return generateAlgorithmSteps(
      currentAlgorithm,
      graph,
      startNodeId,
      targetNodeId,
      currentAlgorithm === 'flood-fill'
        ? { grid, startCell: gridStartCell, targetColor: grid[gridStartCell[0]]?.[gridStartCell[1]] ?? 2 }
        : currentAlgorithm === 'rotten-oranges'
        ? { grid: rottenGrid, startCell: [0, 0] }
        : undefined,
      currentAlgorithm === 'word-search'
        ? { board: wordSearchBoard, targetWord: wordSearchTarget }
        : undefined
    );
  }, [currentAlgorithm, graph, startNodeId, targetNodeId, grid, gridStartCell, rottenGrid, wordSearchBoard, wordSearchTarget]);

  // Current active execution step
  const currentStep = steps[currentStepIndex] || steps[0];

  // Playback timer ticker
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isPlaying) {
      const intervalMs = Math.max(80, Math.round(900 / speed));
      timer = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < steps.length - 1) {
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
  }, [isPlaying, speed, steps.length]);

  // Reset simulation whenever algorithm or preset changes
  const handleSelectAlgorithm = (algo: AlgorithmType) => {
    setCurrentAlgorithm(algo);
    setIsPlaying(false);
    setCurrentStepIndex(0);

    // Auto-load an appropriate preset graph for this algorithm
    const matchPreset = PRESET_GRAPHS.find(p => p.recommendedAlgorithm === algo);
    if (matchPreset) {
      setGraph(JSON.parse(JSON.stringify(matchPreset.graph)));
      if (matchPreset.startNodeId) setStartNodeId(matchPreset.startNodeId);
      if (algo === 'word-ladder') setTargetNodeId('cog');
    }
  };

  // Load a chosen preset graph
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESET_GRAPHS.find(p => p.id === presetId);
    if (preset) {
      setGraph(JSON.parse(JSON.stringify(preset.graph)));
      if (preset.startNodeId) setStartNodeId(preset.startNodeId);
      if (presetId === 'word-ladder-graph') setTargetNodeId('cog');
      if (preset.recommendedAlgorithm && preset.recommendedAlgorithm !== currentAlgorithm) {
        setCurrentAlgorithm(preset.recommendedAlgorithm);
      }
      setIsPlaying(false);
      setCurrentStepIndex(0);
    }
  };

  // Directed / Undirected graph toggle
  const handleToggleDirected = (directed: boolean) => {
    setGraph(prev => ({
      ...prev,
      isDirected: directed,
      edges: prev.edges.map(e => ({ ...e, directed }))
    }));
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Reset Graph to default layout
  const handleResetGraph = () => {
    const preset = PRESET_GRAPHS.find(p => p.recommendedAlgorithm === currentAlgorithm) || PRESET_GRAPHS[0];
    setGraph(JSON.parse(JSON.stringify(preset.graph)));
    if (preset.startNodeId) setStartNodeId(preset.startNodeId);
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Clear Canvas
  const handleClearGraph = () => {
    setGraph({ nodes: [], edges: [], isDirected: graph.isDirected });
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Playback Control Handlers
  const handleTogglePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentStepIndex(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleSeek = (index: number) => {
    setIsPlaying(false);
    setCurrentStepIndex(Math.max(0, Math.min(index, steps.length - 1)));
  };

  const handleLoadRottenScenario = (scenario: 'wave' | 'isolated' | 'dual') => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    if (scenario === 'wave') {
      setRottenGrid([
        [2, 1, 1, 0, 1, 1, 1, 2],
        [1, 1, 0, 0, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 0, 0, 1, 0],
        [1, 0, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 2, 1, 1, 0]
      ]);
    } else if (scenario === 'isolated') {
      setRottenGrid([
        [2, 1, 1, 0, 0, 0, 0, 0],
        [1, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 1, 1, 0]
      ]);
    } else {
      setRottenGrid([
        [2, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 0, 0, 1, 1, 1],
        [1, 1, 1, 0, 0, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 2]
      ]);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col bg-[#faf9f6] text-stone-900 font-sans lg:overflow-hidden">
      {/* Top Navigation & Tool Header */}
      <Navbar
        currentAlgorithm={currentAlgorithm}
        onSelectAlgorithm={handleSelectAlgorithm}
        onLoadPreset={handleLoadPreset}
        isDirected={graph.isDirected}
        onToggleDirected={handleToggleDirected}
        onResetGraph={handleResetGraph}
        onClearGraph={handleClearGraph}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
        activeTool={activeTool}
        onChangeTool={setActiveTool}
      />

      {/* Problem Question Bar: Displays Question Above Selected Topic */}
      <ProblemQuestionBar
        algorithmMeta={currentMetadata}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
      />

      {/* Main Visualizer Stage */}
      <main className="flex-1 min-h-0 max-w-7xl w-full mx-auto p-2 sm:p-3 lg:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch lg:overflow-hidden">
        {/* Left Column: Interactive Graph / Grid Visualizer & Playback (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-2 min-h-0 lg:h-full lg:overflow-hidden">
          {/* Canvas or Grid container */}
          <div className="flex-1 min-h-[360px] lg:min-h-0 relative">
            {currentAlgorithm === 'word-search' ? (
              <WordSearchGrid
                currentStep={currentStep}
                board={wordSearchBoard}
                targetWord={wordSearchTarget}
                onUpdateBoard={newBoard => {
                  setWordSearchBoard(newBoard);
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                onUpdateTargetWord={newWord => {
                  setWordSearchTarget(newWord);
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                onResetBoard={() => {
                  setWordSearchBoard(defaultWordSearchBoard.map(row => [...row]));
                  setWordSearchTarget('ABCCED');
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                onLoadPreset={preset => {
                  setWordSearchTarget(preset);
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
              />
            ) : currentAlgorithm === 'rotten-oranges' ? (
              <RottenOrangesGrid
                currentStep={currentStep}
                grid={rottenGrid}
                onUpdateGrid={newGrid => {
                  setRottenGrid(newGrid);
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                onResetGrid={() => {
                  setRottenGrid(defaultRottenGrid.map(row => [...row]));
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                onLoadPresetScenario={handleLoadRottenScenario}
              />
            ) : currentAlgorithm === 'flood-fill' ? (
              <FloodFillGrid
                currentStep={currentStep}
                grid={grid}
                onUpdateGrid={newGrid => {
                  setGrid(newGrid);
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                startCell={gridStartCell}
                onSetStartCell={cell => {
                  setGridStartCell(cell);
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                onResetGrid={() => {
                  setGrid([
                    [0, 0, 1, 0, 0, 0, 0, 0],
                    [0, 0, 1, 0, 2, 2, 2, 0],
                    [0, 1, 1, 0, 2, 2, 2, 0],
                    [0, 0, 0, 0, 2, 2, 0, 0],
                    [0, 1, 1, 1, 1, 0, 0, 0],
                    [0, 0, 0, 0, 0, 0, 0, 0]
                  ]);
                  setGridStartCell([1, 4]);
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
              />
            ) : (
              <GraphCanvas
                graph={graph}
                nodeStates={currentStep?.nodeStates || {}}
                edgeStates={currentStep?.edgeStates || {}}
                startNodeId={startNodeId}
                targetNodeId={targetNodeId}
                onSetStartNode={id => {
                  setStartNodeId(id);
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                onSetTargetNode={id => {
                  setTargetNodeId(id);
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                onUpdateGraph={newGraph => {
                  setGraph(newGraph);
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                activeTool={activeTool}
                activeNodeId={currentStep?.activeNodeId}
                activeEdgeId={currentStep?.activeEdgeId}
                requiresWeights={currentMetadata.requiresWeights}
              />
            )}
          </div>

          {/* Simulation Playback Controls Bar */}
          <div className="shrink-0">
            <PlaybackControls
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onReset={handleReset}
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length}
              onSeek={handleSeek}
              speed={speed}
              onChangeSpeed={setSpeed}
            />
          </div>
        </div>

        {/* Right Column: Synchronized C++ Console & Execution State (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-2 min-h-0 lg:h-full lg:overflow-hidden">
          {/* Top Half: C++ Synchronized Source Console */}
          <div className="h-[46%] min-h-0 shrink-0 overflow-hidden">
            <CppConsole
              algorithm={currentAlgorithm}
              currentStep={currentStep}
            />
          </div>

          {/* Bottom Half: Trace State Window & Adjacency Data */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <TraceStatePanel
              currentStep={currentStep}
              graph={graph}
            />
          </div>
        </div>
      </main>

      {/* Algorithm Specs & Invariants Modal */}
      <AlgorithmInfoModal
        metadata={currentMetadata}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}
