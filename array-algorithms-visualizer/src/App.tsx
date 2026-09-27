/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ProblemDetailsCard from './components/ProblemDetailsCard';
import ArrayCanvas from './components/ArrayCanvas';
import AuxiliaryVisualizers from './components/AuxiliaryVisualizers';
import PlaybackControls from './components/PlaybackControls';
import TraceAndStatePanel from './components/TraceAndStatePanel';
import { arrayProblems } from './data/arrayProblems';
import { generateSteps } from './algorithms/arrayAlgorithms';
import { AlgorithmId, SimulationStep } from './types';

export default function App() {
  const [currentProblemId, setCurrentProblemId] = useState<AlgorithmId>('reverse-array');
  const [customInput, setCustomInput] = useState<string>('');
  const [kValue, setKValue] = useState<number>(3);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  // Active steps snapshot collection
  const [steps, setSteps] = useState<SimulationStep[]>([]);

  // Find active problem metadata
  const currentProblem = arrayProblems.find((p) => p.id === currentProblemId) || arrayProblems[0];

  // Helper to construct custom preset arrays per algorithm
  const generatePresetArray = (id: AlgorithmId, type: 'sorted' | 'reverse' | 'duplicates' | 'random'): number[] => {
    switch (id) {
      case 'sort-colors': {
        if (type === 'sorted') return [0, 0, 1, 1, 2, 2];
        if (type === 'reverse') return [2, 2, 1, 1, 0, 0];
        if (type === 'duplicates') return [1, 0, 2, 1, 0, 2];
        return Array.from({ length: 6 }, () => Math.floor(Math.random() * 3));
      }
      case 'plus-one': {
        if (type === 'sorted') return [1, 2, 3];
        if (type === 'reverse') return [3, 2, 1];
        if (type === 'duplicates') return [9, 9, 9];
        return Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));
      }
      case 'boyer-moore': {
        if (type === 'sorted') return [1, 1, 1, 2, 2];
        if (type === 'reverse') return [2, 2, 1, 1, 2];
        if (type === 'duplicates') return [3, 3, 3, 1, 3];
        return [2, 2, 1, 1, 1, 2, 2];
      }
      case 'boyer-moore-ii': {
        return [1, 1, 1, 3, 3, 2, 2, 2];
      }
      case 'missing-number': {
        if (type === 'sorted') return [0, 1, 2, 4];
        if (type === 'reverse') return [4, 2, 1, 0];
        if (type === 'duplicates') return [3, 0, 1];
        return [3, 0, 1];
      }
      case 'disappeared-numbers': {
        return [4, 3, 2, 7, 8, 2, 3, 1];
      }
      case 'set-matrix-zeroes': {
        return [1, 1, 1, 1, 0, 1, 1, 1, 1];
      }
      case 'rotate-image': {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9];
      }
      case 'spiral-matrix': {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9];
      }
      case 'merge-sorted': {
        return [1, 3, 5, 0, 0, 0];
      }
      default: {
        if (type === 'sorted') return [1, 2, 3, 4, 5, 6];
        if (type === 'reverse') return [6, 5, 4, 3, 2, 1];
        if (type === 'duplicates') return [1, 2, 2, 3, 3, 4];
        return Array.from({ length: 6 }, () => Math.floor(Math.random() * 20) + 1);
      }
    }
  };

  // Reinitialize steps when problem, custom inputs, or parameters change
  const handleInitialize = (id: AlgorithmId, initialArray: number[]) => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setCustomInput(`[${initialArray.join(',')}]`);

    // Prepare algorithm-specific parameters
    const params: Record<string, any> = {};
    if (id === 'rotate-array') {
      params.k = kValue;
    } else if (id === 'merge-sorted') {
      params.m = 3;
      params.nums2 = [2, 4, 6];
      params.n = 3;
    } else if (id === 'set-matrix-zeroes' || id === 'rotate-image' || id === 'spiral-matrix') {
      params.rows = 3;
      params.cols = 3;
    }

    const generated = generateSteps(id, initialArray, params);
    setSteps(generated);
  };

  // Trigger initialization on problem swap
  useEffect(() => {
    handleInitialize(currentProblemId, currentProblem.defaultArray);
  }, [currentProblemId]);

  // Handler for applying custom arrays manually
  const handleApplyCustomInput = () => {
    try {
      // Clean brackets and spaces
      const cleaned = customInput.trim().replace(/^\[|\]$/g, '');
      if (!cleaned) return;
      const parsedArray = cleaned.split(',').map((x) => parseInt(x.trim(), 10));
      
      if (parsedArray.some(isNaN)) {
        alert('Invalid array format. Please use comma-separated integers like [1, 2, 3]');
        return;
      }
      handleInitialize(currentProblemId, parsedArray);
    } catch (e) {
      alert('Error parsing custom input. Ensure integers are comma-separated.');
    }
  };

  // Handler for preset selections
  const handlePresetChange = (type: 'sorted' | 'reverse' | 'duplicates' | 'random') => {
    const preset = generatePresetArray(currentProblemId, type);
    handleInitialize(currentProblemId, preset);
  };

  // Handler for K-rotations change
  const handleKValueChange = (newK: number) => {
    setKValue(newK);
    // Find active array
    const activeArr = steps[currentStepIndex]?.array || currentProblem.defaultArray;
    // Re-simulate with new k
    setIsPlaying(false);
    setCurrentStepIndex(0);
    const generated = generateSteps(currentProblemId, activeArr, { k: newK });
    setSteps(generated);
  };

  // Playback timer ticker
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / speed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, steps.length, speed]);

  // Handle manual steps
  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleResetSimulation = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  // Keyboard Navigation Hook
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid shortcuts if typing in any text or input boxes
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === 'INPUT' || activeElement.tagName === 'SELECT' || activeElement.tagName === 'TEXTAREA')
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepBackward();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepForward();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleResetSimulation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [steps.length, currentStepIndex]);

  const activeStep = steps[currentStepIndex] || {
    array: currentProblem.defaultArray,
    pointers: {},
    line: 1,
    description: 'Initializing algorithm simulation...',
    variables: {},
    logs: [],
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans flex flex-col selection:bg-amber-100 selection:text-amber-900">
      {/* Sticky top bar contract */}
      <Header
        currentProblemId={currentProblemId}
        onProblemChange={setCurrentProblemId}
        onPresetChange={handlePresetChange}
        customInput={customInput}
        onCustomInputChange={setCustomInput}
        onApplyCustomInput={handleApplyCustomInput}
        kValue={kValue}
        onKValueChange={handleKValueChange}
        onReset={handleResetSimulation}
      />

      {/* Main viewport-bound content layout */}
      <main className="flex-1 px-6 py-4 max-w-7xl mx-auto w-full flex flex-col gap-4 overflow-hidden">
        {/* Dynamic description and test cases header row */}
        <ProblemDetailsCard
          currentProblemId={currentProblemId}
          inputArray={steps[0]?.array || currentProblem.defaultArray}
          finalArray={steps[steps.length - 1]?.array || currentProblem.defaultArray}
          params={{ k: kValue }}
        />

        {/* Side-by-side workspace split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Left Visual Interactive Canvas (7 Columns) */}
          <section className="lg:col-span-7 flex flex-col gap-4 justify-between">
            {/* Main Interactive Array Cells Container */}
            <ArrayCanvas step={activeStep} />

            {/* Dynamic visual metric scales / secondary arrays */}
            <AuxiliaryVisualizers algorithmId={currentProblemId} step={activeStep} />

            {/* Simulation Playback controls footer bar */}
            <PlaybackControls
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onScrub={setCurrentStepIndex}
              onReset={handleResetSimulation}
              speed={speed}
              onSpeedChange={setSpeed}
              description={activeStep.description}
            />
          </section>

          {/* Right C++ Trace & State Inspector (5 Columns) */}
          <section className="lg:col-span-5 flex flex-col">
            <TraceAndStatePanel
              algorithmId={currentProblemId}
              step={activeStep}
              cppCode={currentProblem.cppCode}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
