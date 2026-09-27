import React, { useState, useEffect, useRef } from 'react';
import { PROBLEMS } from './data/recursionProblems';
import { ProblemId, SimulationStep, ProblemMetadata } from './types';
import { generateSimulationSteps } from './algorithms/recursionAlgorithms';
import Header from './components/Header';
import QuestionCard from './components/QuestionCard';
import RecursionTreeCanvas from './components/RecursionTreeCanvas';
import StateWorkspace from './components/StateWorkspace';
import PlaybackControls from './components/PlaybackControls';
import TraceAndStatePanel from './components/TraceAndStatePanel';

export default function App() {
  // Current active problem
  const [selectedId, setSelectedId] = useState<ProblemId>('factorial');
  const selectedProblem = PROBLEMS.find((p) => p.id === selectedId) || PROBLEMS[0];

  // Dynamic parameters inputs
  const [inputs, setInputs] = useState<Record<string, any>>(selectedProblem.defaultInputs);

  // Simulation steps timeline
  const [simulationSteps, setSimulationSteps] = useState<SimulationStep[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1000); // 1.0x default tempo

  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initialize simulation when problem or inputs change
  useEffect(() => {
    const steps = generateSimulationSteps(selectedId, inputs);
    setSimulationSteps(steps);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [selectedId, inputs]);

  // 2. Playback logic timer trigger
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentStepIdx((prevIdx) => {
          if (prevIdx < simulationSteps.length - 1) {
            return prevIdx + 1;
          } else {
            setIsPlaying(false);
            if (playTimerRef.current) clearInterval(playTimerRef.current);
            return prevIdx;
          }
        });
      }, speed);
    } else {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    }

    return () => {
      if (playTimerRef.current) {
        clearInterval(playTimerRef.current);
      }
    };
  }, [isPlaying, simulationSteps.length, speed]);

  // 3. Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid shortcuts when typing in input boxes
      const tag = e.target && (e.target as HTMLElement).tagName.toLowerCase();
      if (tag === 'input' || tag === 'select' || tag === 'textarea') {
        return;
      }

      switch (e.key) {
        case ' ': // Space: Play / Pause
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case 'ArrowLeft': // Left Arrow: Step Backward
          e.preventDefault();
          setIsPlaying(false);
          setCurrentStepIdx((prev) => Math.max(0, prev - 1));
          break;
        case 'ArrowRight': // Right Arrow: Step Forward
          e.preventDefault();
          setIsPlaying(false);
          setCurrentStepIdx((prev) => Math.min(simulationSteps.length - 1, prev + 1));
          break;
        case 'r':
        case 'R': // R: Reset
          e.preventDefault();
          setIsPlaying(false);
          setCurrentStepIdx(0);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [simulationSteps.length]);

  const activeStep = simulationSteps[currentStepIdx] || null;

  const handleSelectProblem = (id: ProblemId) => {
    setSelectedId(id);
    const prob = PROBLEMS.find((p) => p.id === id) || PROBLEMS[0];
    setInputs(prob.defaultInputs);
  };

  const handleInputChange = (key: string, value: any) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6] text-slate-800 overflow-y-auto font-sans">
      
      {/* 1. Header Navigation & Control Bar */}
      <Header
        problems={PROBLEMS}
        selectedProblem={selectedProblem}
        onSelectProblem={handleSelectProblem}
        onReset={handleReset}
      />

      {/* 2. Compact Info Panel */}
      <QuestionCard
        selectedProblem={selectedProblem}
        inputs={inputs}
        onInputChange={handleInputChange}
      />

      {/* 3. Main Multi-column Side-by-Side Area */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-[580px]">
        
        {/* LEFT COMPONENT (7 cols out of 12) */}
        <section className="flex-[7] flex flex-col gap-3 min-h-[500px]">
          
          {/* Simulation Stage (Interactive Tree + Visual Board side by side) */}
          <div className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-3 min-h-[380px]">
            
            {/* Tree Canvas - occupies 7 cols in xl */}
            <div className="xl:col-span-7 h-full flex flex-col">
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold mb-1 ml-1 block">
                Recursion Execution Tree Topology
              </span>
              <div className="flex-1 min-h-0">
                <RecursionTreeCanvas
                  nodes={activeStep?.treeNodes ?? {}}
                  activeNodeId={activeStep?.activeNodeId ?? null}
                />
              </div>
            </div>

            {/* State Sandbox Workspace - occupies 5 cols in xl */}
            <div className="xl:col-span-5 h-full flex flex-col">
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-bold mb-1 ml-1 block">
                Workspace Canvas Stage
              </span>
              <div className="flex-1 min-h-0">
                <StateWorkspace
                  problemId={selectedProblem.id}
                  activeStep={activeStep}
                />
              </div>
            </div>
          </div>

          {/* Scrubber Playback panel at bottom of left column */}
          <div className="shrink-0">
            <PlaybackControls
              currentStep={currentStepIdx}
              totalSteps={simulationSteps.length}
              isPlaying={isPlaying}
              speed={speed}
              description={activeStep?.description ?? ''}
              onStepChange={(step) => {
                setIsPlaying(false);
                setCurrentStepIdx(step);
              }}
              onPlayPause={() => setIsPlaying((prev) => !prev)}
              onPrevStep={() => {
                setIsPlaying(false);
                setCurrentStepIdx((prev) => Math.max(0, prev - 1));
              }}
              onNextStep={() => {
                setIsPlaying(false);
                setCurrentStepIdx((prev) => Math.min(simulationSteps.length - 1, prev + 1));
              }}
              onReset={handleReset}
              onSpeedChange={(val) => setSpeed(val)}
            />
          </div>
        </section>

        {/* RIGHT COMPONENT (5 cols out of 12) */}
        <section className="flex-[5] flex flex-col min-h-[450px]">
          <TraceAndStatePanel
            selectedProblem={selectedProblem}
            activeStep={activeStep}
            historySteps={simulationSteps}
          />
        </section>
      </main>
    </div>
  );
}
