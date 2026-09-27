import React from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge,
  Sparkles,
} from 'lucide-react';

interface SimulationControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  description: string;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSeek: (stepIndex: number) => void;
  onSpeedChange: (speed: number) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  description,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSeek,
  onSpeedChange,
}) => {
  const isAtStart = currentStep <= 0;
  const isAtEnd = currentStep >= totalSteps - 1;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs space-y-2 shrink-0">
      {/* Current Step Description Callout */}
      <div className="flex items-center gap-2 bg-[#FAF9F6] border border-slate-200/90 rounded-lg px-2.5 py-1.5 min-h-[34px]">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
          Step {totalSteps > 0 ? currentStep + 1 : 0}/{totalSteps}
        </span>
        <p className="text-xs text-slate-800 leading-tight font-sans font-medium flex-1 truncate" title={description}>
          {description || 'Ready. Click Simulate or step forward to begin trace.'}
        </p>
        {isAtEnd && totalSteps > 0 && (
          <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.2 rounded-full shrink-0">
            Completed
          </span>
        )}
      </div>

      {/* Scrubber & Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Playback Buttons */}
        <div className="flex items-center gap-1">
          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            title="Reset to Step 1 (R)"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Step Back */}
          <button
            type="button"
            onClick={onStepBackward}
            disabled={isAtStart}
            title="Previous Step"
            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            type="button"
            onClick={onPlayPause}
            disabled={totalSteps <= 1}
            title={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            } disabled:opacity-30 disabled:cursor-not-allowed`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isAtEnd ? 'Replay' : 'Play'}</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            type="button"
            onClick={onStepForward}
            disabled={isAtEnd}
            title="Next Step"
            className="p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Progress Seek Scrubber */}
        <div className="flex-1 min-w-[120px] max-w-xs flex items-center gap-1.5 px-2">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStep}
            onChange={(e) => onSeek(Number(e.target.value))}
            disabled={totalSteps <= 1}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600 disabled:opacity-30"
          />
        </div>

        {/* Speed Controller */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5 text-slate-500 text-[11px]">
            <Gauge className="w-3 h-3" />
          </div>

          {[0.5, 1.0, 2.0].map((presetSpeed) => (
            <button
              key={presetSpeed}
              type="button"
              onClick={() => onSpeedChange(presetSpeed)}
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${
                speed === presetSpeed
                  ? 'bg-slate-900 border-slate-900 text-white font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {presetSpeed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
