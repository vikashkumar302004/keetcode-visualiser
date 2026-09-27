import React, { useState, useEffect, useMemo, useRef } from 'react';
import { pointerProblems } from './data/pointerProblems';
import { generateSimulationSteps } from './algorithms/pointerAlgorithms';
import { Problem, SimulationStep } from './types';

// Import components
import Header from './components/Header';
import QuestionCard from './components/QuestionCard';
import PointerArrayCanvas from './components/PointerArrayCanvas';
import WaterContainerCanvas from './components/WaterContainerCanvas';
import KadaneCanvas from './components/KadaneCanvas';
import TraceAndStatePanel from './components/TraceAndStatePanel';
import SimulationControls from './components/SimulationControls';

export default function App() {
  const [selectedProblem, setSelectedProblem] = useState<Problem>(pointerProblems[0]);
  const [currentArray, setCurrentArray] = useState<number[]>(pointerProblems[0].defaultArray);
  const [targetValue, setTargetValue] = useState<number>(pointerProblems[0].defaultTarget ?? 9);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // multipliers: 0.5, 1, 2

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-generate steps when problem, array, or target changes
  const steps = useMemo(() => {
    return generateSimulationSteps(selectedProblem.id, currentArray, targetValue);
  }, [selectedProblem, currentArray, targetValue]);

  // Safely get current simulation step
  const currentStep = useMemo(() => {
    if (steps.length === 0) return null;
    if (currentStepIndex >= steps.length) {
      return steps[steps.length - 1];
    }
    return steps[currentStepIndex];
  }, [steps, currentStepIndex]);

  // Automatically reset step index on problem, array, or target changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedProblem, currentArray, targetValue]);

  // Handle problem change
  const handleSelectProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setCurrentArray(problem.defaultArray);
    setTargetValue(problem.defaultTarget ?? 0);
  };

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      // delay map: 0.5x => 1200ms, 1x => 600ms, 2x => 300ms
      const delay = speed === 0.5 ? 1200 : speed === 1 ? 600 : 300;

      intervalRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, delay);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, speed, steps]);

  // Stepping controls
  const handleStepBack = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleTogglePlay = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleResetPlayback = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleResetToDefaultArray = () => {
    setIsPlaying(false);
    setCurrentArray(selectedProblem.defaultArray);
    setTargetValue(selectedProblem.defaultTarget ?? 0);
    setCurrentStepIndex(0);
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keypresses inside text input elements so users can write arrays
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' || activeEl.tagName === 'SELECT' || activeEl.tagName === 'TEXTAREA')
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handleTogglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleStepBack();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleStepForward();
          break;
        case 'KeyR':
          e.preventDefault();
          handleResetPlayback();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentStepIndex, steps, isPlaying]);

  const hasSpecialWaterCanvas = selectedProblem.id === 'container-with-most-water' || selectedProblem.id === 'trapping-rain-water';
  const hasKadaneCanvas = selectedProblem.category === 'kadane';

  return (
    <div className="bg-[#FAF9F6] text-slate-800 min-h-screen flex flex-col overflow-x-hidden font-sans select-none h-screen">
      {/* Top Sticky Header */}
      <Header
        problems={pointerProblems}
        selectedProblem={selectedProblem}
        onSelectProblem={handleSelectProblem}
        currentArray={currentArray}
        onUpdateArray={setCurrentArray}
        targetValue={targetValue}
        onUpdateTarget={setTargetValue}
        onReset={handleResetToDefaultArray}
      />

      {/* Main Single-Viewport Compact Workspace Layout */}
      <main className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4 min-h-0">
        {/* Top Question & Test Case Card */}
        <QuestionCard
          problem={selectedProblem}
          currentArray={currentArray}
          targetValue={targetValue}
          onSimulate={() => {
            handleResetPlayback();
            setIsPlaying(true);
          }}
          onReset={handleResetToDefaultArray}
        />

        {/* Side-by-Side Viewport Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0 items-start">
          {/* Left Column (Interactive Canvas & Playback controls) - 7 cols */}
          <div className="lg:col-span-7 flex flex-col gap-4 min-h-0">
            {currentStep && (
              <PointerArrayCanvas
                step={currentStep}
                problemId={selectedProblem.id}
              />
            )}

            {/* Dynamic context canvas: Trapping Water vs Kadane */}
            {currentStep && hasSpecialWaterCanvas && (
              <WaterContainerCanvas
                step={currentStep}
                problemId={selectedProblem.id}
              />
            )}

            {currentStep && hasKadaneCanvas && (
              <KadaneCanvas
                step={currentStep}
                allSteps={steps}
                currentStepIndex={currentStepIndex}
                problemId={selectedProblem.id}
              />
            )}

            {/* Playback Controls and real-time banner */}
            <SimulationControls
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              speed={speed}
              onStepIndexChange={setCurrentStepIndex}
              onTogglePlay={handleTogglePlay}
              onStepBack={handleStepBack}
              onStepForward={handleStepForward}
              onReset={handleResetPlayback}
              onSpeedChange={setSpeed}
              descriptionText={currentStep?.description ?? ''}
            />
          </div>

          {/* Right Column (Synchronized C++ Trace & Inspector) - 5 cols */}
          <div className="lg:col-span-5 min-h-0">
            {currentStep && (
              <TraceAndStatePanel
                problem={selectedProblem}
                step={currentStep}
                allSteps={steps}
                currentStepIndex={currentStepIndex}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
