/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Pause, SkipBack, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface SimulationControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onStepChange: (index: number) => void;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  description: string;
}

export default function SimulationControls({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  onStepChange,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  description
}: SimulationControlsProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col gap-4 font-sans select-none">
      {/* Real-time description panel (Educational Marquee) */}
      <div className="bg-amber-500/5 border border-amber-500/10 rounded p-3 text-xs text-amber-900 flex flex-col gap-1 leading-relaxed">
        <span className="font-bold text-[10px] text-amber-800 uppercase tracking-wide">
          Step Explanation:
        </span>
        <p className="font-medium text-slate-800">{description}</p>
      </div>

      {/* Progress scrubber */}
      <div className="flex items-center gap-3 w-full">
        <span className="text-[10px] font-mono text-slate-500 w-8 text-right">
          Step {currentStepIndex}
        </span>
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => onStepChange(parseInt(e.target.value) || 0)}
          className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
        />
        <span className="text-[10px] font-mono text-slate-500 w-8 text-left">
          / {totalSteps}
        </span>
      </div>

      {/* Control Buttons row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          {/* Reset */}
          <button
            onClick={onReset}
            className="p-1.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Reset Simulation (R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step back */}
          <button
            onClick={onStepBackward}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Step Backward (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={onTogglePlay}
            className={`px-4 py-1.5 rounded-md border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              isPlaying
                ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                : 'bg-amber-500 border-amber-600 text-white hover:bg-amber-600'
            }`}
            title="Play / Pause (Spacebar)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Step forward */}
          <button
            onClick={onStepForward}
            disabled={currentStepIndex === totalSteps - 1}
            className="p-1.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Step Forward (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Speed dropdown Selector */}
        <div className="flex items-center gap-2">
          <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
            Playback Speed:
          </label>
          <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-1 text-[10px] font-bold rounded transition-colors cursor-pointer ${
                  speed === s
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
