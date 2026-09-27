import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import QuestionCard from './components/QuestionCard';
import SlidingPatternCanvas from './components/SlidingPatternCanvas';
import PlaybackBar from './components/PlaybackBar';
import StatePanel from './components/StatePanel';
import { STRING_PROBLEMS } from './data/stringProblems';
import { ProblemMetadata, SimulationStep } from './types';
import { generateSimulationSteps } from './algorithms/stringAlgorithms';
import { Library, AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  // 1. Core Problem & Input States
  const [currentProblem, setCurrentProblem] = useState<ProblemMetadata>(STRING_PROBLEMS[0]);
  const [customText, setCustomText] = useState<string>(STRING_PROBLEMS[0].defaultText);
  const [customPattern, setCustomPattern] = useState<string>(STRING_PROBLEMS[0].defaultPattern);
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);

  // 2. Playback Simulation States
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);

  // Regenerate steps whenever algorithm, inputs or toggles change
  useEffect(() => {
    const generated = generateSimulationSteps(
      currentProblem.id,
      customText,
      customPattern,
      caseSensitive
    );
    setSteps(generated);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [currentProblem, customText, customPattern, caseSensitive]);

  // 3. Playback Loop Timer
  useEffect(() => {
    let timerId: any = null;
    if (isPlaying) {
      const intervalMs = Math.max(100, 1000 / speed);
      timerId = setInterval(() => {
        setCurrentStepIndex((prevIndex) => {
          if (prevIndex < steps.length - 1) {
            return prevIndex + 1;
          } else {
            setIsPlaying(false);
            return prevIndex;
          }
        });
      }, intervalMs);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isPlaying, steps.length, speed]);

  // 4. Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts if the user is typing in input fields
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
      } else if (key === 'r') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [steps.length]);

  // Handle problem change
  const handleProblemChange = (problem: ProblemMetadata) => {
    setCurrentProblem(problem);
    setCustomText(problem.defaultText);
    setCustomPattern(problem.defaultPattern);
  };

  const handleSimulate = (text: string, pattern: string) => {
    setCustomText(text);
    setCustomPattern(pattern);
  };

  const handleResetToDefault = () => {
    setCustomText(currentProblem.defaultText);
    setCustomPattern(currentProblem.defaultPattern);
  };

  // Safe active step selector
  const activeStep: SimulationStep | undefined = steps[currentStepIndex];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#FAF9F6] text-slate-800">
      
      {/* 1. TOP STICKY HEADER */}
      <Header
        currentProblem={currentProblem}
        onProblemChange={handleProblemChange}
        caseSensitive={caseSensitive}
        onCaseSensitiveToggle={() => setCaseSensitive(!caseSensitive)}
      />

      {/* Main viewport frame */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        
        {/* 2. TOP QUESTION & TEST CASE INPUT CARD */}
        <QuestionCard
          problem={currentProblem}
          customText={customText}
          customPattern={customPattern}
          onSimulate={handleSimulate}
          onResetToDefault={handleResetToDefault}
        />

        {/* 3. SIDE-BY-SIDE SPLIT WORKSPACE */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-hidden">
          
          {/* Left Column (7 cols): Interactive String Canvas & Playback controls */}
          <div className="lg:col-span-7 flex flex-col gap-3.5 min-h-0 overflow-hidden">
            {/* Visualizer Canvas Card */}
            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex flex-col justify-center min-h-[180px] shadow-sm overflow-hidden">
              {activeStep ? (
                <SlidingPatternCanvas
                  step={activeStep}
                  algorithmId={currentProblem.id}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 text-slate-400 gap-2">
                  <AlertTriangle className="w-8 h-8 text-amber-500 animate-bounce" />
                  <p className="text-sm font-semibold">Ready to begin simulation</p>
                  <p className="text-xs">Click "Simulate" or select a preset to generate matching trace arrays.</p>
                </div>
              )}
            </div>

            {/* Playback Controls Card */}
            <PlaybackBar
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              speed={speed}
              description={activeStep?.description || "Press Simulate to start."}
              onStepChange={(idx) => {
                setIsPlaying(false);
                setCurrentStepIndex(idx);
              }}
              onPlayPauseToggle={() => setIsPlaying(!isPlaying)}
              onStepBackward={() => {
                setIsPlaying(false);
                setCurrentStepIndex((prev) => Math.max(0, prev - 1));
              }}
              onStepForward={() => {
                setIsPlaying(false);
                setCurrentStepIndex((prev) => Math.min(steps.length - 1, prev + 1));
              }}
              onSpeedChange={setSpeed}
              onReset={() => {
                setIsPlaying(false);
                setCurrentStepIndex(0);
              }}
            />
          </div>

          {/* Right Column (5 cols): Code Trace & Live State panel */}
          <div className="lg:col-span-5 flex flex-col min-h-0 overflow-hidden">
            {activeStep ? (
              <StatePanel
                step={activeStep}
                algorithmId={currentProblem.id}
                allSteps={steps}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 border border-slate-200 bg-white rounded-xl text-center gap-1.5 shadow-sm">
                <Library className="w-7 h-7 text-slate-300" />
                <p className="text-xs font-medium">Synced trace monitoring workspace will activate when simulation is computed.</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
