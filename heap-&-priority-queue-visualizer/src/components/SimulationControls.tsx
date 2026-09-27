import React, { useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward, Info } from 'lucide-react';

interface SimulationControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onScrub: (step: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  description: string;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onReset,
  onScrub,
  speed,
  onSpeedChange,
  description
}) => {
  // Global keyboard shortcuts: Space (Play/Pause), Left (Back), Right (Forward), R (Reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing inside an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        onPlayPause();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onStepBackward();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onStepForward();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayPause, onStepBackward, onStepForward, onReset]);

  const hasNext = currentStep < totalSteps - 1;
  const hasPrev = currentStep > 0;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-2.5 shadow-2xs space-y-2 select-none">
      {/* Real-time Operational Description Banner */}
      <div className="bg-amber-50/70 border border-amber-200 rounded-md px-3 py-1.5 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-mono font-medium text-amber-950 leading-snug">
            {description || 'Ready. Press Simulate or Play to begin step-by-step algorithm animation.'}
          </p>
        </div>
      </div>

      {/* Playback Controls & Scrubber */}
      <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        {/* Buttons Group */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Reset */}
          <button
            id="playback-reset-btn"
            onClick={onReset}
            title="Reset to Step 0 (Key: R)"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Back */}
          <button
            id="playback-step-back-btn"
            onClick={onStepBackward}
            disabled={!hasPrev}
            title="Step Backward (Left Arrow)"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause */}
          <button
            id="playback-play-pause-btn"
            onClick={onPlayPause}
            title={isPlaying ? 'Pause (Spacebar)' : 'Play (Spacebar)'}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* Step Forward */}
          <button
            id="playback-step-forward-btn"
            onClick={onStepForward}
            disabled={!hasNext}
            title="Step Forward (Right Arrow)"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md border border-slate-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          {/* Speed Selector */}
          <div className="flex items-center ml-1 bg-slate-100 rounded-md border border-slate-200 p-0.5 text-xs font-mono">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-1.5 py-0.5 rounded transition-all cursor-pointer ${
                  speed === s
                    ? 'bg-white text-amber-800 font-bold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Step Scrubber Slider */}
        <div className="flex items-center gap-2.5 flex-1 min-w-[160px]">
          <input
            id="playback-step-scrubber"
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStep}
            onChange={(e) => onScrub(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />
          <span className="font-mono text-xs font-semibold text-slate-600 shrink-0 min-w-[54px] text-right">
            {totalSteps > 0 ? `${currentStep + 1}/${totalSteps}` : '0/0'}
          </span>
        </div>
      </div>
    </div>
  );
};
