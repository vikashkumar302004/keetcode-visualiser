/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Pause, SkipBack, ChevronLeft, ChevronRight, RotateCcw, Info } from 'lucide-react';

interface PlaybackControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onScrub: (index: number) => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  description: string;
}

export default function PlaybackControls({
  currentStepIndex,
  totalSteps,
  isPlaying,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onScrub,
  onReset,
  speed,
  onSpeedChange,
  description,
}: PlaybackControlsProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3.5">
      {/* Real-time operational description banner */}
      <div className="flex items-start gap-2.5 bg-amber-50/50 border border-amber-200/50 rounded-lg p-3 text-xs leading-relaxed text-amber-950">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="font-medium">
          {description || 'Initialization phase. Press Play or use Step Forward to traverse the algorithm.'}
        </p>
      </div>

      {/* Scrubber slider line */}
      <div className="flex items-center gap-3">
        <span className="text-[10px] font-mono text-slate-400 font-bold w-12">
          Step {currentStepIndex}/{totalSteps - 1}
        </span>
        <input
          type="range"
          min="0"
          max={totalSteps - 1}
          value={currentStepIndex}
          onChange={(e) => onScrub(parseInt(e.target.value) || 0)}
          className="flex-1 accent-amber-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer border border-slate-200"
        />
        <span className="text-[10px] font-mono text-slate-400 font-bold">
          {Math.round((currentStepIndex / (totalSteps - 1 || 1)) * 100)}%
        </span>
      </div>

      {/* Control Buttons row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1.5">
          {/* Reset */}
          <button
            onClick={onReset}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-lg transition-colors"
            title="Reset simulation to beginning (R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Back */}
          <button
            onClick={onStepBackward}
            disabled={currentStepIndex === 0}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:border-transparent border border-transparent hover:border-slate-200 rounded-lg transition-colors"
            title="Step backward (Left Arrow)"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={onPlayPause}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-all text-xs"
            title="Play / Pause (Spacebar)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-amber-950 stroke-none" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-amber-950 stroke-none" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={currentStepIndex === totalSteps - 1}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:border-transparent border border-transparent hover:border-slate-200 rounded-lg transition-colors"
            title="Step forward (Right Arrow)"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Speed selection */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Playback Speed</span>
          <select
            value={speed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value) || 1)}
            className="bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 rounded-lg px-2 py-1 cursor-pointer focus:outline-none"
          >
            <option value="0.5">0.5x</option>
            <option value="1">1.0x</option>
            <option value="2">2.0x</option>
          </select>
        </div>
      </div>
    </div>
  );
}
