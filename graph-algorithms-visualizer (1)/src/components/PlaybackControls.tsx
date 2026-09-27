import React, { useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Gauge
} from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  currentStepIndex: number;
  totalSteps: number;
  onSeek: (stepIndex: number) => void;
  speed: number;
  onChangeSpeed: (speed: number) => void;
}

const SPEED_PRESETS = [0.25, 0.5, 1, 1.5, 2, 3];

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onReset,
  currentStepIndex,
  totalSteps,
  onSeek,
  speed,
  onChangeSpeed
}) => {
  // Global Keyboard listener for responsive hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        onTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onStepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onStepBackward();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlay, onStepForward, onStepBackward, onReset]);

  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="bg-white border border-stone-200/90 rounded-xl p-3 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Playback Buttons Group */}
        <div className="flex items-center gap-1.5">
          {/* Reset button */}
          <button
            id="btn-reset"
            onClick={onReset}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            title="Reset Simulation (R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Step Backward */}
          <button
            id="btn-step-backward"
            onClick={onStepBackward}
            disabled={currentStepIndex <= 0}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors"
            title="Previous Step (Left Arrow)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          {/* Play / Pause Main Button */}
          <button
            id="btn-play-pause"
            onClick={onTogglePlay}
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold text-xs transition-colors shadow-xs"
            title="Play / Pause (Space)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{currentStepIndex >= totalSteps - 1 ? 'Replay' : 'Play'}</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            id="btn-step-forward"
            onClick={onStepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent rounded-lg transition-colors"
            title="Next Step (Right Arrow)"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Slider & Step Counter */}
        <div className="flex-1 w-full flex items-center gap-3 px-2">
          <input
            id="timeline-slider"
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={e => onSeek(parseInt(e.target.value, 10))}
            className="flex-1 h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
          />

          <div className="text-xs font-mono font-semibold text-stone-700 whitespace-nowrap bg-stone-100 px-2.5 py-1 rounded border border-stone-200 shrink-0">
            Step {currentStepIndex + 1} / {totalSteps || 1}
          </div>
        </div>

        {/* Speed Multiplier Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 text-xs text-stone-500 font-medium">
            <Gauge className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Speed:</span>
          </div>

          <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200">
            {SPEED_PRESETS.map(s => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-2 py-0.5 text-xs font-semibold rounded font-mono transition-all ${
                  speed === s
                    ? 'bg-white text-stone-900 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
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
};
