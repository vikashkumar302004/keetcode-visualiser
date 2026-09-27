/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SLIDING_WINDOW_PROBLEMS } from './data/slidingWindowProblems';
import { ProblemDefinition, TestCasePreset, SimulationStep, SimulationResult } from './types';
import { runSimulation, parseNumberArray, parseStringInput } from './algorithms/slidingWindowAlgorithms';
import { Header } from './components/Header';
import { QuestionCard } from './components/QuestionCard';
import { SlidingWindowCanvas } from './components/SlidingWindowCanvas';
import { AuxiliaryInspector } from './components/AuxiliaryInspector';
import { PlaybackBar } from './components/PlaybackBar';
import { TraceAndStatePanel } from './components/TraceAndStatePanel';
import { CustomInputModal } from './components/CustomInputModal';

export default function App() {
  // Problem Selection State
  const [currentProblem, setCurrentProblem] = useState<ProblemDefinition>(SLIDING_WINDOW_PROBLEMS[0]);
  const currentIndex = SLIDING_WINDOW_PROBLEMS.findIndex(p => p.id === currentProblem.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < SLIDING_WINDOW_PROBLEMS.length - 1;

  // Input Parameters State
  const defaultPreset = currentProblem.presets[0] || {
    name: 'Default',
    input: currentProblem.inputType === 'array' ? '2, 1, 5, 1, 3, 2' : 'ADOBECODEBANC',
    paramK: currentProblem.defaultK ?? 3,
    paramTarget: currentProblem.defaultTarget ?? '',
    description: ''
  };

  const [inputVal, setInputVal] = useState<string>(defaultPreset.input);
  const [paramK, setParamK] = useState<number>(defaultPreset.paramK ?? currentProblem.defaultK ?? 3);
  const [paramTarget, setParamTarget] = useState<string>(defaultPreset.paramTarget ?? currentProblem.defaultTarget ?? '');

  // Details expand state
  const [detailsExpanded, setDetailsExpanded] = useState<boolean>(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  // Simulation State
  const [simulationResult, setSimulationResult] = useState<SimulationResult>(() => 
    runSimulation(currentProblem.id, defaultPreset.input, defaultPreset.paramK ?? 3, defaultPreset.paramTarget ?? '')
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const playTimerRef = useRef<number | null>(null);

  // Synchronize when problem changes
  const handleSelectProblem = (problem: ProblemDefinition) => {
    setCurrentProblem(problem);
    const preset = problem.presets[0] || {
      name: 'Default',
      input: problem.inputType === 'array' ? '2, 1, 5, 1, 3, 2' : 'ADOBECODEBANC',
      paramK: problem.defaultK ?? 3,
      paramTarget: problem.defaultTarget ?? '',
      description: ''
    };
    setInputVal(preset.input);
    const newK = preset.paramK ?? problem.defaultK ?? 3;
    const newTarget = preset.paramTarget ?? problem.defaultTarget ?? '';
    setParamK(newK);
    setParamTarget(newTarget);

    const res = runSimulation(problem.id, preset.input, newK, newTarget);
    setSimulationResult(res);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handlePrevProblem = () => {
    if (hasPrev) {
      handleSelectProblem(SLIDING_WINDOW_PROBLEMS[currentIndex - 1]);
    }
  };

  const handleNextProblem = () => {
    if (hasNext) {
      handleSelectProblem(SLIDING_WINDOW_PROBLEMS[currentIndex + 1]);
    }
  };

  const handleSelectPreset = (preset: TestCasePreset) => {
    setInputVal(preset.input);
    const newK = preset.paramK ?? currentProblem.defaultK ?? 3;
    const newTarget = preset.paramTarget ?? currentProblem.defaultTarget ?? '';
    setParamK(newK);
    setParamTarget(newTarget);

    const res = runSimulation(currentProblem.id, preset.input, newK, newTarget);
    setSimulationResult(res);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleResetCase = () => {
    handleSelectPreset(defaultPreset);
  };

  const handleRunSimulation = useCallback(() => {
    const res = runSimulation(currentProblem.id, inputVal, paramK, paramTarget);
    setSimulationResult(res);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [currentProblem.id, inputVal, paramK, paramTarget]);

  // Stepping controls
  const handleStepForward = useCallback(() => {
    setCurrentStepIndex(prev => {
      if (prev < simulationResult.steps.length - 1) {
        return prev + 1;
      } else {
        setIsPlaying(false);
        return prev;
      }
    });
  }, [simulationResult.steps.length]);

  const handleStepBack = useCallback(() => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (currentStepIndex >= simulationResult.steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  }, [currentStepIndex, simulationResult.steps.length]);

  // Playback interval loop
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(150, 1000 / speed);
      playTimerRef.current = window.setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev < simulationResult.steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, intervalMs);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
      playTimerRef.current = null;
    }

    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying, speed, simulationResult.steps.length]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing into an input field or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
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
        handleStepBack();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePlayPause, handleStepForward, handleStepBack, handleReset]);

  // Elements to render on ribbon
  const rawElements: (string | number)[] = currentProblem.inputType === 'array'
    ? parseNumberArray(inputVal)
    : parseStringInput(inputVal).split('');

  const currentStep: SimulationStep | null = simulationResult.steps[currentStepIndex] || null;

  return (
    <div className="h-screen max-h-screen flex flex-col bg-[#FAF9F6] text-slate-900 overflow-hidden font-sans select-none">
      {/* Top Sticky Header */}
      <Header
        problems={SLIDING_WINDOW_PROBLEMS}
        currentProblem={currentProblem}
        onSelectProblem={handleSelectProblem}
        onPrevProblem={handlePrevProblem}
        onNextProblem={handleNextProblem}
        hasPrev={hasPrev}
        hasNext={hasNext}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        onReset={handleReset}
        detailsExpanded={detailsExpanded}
        onToggleDetails={() => setDetailsExpanded(prev => !prev)}
      />

      {/* Top Question & Test Case Card */}
      <QuestionCard
        problem={currentProblem}
        inputVal={inputVal}
        paramK={paramK}
        paramTarget={paramTarget}
        onInputChange={setInputVal}
        onParamKChange={setParamK}
        onParamTargetChange={setParamTarget}
        onSelectPreset={handleSelectPreset}
        onResetCase={handleResetCase}
        onRunSimulation={handleRunSimulation}
        detailsExpanded={detailsExpanded}
        onToggleDetails={() => setDetailsExpanded(prev => !prev)}
      />

      {/* Side-by-Side Split Workspace (Fitted to viewport) */}
      <main className="flex-1 min-h-0 px-4 py-3 grid grid-cols-12 gap-3 overflow-hidden">
        {/* Left Column (7 cols): Interactive Visual Workspace & Docked Controls */}
        <section className="col-span-12 lg:col-span-7 flex flex-col gap-3 h-full min-h-0 overflow-y-auto pr-0.5">
          {/* Elastic Sliding Window Canvas */}
          <SlidingWindowCanvas
            problem={currentProblem}
            rawElements={rawElements}
            step={currentStep}
          />

          {/* Adaptive Auxiliary Inspector */}
          <AuxiliaryInspector
            problem={currentProblem}
            step={currentStep}
          />

          {/* Docked Playback Bar */}
          <div className="mt-auto pt-1">
            <PlaybackBar
              currentStepIndex={currentStepIndex}
              totalSteps={simulationResult.steps.length}
              isPlaying={isPlaying}
              speed={speed}
              currentStep={currentStep}
              onPlayPause={handlePlayPause}
              onStepBack={handleStepBack}
              onStepForward={handleStepForward}
              onReset={handleReset}
              onSeek={(idx) => setCurrentStepIndex(idx)}
              onSpeedChange={setSpeed}
            />
          </div>
        </section>

        {/* Right Column (5 cols): Synchronized C++ Trace & State Inspector */}
        <section className="col-span-12 lg:col-span-5 h-full min-h-0 overflow-hidden">
          <TraceAndStatePanel
            problem={currentProblem}
            step={currentStep}
            allSteps={simulationResult.steps}
            currentStepIndex={currentStepIndex}
            onJumpToStep={(idx) => {
              setIsPlaying(false);
              setCurrentStepIndex(idx);
            }}
          />
        </section>
      </main>

      {/* Custom Input Modal */}
      <CustomInputModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        problem={currentProblem}
        currentInput={inputVal}
        currentK={paramK}
        currentTarget={paramTarget}
        onApply={(newInput, newK, newTarget) => {
          setInputVal(newInput);
          setParamK(newK);
          setParamTarget(newTarget);
          const res = runSimulation(currentProblem.id, newInput, newK, newTarget);
          setSimulationResult(res);
          setCurrentStepIndex(0);
          setIsPlaying(false);
        }}
      />
    </div>
  );
}
