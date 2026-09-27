import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  Gauge, 
  ArrowRight,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { SimulationStep } from '../types';

interface PlaybackBarProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  currentStep: SimulationStep | null;
  onPlayPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onSeek: (stepIndex: number) => void;
  onSpeedChange: (speed: number) => void;
}

export const PlaybackBar: React.FC<PlaybackBarProps> = ({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  currentStep,
  onPlayPause,
  onStepBack,
  onStepForward,
  onReset,
  onSeek,
  onSpeedChange
}) => {
  const action = currentStep?.action ?? 'init';

  // Badge for current operation
  const getActionBadge = () => {
    switch (action) {
      case 'expand':
        return {
          label: 'Expanding (R++)',
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
        };
      case 'shrink':
        return {
          label: 'Shrinking (L++)',
          bg: 'bg-rose-100 text-rose-900 border-rose-300',
          icon: <Minimize2 className="w-3.5 h-3.5 text-rose-700" />
        };
      case 'record':
        return {
          label: 'Recording Result',
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
        };
      case 'slide':
        return {
          label: 'Sliding Window',
          bg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          icon: <ArrowRight className="w-3.5 h-3.5 text-indigo-700" />
        };
      case 'check':
        return {
          label: 'Checking Invariant',
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          icon: <AlertCircle className="w-3.5 h-3.5 text-slate-700" />
        };
      case 'done':
        return {
          label: 'Scan Completed',
          bg: 'bg-emerald-50 text-emerald-950 border-emerald-300 font-bold',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
        };
      default:
        return {
          label: 'Initialization',
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: null
        };
    }
  };

  const actionInfo = getActionBadge();

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs space-y-2.5">
      {/* Real-time Operational Description Banner */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-slate-50 border border-slate-200">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-0.5 rounded-sm text-[11px] font-mono font-semibold border flex items-center space-x-1 ${actionInfo.bg}`}>
            {actionInfo.icon}
            <span>{actionInfo.label}</span>
          </span>
          <span className="text-xs font-medium text-slate-800 truncate">
            {currentStep?.actionDescription ?? 'Ready to simulate.'}
          </span>
        </div>

        <span className="font-mono text-xs text-slate-500 shrink-0">
          Step <strong className="text-slate-900">{currentStepIndex + 1}</strong> of <strong className="text-slate-900">{totalSteps || 1}</strong>
        </span>
      </div>

      {/* Step Scrubber Slider */}
      <div className="flex items-center space-x-3">
        <span className="font-mono text-[11px] text-slate-500 shrink-0">0</span>
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <span className="font-mono text-[11px] text-slate-500 shrink-0">
          {Math.max(0, totalSteps - 1)}
        </span>
      </div>

      {/* Playback Controls and Speed */}
      <div className="flex items-center justify-between">
        {/* Left: Keyboard hints */}
        <div className="text-[10px] font-mono text-slate-600 hidden sm:flex items-center space-x-2">
          <span><kbd className="px-1 py-0.5 bg-slate-100 rounded border border-slate-200">Space</kbd> Play</span>
          <span><kbd className="px-1 py-0.5 bg-slate-100 rounded border border-slate-200">&larr;/&rarr;</kbd> Step</span>
          <span><kbd className="px-1 py-0.5 bg-slate-100 rounded border border-slate-200">R</kbd> Reset</span>
        </div>

        {/* Center: Play / Pause / Step buttons */}
        <div className="flex items-center space-x-2 mx-auto sm:mx-0">
          <button
            id="btn-playback-reset"
            onClick={onReset}
            title="Reset to Step 0 (R)"
            className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            id="btn-playback-prev"
            onClick={onStepBack}
            disabled={currentStepIndex <= 0}
            title="Step Backward (Left Arrow)"
            className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            id="btn-playback-playpause"
            onClick={onPlayPause}
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            className="px-3.5 py-1.5 rounded-md bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span className="text-xs">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span className="text-xs">Play</span>
              </>
            )}
          </button>

          <button
            id="btn-playback-next"
            onClick={onStepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Step Forward (Right Arrow)"
            className="p-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Speed Dropdown */}
        <div className="flex items-center space-x-1.5">
          <Gauge className="w-3.5 h-3.5 text-slate-500" />
          <select
            id="select-playback-speed"
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="text-xs font-mono py-1 px-1.5 rounded-md border border-slate-200 bg-slate-50 text-slate-700 focus:outline-hidden cursor-pointer"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1.0x</option>
            <option value={2}>2.0x</option>
            <option value={3}>3.0x</option>
          </select>
        </div>
      </div>
    </div>
  );
};
