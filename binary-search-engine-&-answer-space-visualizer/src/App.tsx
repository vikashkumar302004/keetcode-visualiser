/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import QuestionCard from './components/QuestionCard';
import BinarySearchCanvas from './components/BinarySearchCanvas';
import FeasibilityCanvas from './components/FeasibilityCanvas';
import Matrix2DCanvas from './components/Matrix2DCanvas';
import TraceAndStatePanel from './components/TraceAndStatePanel';
import SimulationControls from './components/SimulationControls';
import { PROBLEMS } from './data/binarySearchProblems';
import { generateSteps } from './algorithms/binarySearchAlgorithms';
import { Problem, SimulationStep } from './types';

export default function App() {
  const [currentProblem, setCurrentProblem] = useState<Problem>(PROBLEMS[0]);
  const [isQuestionHidden, setIsQuestionHidden] = useState(false);
  const [isTraceHidden, setIsTraceHidden] = useState(false);
  
  // Input states
  const [arrayInput, setArrayInput] = useState('');
  const [targetInput, setTargetInput] = useState(0);
  const [extraParams, setExtraParams] = useState<Record<string, number>>({});

  // Simulation playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speed, setSpeed] = useState(1); // 0.5x, 1x, 2x
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [parsedArray, setParsedArray] = useState<any>([]);

  // Timer Ref for play interval
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize a problem's default inputs
  const initProblem = (prob: Problem) => {
    setCurrentProblem(prob);
    setIsPlaying(false);
    setCurrentStepIndex(0);

    const is2D = prob.category === '2D Matrix Search';
    let arrStr = '';
    if (is2D) {
      arrStr = JSON.stringify(prob.defaultArray);
    } else {
      arrStr = (prob.defaultArray as number[]).join(', ');
    }

    setArrayInput(arrStr);
    setTargetInput(prob.defaultTarget);

    const extras: Record<string, number> = {};
    if (prob.extraParams) {
      Object.entries(prob.extraParams).forEach(([k, config]) => {
        extras[k] = config.defaultValue;
      });
    }
    setExtraParams(extras);

    // Parse & generate steps
    const parsed = parseArray(arrStr, is2D);
    setParsedArray(parsed);

    const simSteps = generateSteps(prob.id, parsed, prob.defaultTarget, extras);
    setSteps(simSteps);
  };

  // Helper to parse inputs
  const parseArray = (str: string, is2D: boolean): any => {
    if (is2D) {
      try {
        const parsed = JSON.parse(str);
        if (Array.isArray(parsed) && parsed.every(row => Array.isArray(row))) {
          return parsed;
        }
      } catch (e) {
        // Fallback to default
      }
      return currentProblem.defaultArray;
    } else {
      return str
        .split(',')
        .map(item => parseInt(item.trim()))
        .filter(val => !isNaN(val));
    }
  };

  // Load first problem on mount
  useEffect(() => {
    initProblem(PROBLEMS[0]);
  }, []);

  // Recalculate simulation when inputs change
  const applyInputs = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    
    const is2D = currentProblem.category === '2D Matrix Search';
    const parsed = parseArray(arrayInput, is2D);
    setParsedArray(parsed);

    const simSteps = generateSteps(currentProblem.id, parsed, targetInput, extraParams);
    setSteps(simSteps);
  };

  // Reset to default problem settings
  const handleResetToDefault = () => {
    initProblem(currentProblem);
  };

  // Autoplay control loop
  useEffect(() => {
    if (isPlaying) {
      const intervalDuration = 1000 / speed;
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, intervalDuration);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, speed, steps.length]);

  // Keyboard shortcut listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting shortcuts when editing fields
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'SELECT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          setIsPlaying(prev => !prev);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setIsPlaying(false);
          setCurrentStepIndex(prev => Math.max(0, prev - 1));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setIsPlaying(false);
          setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1));
          break;
        case 'KeyR':
          e.preventDefault();
          setIsPlaying(false);
          setCurrentStepIndex(0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [steps.length]);

  const activeStep = steps[currentStepIndex] || {
    low: 0,
    high: 0,
    mid: null,
    discardedRanges: [],
    description: 'Loading simulation steps...',
    line: 1,
    found: false,
    foundIndex: null,
    ans: null,
    variables: {}
  };

  const handleSelectProblem = (id: string) => {
    const prob = PROBLEMS.find(p => p.id === id);
    if (prob) {
      initProblem(prob);
    }
  };

  return (
    <div className="h-screen max-h-screen flex flex-col overflow-hidden bg-[#FAF9F6] text-slate-900 antialiased">
      {/* Sticky Header Zone */}
      <Header
        currentProblem={currentProblem}
        onSelectProblem={handleSelectProblem}
        onReset={() => {
          setIsPlaying(false);
          setCurrentStepIndex(0);
        }}
        onSimulate={applyInputs}
        isTraceHidden={isTraceHidden}
        onToggleTrace={() => setIsTraceHidden(prev => !prev)}
      />

      {/* Main Workspace Frame (Designed for 1080p fit) */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 overflow-hidden">
        
        {/* Left Column (Question Card & Visual Sandbox Canvas) */}
        <section className={`${isTraceHidden ? 'lg:col-span-12' : 'lg:col-span-7'} flex flex-col gap-3 min-h-0 h-full overflow-hidden`}>
          <QuestionCard
            problem={currentProblem}
            arrayInput={arrayInput}
            setArrayInput={setArrayInput}
            targetInput={targetInput}
            setTargetInput={setTargetInput}
            extraParams={extraParams}
            setExtraParams={setExtraParams}
            onApplyInputs={applyInputs}
            onResetToDefault={handleResetToDefault}
            isQuestionHidden={isQuestionHidden}
            onToggleQuestion={() => setIsQuestionHidden(prev => !prev)}
          />

          {/* Render target visualizer canvas depending on category */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {currentProblem.category === '2D Matrix Search' ? (
              <Matrix2DCanvas
                problem={currentProblem}
                matrix={parsedArray}
                step={activeStep}
                target={targetInput}
              />
            ) : currentProblem.category === 'Binary Search on Answer' ? (
              <FeasibilityCanvas
                problem={currentProblem}
                step={activeStep}
                array={parsedArray}
              />
            ) : (
              <BinarySearchCanvas
                problem={currentProblem}
                array={parsedArray}
                step={activeStep}
                target={targetInput}
              />
            )}
          </div>

          {/* Sticky Playback controls */}
          <SimulationControls
            currentStepIndex={currentStepIndex}
            totalSteps={steps.length}
            isPlaying={isPlaying}
            speed={speed}
            onStepChange={setCurrentStepIndex}
            onTogglePlay={() => setIsPlaying(p => !p)}
            onStepForward={() => {
              setIsPlaying(false);
              setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1));
            }}
            onStepBackward={() => {
              setIsPlaying(false);
              setCurrentStepIndex(prev => Math.max(0, prev - 1));
            }}
            onReset={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            onSpeedChange={setSpeed}
            description={activeStep.description}
          />
        </section>

        {/* Right Column (Synchronized C++ Trace & Variable Inspector) */}
        {!isTraceHidden && (
          <section className="lg:col-span-5 h-full min-h-0 overflow-hidden">
            <TraceAndStatePanel
              problem={currentProblem}
              step={activeStep}
              steps={steps}
              currentStepIndex={currentStepIndex}
            />
          </section>
        )}

      </main>

      {/* Footer detailing shortcut guidelines */}
      <footer className="border-t border-slate-200 bg-white py-1.5 px-6 text-center text-[10px] text-slate-400 font-medium shrink-0">
        <span>Keyboard Shortcuts: </span>
        <kbd className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200 font-mono text-slate-600">Space</kbd> Play/Pause ·{' '}
        <kbd className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200 font-mono text-slate-600">←</kbd> Step Back ·{' '}
        <kbd className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200 font-mono text-slate-600">→</kbd> Step Forward ·{' '}
        <kbd className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200 font-mono text-slate-600">R</kbd> Reset
      </footer>
    </div>
  );
}
