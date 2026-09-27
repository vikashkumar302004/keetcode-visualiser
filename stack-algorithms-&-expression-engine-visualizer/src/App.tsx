import React from 'react';
import { Header } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { StackChamberCanvas } from './components/StackChamberCanvas';
import { ExpressionCanvas } from './components/ExpressionCanvas';
import { HistogramCanvas } from './components/HistogramCanvas';
import { TraceAndStatePanel } from './components/TraceAndStatePanel';
import { PlaybackControls } from './components/PlaybackControls';

import { STACK_PROBLEMS } from './data/stackProblems';
import { generateSimulationSteps } from './algorithms/stackAlgorithms';
import { Problem, ProblemId, SimulationStep, StackItem } from './types';

export default function App() {
  const [currentProblem, setCurrentProblem] = React.useState<Problem>(STACK_PROBLEMS[0]);
  const [inputValue, setInputValue] = React.useState<string>(STACK_PROBLEMS[0].defaultInput);
  const [steps, setSteps] = React.useState<SimulationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);
  const [speed, setSpeed] = React.useState<number>(1);

  // Manual Custom Sandbox Stack
  const [customStack, setCustomStack] = React.useState<StackItem[]>([]);
  const [customActive, setCustomActive] = React.useState<boolean>(false);

  // Generate Simulation steps upon simulation trigger or problem change
  const runSimulation = React.useCallback((problem: Problem, input: string) => {
    setCustomActive(false);
    const generatedSteps = generateSimulationSteps(problem.id, input);
    setSteps(generatedSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  // Initialize with default
  React.useEffect(() => {
    runSimulation(currentProblem, inputValue);
  }, [currentProblem.id]);

  const handleProblemSelect = (problemId: ProblemId) => {
    const selected = STACK_PROBLEMS.find((p) => p.id === problemId);
    if (selected) {
      setCurrentProblem(selected);
      setInputValue(selected.defaultInput);
      runSimulation(selected, selected.defaultInput);
    }
  };

  const handleResetTestCase = () => {
    setInputValue(currentProblem.defaultInput);
    runSimulation(currentProblem, currentProblem.defaultInput);
  };

  const handleSimulateTrigger = () => {
    runSimulation(currentProblem, inputValue);
  };

  // Playback loop
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && steps.length > 0) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1000 / speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, speed]);

  const handleStepForward = React.useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  }, [currentStepIndex, steps.length]);

  const handleStepBackward = React.useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  // Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Guard: Don't trigger shortcuts if user is typing in an input
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'SELECT') {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (steps.length > 1) {
            setIsPlaying((prev) => !prev);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleStepBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleStepForward();
          break;
        case 'KeyR':
          e.preventDefault();
          handleResetTestCase();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [steps.length, handleStepForward, handleStepBackward]);

  // Custom Push / Pop Sandbox Interactions
  const handleCustomPush = (val: string) => {
    setCustomActive(true);
    setCustomStack((prev) => [
      ...prev,
      { id: Math.random().toString(36).substring(2, 9), value: val }
    ]);
  };

  const handleCustomPop = () => {
    setCustomActive(true);
    setCustomStack((prev) => {
      const copy = [...prev];
      copy.pop();
      return copy;
    });
  };

  const handleCustomClear = () => {
    setCustomActive(true);
    setCustomStack([]);
  };

  // Extract active snapshot parameters
  const activeStep: SimulationStep = steps[currentStepIndex] || {
    stepIndex: 0,
    description: 'Idle',
    line: 1,
    stack: [],
    variables: {},
    logs: []
  };

  const activeStack = customActive ? customStack : activeStep.stack;
  const activeSecondaryStack = customActive ? undefined : activeStep.secondaryStack;
  const showHistogram = [
    'next-greater-element',
    'daily-temperatures',
    'online-stock-span',
    'largest-rectangle',
    'trapping-rain-water',
    'maximal-rectangle'
  ].includes(currentProblem.id);

  const showExpression = [
    'infix-to-postfix',
    'infix-to-prefix',
    'evaluate-postfix',
    'evaluate-prefix',
    'postfix-to-infix',
    'prefix-to-infix',
    'basic-calculator'
  ].includes(currentProblem.id);

  // Parse custom numeric representation for visual histogram preview
  const getHistogramData = () => {
    if (currentProblem.id === 'maximal-rectangle') {
      return activeStep.variables.heights || Array(5).fill(0);
    }
    if (currentProblem.id === 'remove-k-digits') {
      return [];
    }
    return inputValue
      .split(/[,,|\s]+/)
      .map(Number)
      .filter((n) => !isNaN(n));
  };

  const stackIndices = activeStack
    .map((item) => (typeof item.value === 'number' ? item.value : NaN))
    .filter((n) => !isNaN(n));

  return (
    <div className="h-screen max-h-screen flex flex-col bg-[#FAF9F6] text-slate-800 overflow-hidden font-sans select-none">
      {/* 1. Header Toolbar */}
      <Header
        currentProblem={currentProblem}
        onProblemSelect={handleProblemSelect}
        onCustomPush={handleCustomPush}
        onCustomPop={handleCustomPop}
        onCustomClear={handleCustomClear}
        customActive={customActive}
      />

      {/* 2. Question Detail & Testcase Ribbon */}
      <QuestionCard
        problem={currentProblem}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onReset={handleResetTestCase}
        onSimulate={handleSimulateTrigger}
      />

      {/* 3. Main Workspace Area (Side-by-Side Flex Split) */}
      <main className="flex-1 min-h-0 flex gap-4 p-4">
        {/* Left Hand: Stack visual work-decks */}
        <div className="flex-[7] flex flex-col gap-4 min-h-0">
          
          {/* Dual-Synchronized Visual Card */}
          <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4 flex gap-6 min-h-0 shadow-xs">
            {/* Left third: Always show Vertical Stack Chamber */}
            <div className="w-[30%] border-r border-slate-100 pr-4 h-full min-h-0">
              <StackChamberCanvas
                stack={activeStack}
                secondaryStack={activeSecondaryStack}
                secondaryTitle={
                  currentProblem.id === 'queue-using-stacks'
                    ? 'outStack (FIFO Pop)'
                    : 'Auxiliary Stack'
                }
              />
            </div>

            {/* Right two-thirds: Adaptive dynamic helper canvas */}
            <div className="w-[70%] h-full min-h-0">
              {showExpression && (
                <ExpressionCanvas
                  tokens={activeStep.inputTokens || []}
                  outputString={activeStep.outputString}
                  precedenceCompare={activeStep.precedenceCompare}
                  inputCursor={activeStep.inputCursor}
                />
              )}

              {showHistogram && (
                <HistogramCanvas
                  problemId={currentProblem.id}
                  data={getHistogramData()}
                  inputCursor={activeStep.inputCursor}
                  stackIndices={stackIndices}
                  histogramState={activeStep.histogramState}
                  waterState={activeStep.waterState}
                  variables={activeStep.variables}
                />
              )}

              {!showExpression && !showHistogram && (
                <div className="h-full flex flex-col justify-center items-center text-center p-6 text-slate-400 font-sans gap-2 select-none">
                  <div className="p-3 bg-amber-500/10 border border-amber-200 text-amber-800 rounded-xl mb-1">
                    🌟
                  </div>
                  <h3 className="font-serif text-sm font-bold text-slate-800">Foundation Stack sandbox</h3>
                  <p className="text-[11px] text-slate-500 max-w-sm">
                    This problem is a pure stack simulation. Watch elements enter and leave the left-hand chamber, or push custom values using the sandbox tool in the top header.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Playback controller deck */}
          <PlaybackControls
            currentStepIndex={currentStepIndex}
            totalSteps={steps.length}
            isPlaying={isPlaying}
            speed={speed}
            activeDescription={activeStep.description}
            onStepIndexChange={setCurrentStepIndex}
            onPlayPauseToggle={() => setIsPlaying(!isPlaying)}
            onStepForward={handleStepForward}
            onStepBackward={handleStepBackward}
            onReset={() => {
              setCurrentStepIndex(0);
              setIsPlaying(false);
            }}
            onSpeedChange={setSpeed}
          />
        </div>

        {/* Right Hand: Inspection logs and Code lines */}
        <div className="flex-[5] flex flex-col min-h-0">
          <TraceAndStatePanel
            problemId={currentProblem.id}
            activeStep={activeStep}
            variables={activeStep.variables}
            stack={activeStack}
            secondaryStack={activeSecondaryStack}
            logs={activeStep.logs}
          />
        </div>
      </main>
    </div>
  );
}
