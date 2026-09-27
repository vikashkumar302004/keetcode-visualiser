import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

interface PlaybackBarProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  description: string;
  onStepChange: (index: number) => void;
  onPlayPauseToggle: () => void;
  onStepBackward: () => void;
  onStepForward: () => void;
  onSpeedChange: (speed: number) => void;
  onReset: () => void;
}

export default function PlaybackBar({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  description,
  onStepChange,
  onPlayPauseToggle,
  onStepBackward,
  onStepForward,
  onSpeedChange,
  onReset
}: PlaybackBarProps) {
  
  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 shadow-sm shrink-0 font-sans select-none">
      
      {/* 1. Operational Real-time Description Banner */}
      <div className="bg-amber-50/40 border border-amber-200/60 rounded-lg p-3 min-h-[48px] flex items-center justify-between text-xs text-amber-900 transition-colors duration-150">
        <p className="font-sans leading-relaxed tracking-wide font-medium flex-1 mr-3">
          {description || "Press Simulate to calculate steps."}
        </p>
        <span className="font-mono text-[10px] bg-amber-500/10 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200/50 whitespace-nowrap self-start">
          Step {currentStepIndex + 1} / {totalSteps}
        </span>
      </div>

      {/* 2. Scrubber progress bar slider */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-[10px] font-mono font-semibold text-slate-400">00</span>
        <div className="flex-1 relative group py-2">
          {/* Custom Track Background */}
          <div className="h-1 bg-slate-100 rounded-full w-full absolute top-1/2 -translate-y-1/2" />
          {/* Custom Highlighted Progress Track */}
          <div
            className="h-1 bg-amber-500 rounded-full absolute top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ width: `${progressPercent}%` }}
          />
          {/* Interactive Range Input */}
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => onStepChange(parseInt(e.target.value))}
            className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-4 opacity-0 cursor-pointer"
          />
          {/* Thumb marker indicator */}
          <div
            className="w-3.5 h-3.5 bg-amber-600 border-2 border-white rounded-full shadow-md absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all"
            style={{ left: `calc(${progressPercent}% - 7px)` }}
          />
        </div>
        <span className="text-[10px] font-mono font-semibold text-slate-400">
          {(totalSteps - 1).toString().padStart(2, '0')}
        </span>
      </div>

      {/* 3. Operational Playback Controls & Speed Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Playback Buttons Group */}
        <div className="flex items-center gap-1">
          <button
            onClick={onReset}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg border border-slate-100 hover:border-slate-200 transition-all cursor-pointer"
            title="Reset simulation to beginning (shortcut: R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-4 w-[1px] bg-slate-200 mx-1" />

          <button
            onClick={onStepBackward}
            disabled={currentStepIndex === 0}
            className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
            title="Previous Step (shortcut: Left Arrow)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayPauseToggle}
            disabled={totalSteps <= 1}
            className={`p-2.5 rounded-full text-white transition-all shadow-sm cursor-pointer ${
              isPlaying ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-amber-500 hover:bg-amber-600'
            } disabled:opacity-50`}
            title={isPlaying ? "Pause Simulation (Spacebar)" : "Play Simulation (Spacebar)"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={onStepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all cursor-pointer"
            title="Next Step (shortcut: Right Arrow)"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts indicators and Speed Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Keyboard shortcuts hints */}
          <div className="hidden lg:flex items-center gap-3 text-[10px] text-slate-400 font-mono">
            <span>[Space] Play/Pause</span>
            <span>&bull;</span>
            <span>[&larr; / &rarr;] Step</span>
            <span>&bull;</span>
            <span>[R] Reset</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-200 hidden lg:block" />

          {/* Speed Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Speed</span>
            <select
              value={speed}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-[11px] font-semibold rounded-md px-2 py-1.5 focus:outline-none cursor-pointer hover:bg-white hover:border-slate-300 transition-all"
            >
              <option value={0.5}>0.5x</option>
              <option value={1.0}>1.0x</option>
              <option value={2.0}>2.0x</option>
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
