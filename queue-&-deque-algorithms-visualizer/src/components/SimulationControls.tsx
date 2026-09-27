import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface SimulationControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  explanation: string;
  onStepChange: (stepIdx: number) => void;
  onPlayPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  explanation,
  onStepChange,
  onPlayPause,
  onPrev,
  onNext,
  onReset,
  onSpeedChange,
}) => {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl p-3 border border-slate-800 shadow-md font-sans">
      {/* Real-time operational description banner */}
      <div className="bg-slate-950 px-3 py-2 rounded-lg border border-slate-800/80 mb-3 min-h-[50px] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-ping" />
        <div className="text-xs font-semibold text-slate-300 leading-normal tracking-wide">
          <span className="text-amber-400 font-bold uppercase font-mono mr-1.5">[Step {currentStep}]:</span>
          {explanation || 'Ready. Click Simulate or Play to begin step-by-step execution.'}
        </div>
      </div>

      {/* Progress slider scrubber */}
      <div className="flex items-center gap-3.5 mb-2.5">
        <span className="text-[10px] font-bold text-slate-400 font-mono w-10 text-right">
          {currentStep} / {Math.max(0, totalSteps - 1)}
        </span>

        <input
          type="range"
          min="0"
          max={Math.max(0, totalSteps - 1)}
          value={currentStep}
          onChange={(e) => onStepChange(Number(e.target.value))}
          disabled={totalSteps <= 1}
          className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 disabled:opacity-30"
        />

        <span className="text-[10px] font-bold text-slate-400 font-mono w-12 text-left">
          {totalSteps > 0 ? Math.round((currentStep / (totalSteps - 1 || 1)) * 100) : 0}%
        </span>
      </div>

      {/* Control Actions Row */}
      <div className="flex items-center justify-between gap-4">
        {/* Play / Step controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onReset}
            className="p-2 rounded hover:bg-slate-800 text-rose-400 hover:text-rose-300 disabled:opacity-30 cursor-pointer transition select-none"
            title="Reset simulation to beginning (Shortcut: R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onPrev}
            disabled={currentStep === 0}
            className="p-2 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer transition select-none"
            title="Previous step (Shortcut: Left Arrow)"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={onPlayPause}
            disabled={totalSteps <= 1}
            className="p-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-md hover:shadow-lg disabled:opacity-40 disabled:hover:bg-amber-500 cursor-pointer transition select-none"
            title={isPlaying ? 'Pause simulation (Shortcut: Space)' : 'Play simulation (Shortcut: Space)'}
          >
            {isPlaying ? <Pause className="w-4.5 h-4.5 fill-current" /> : <Play className="w-4.5 h-4.5 fill-current" />}
          </button>

          <button
            onClick={onNext}
            disabled={currentStep >= totalSteps - 1}
            className="p-2 rounded hover:bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer transition select-none"
            title="Next step (Shortcut: Right Arrow)"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Speed and keyboard helper */}
        <div className="flex items-center gap-3">
          <span className="text-[9px] text-slate-500 font-medium font-sans hidden sm:inline">
            Use <kbd className="bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-slate-400">Space</kbd> / <kbd className="bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-slate-400">←</kbd> <kbd className="bg-slate-800 border border-slate-700 px-1 py-0.5 rounded text-slate-400">→</kbd> to control
          </span>

          <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded border border-slate-700">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Speed:</span>
            <select
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="bg-slate-900 text-amber-400 text-xs font-bold rounded px-1.5 py-0.5 focus:outline-none border border-slate-700 cursor-pointer"
            >
              <option value="0.5">0.5x</option>
              <option value="1">1.0x</option>
              <option value="2">2.0x</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
