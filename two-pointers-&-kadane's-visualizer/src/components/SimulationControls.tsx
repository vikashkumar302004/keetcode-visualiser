import React from 'react';
import { Play, Pause, SkipBack, ChevronLeft, ChevronRight, RotateCw, FastForward, Info } from 'lucide-react';

interface SimulationControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onStepIndexChange: (idx: number) => void;
  onTogglePlay: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  descriptionText: string;
}

export default function SimulationControls({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  onStepIndexChange,
  onTogglePlay,
  onStepBack,
  onStepForward,
  onReset,
  onSpeedChange,
  descriptionText,
}: SimulationControlsProps) {
  // Compute progress percent
  const percent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 shrink-0">
      {/* Real-time description banner */}
      <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-3 text-sm font-sans flex items-start gap-2.5">
        <div className="bg-amber-500 text-amber-900 p-1 rounded-md shrink-0 mt-0.5">
          <Info className="w-4 h-4 text-white" />
        </div>
        <p className="text-slate-800 leading-normal font-medium flex-1">
          {descriptionText || 'Select a problem and click Simulate to trace the steps.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Scrubber slider and step indicators */}
        <div className="flex-1 w-full flex items-center gap-3">
          <span className="text-[11px] font-mono font-bold text-slate-400 w-10 text-right">
            Step {currentStepIndex}
          </span>

          <div className="flex-1 relative flex items-center group">
            <input
              type="range"
              min={0}
              max={Math.max(totalSteps - 1, 0)}
              value={currentStepIndex}
              onChange={(e) => onStepIndexChange(Number(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />
            {/* Custom filled progress bar overlay to match slider track */}
            <div
              className="absolute left-0 h-1.5 bg-amber-400 rounded-l-lg pointer-events-none"
              style={{ width: `${percent}%` }}
            ></div>
          </div>

          <span className="text-[11px] font-mono font-bold text-slate-400 w-10 text-left">
            / {Math.max(totalSteps - 1, 0)}
          </span>
        </div>

        {/* Action Controls & Speeds */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Back 1 Step */}
          <button
            onClick={onStepBack}
            disabled={currentStepIndex === 0}
            className="p-2 border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg text-slate-600 transition-colors shadow-2xs"
            title="Step Backward (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play / Pause Toggle */}
          <button
            onClick={onTogglePlay}
            disabled={totalSteps <= 1}
            className={`px-4 py-2 rounded-lg text-xs font-sans font-bold flex items-center gap-1.5 transition-all shadow-xs ${
              isPlaying
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-amber-950'
            }`}
            title="Play / Pause (Spacebar)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" fill="currentColor" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" fill="currentColor" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Forward 1 Step */}
          <button
            onClick={onStepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-2 border border-slate-200 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg text-slate-600 transition-colors shadow-2xs"
            title="Step Forward (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Restart Sim */}
          <button
            onClick={onReset}
            className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition-colors shadow-2xs"
            title="Restart Simulation (R)"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Divider */}
          <span className="w-px h-6 bg-slate-200 mx-1"></span>

          {/* Speed Selector */}
          <div className="flex flex-col">
            <select
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer shadow-2xs"
            >
              <option value={0.5}>0.5x Speed</option>
              <option value={1}>1.0x Speed</option>
              <option value={2}>2.0x Speed</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
