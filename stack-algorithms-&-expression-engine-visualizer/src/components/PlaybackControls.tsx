import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Zap } from 'lucide-react';

interface PlaybackControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  activeDescription: string;
  onStepIndexChange: (idx: number) => void;
  onPlayPauseToggle: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  activeDescription,
  onStepIndexChange,
  onPlayPauseToggle,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col gap-3 select-none shrink-0 shadow-xs">
      
      {/* 1. Step Description Banner (Lighter neutral background, bold accents) */}
      <div className="bg-amber-500/10 border border-amber-200/50 rounded-lg p-2.5 min-h-[50px] flex items-center gap-2.5">
        <div className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 border border-amber-200">
          <Zap className="w-3 h-3 text-amber-800" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-sans font-bold text-amber-900 uppercase tracking-wider leading-none mb-0.5">
            Operational Action
          </p>
          <p className="font-sans text-[11.5px] font-semibold text-slate-800 leading-snug">
            {activeDescription || 'Simulation idle. Click simulate to begin.'}
          </p>
        </div>
      </div>

      {/* 2. Timeline Scrubber and Labels */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] text-slate-400 select-none shrink-0">
          Step {currentStepIndex} / {totalSteps - 1 >= 0 ? totalSteps - 1 : 0}
        </span>
        
        <input
          type="range"
          min={0}
          max={totalSteps - 1 >= 0 ? totalSteps - 1 : 0}
          value={currentStepIndex}
          onChange={(e) => onStepIndexChange(Number(e.target.value))}
          className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
          id="simulation-scrubber"
        />

        <div className="flex gap-1 shrink-0">
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border transition-all ${
                speed === s
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
              id={`speed-btn-${s}x`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* 3. Operational playback controls bar */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2 shrink-0">
        <div className="flex items-center gap-1">
          {/* Step Backward */}
          <button
            onClick={onStepBackward}
            disabled={currentStepIndex === 0 || totalSteps <= 1}
            className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            title="Step Backward (Left Arrow)"
            id="step-back-btn"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-[8px] font-sans font-medium text-slate-400 mt-0.5 uppercase">
              [←]
            </span>
          </button>

          {/* Play/Pause */}
          <button
            onClick={onPlayPauseToggle}
            disabled={totalSteps <= 1}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg border text-white transition-all ${
              isPlaying
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-800 hover:border-slate-700'
                : 'bg-amber-500 hover:bg-amber-600 border-amber-400 hover:border-amber-500 text-amber-950 font-extrabold shadow-sm'
            } disabled:opacity-40 disabled:hover:bg-transparent`}
            title="Play / Pause (Spacebar)"
            id="play-pause-btn"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span className={`text-[8px] font-sans mt-0.5 uppercase ${isPlaying ? 'text-slate-400' : 'text-amber-900'}`}>
              [Space]
            </span>
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={currentStepIndex === totalSteps - 1 || totalSteps <= 1}
            className="flex flex-col items-center justify-center p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
            title="Step Forward (Right Arrow)"
            id="step-forward-btn"
          >
            <ChevronRight className="w-4 h-4" />
            <span className="text-[8px] font-sans font-medium text-slate-400 mt-0.5 uppercase">
              [→]
            </span>
          </button>
        </div>

        {/* Reset */}
        <button
          onClick={onReset}
          className="flex flex-col items-center justify-center p-2 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-all"
          title="Reset simulation (R)"
          id="sim-reset-btn"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span className="text-[8px] font-sans font-medium text-slate-400 mt-0.5 uppercase">
            Reset [R]
          </span>
        </button>
      </div>

    </div>
  );
};
