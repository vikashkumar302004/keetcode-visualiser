import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Keyboard } from 'lucide-react';

interface PlaybackControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number; // in ms
  description: string;
  onStepChange: (step: number) => void;
  onPlayPause: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export default function PlaybackControls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  description,
  onStepChange,
  onPlayPause,
  onPrevStep,
  onNextStep,
  onReset,
  onSpeedChange,
}: PlaybackControlsProps) {
  // Translate speed value (ms) to user-friendly text (e.g. 1000ms = 1x, 500ms = 2x, 2000ms = 0.5x)
  const speedLabel = speed === 1800 ? '0.5x' : speed === 1000 ? '1.0x' : speed === 450 ? '2.0x' : '1.0x';

  return (
    <div className="flex flex-col gap-2 p-4 bg-[#FAF9F6] border border-slate-200 rounded-lg">
      
      {/* Real-time Operational Description Banner */}
      <div className="bg-amber-50 border border-amber-200/50 p-2.5 rounded shadow-sm text-xs text-amber-900 font-sans leading-relaxed min-h-[50px] flex items-start gap-2 animate-fadeIn">
        <div className="font-bold text-[10px] uppercase font-mono tracking-wider text-amber-800 bg-amber-200/40 px-1 rounded shrink-0 mt-0.5">
          Step Log
        </div>
        <p className="font-mono text-[11px] text-amber-950 font-medium">
          {description || "Press Simulate or step forward to watch recursion execute."}
        </p>
      </div>

      {/* Scrubber and Scrubber range indicator */}
      <div className="flex items-center gap-3 mt-1">
        <span className="font-mono text-[10px] text-slate-500 min-w-[36px] text-right">
          S{currentStep.toString().padStart(3, '0')}
        </span>
        <input
          type="range"
          min="0"
          max={Math.max(0, totalSteps - 1)}
          value={currentStep}
          onChange={(e) => onStepChange(Number(e.target.value))}
          className="flex-1 accent-amber-500 h-1.5 bg-slate-200 rounded-lg cursor-pointer focus:outline-none"
        />
        <span className="font-mono text-[10px] text-slate-500 min-w-[36px]">
          S{Math.max(0, totalSteps - 1).toString().padStart(3, '0')}
        </span>
      </div>

      {/* Button controls and Speed Selector */}
      <div className="flex items-center justify-between gap-4 mt-1.5 flex-wrap">
        
        {/* Play / Pause / Nav buttons */}
        <div className="flex items-center gap-1">
          {/* Reset button */}
          <button
            onClick={onReset}
            className="p-1.5 rounded hover:bg-slate-200/60 text-slate-600 active:bg-slate-200 transition-colors cursor-pointer"
            title="Reset Simulation (Shortcut: R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Prev step */}
          <button
            onClick={onPrevStep}
            disabled={currentStep === 0}
            className="p-1.5 rounded hover:bg-slate-200/60 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent active:bg-slate-200 transition-colors cursor-pointer"
            title="Step Backward (Left Arrow)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Play/Pause toggle */}
          <button
            onClick={onPlayPause}
            className="p-2 rounded-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold active:scale-95 shadow transition-all cursor-pointer flex items-center justify-center w-9 h-9"
            title={isPlaying ? 'Pause (Spacebar)' : 'Play (Spacebar)'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-amber-950" /> : <Play className="w-4 h-4 fill-amber-950 ml-0.5" />}
          </button>

          {/* Next step */}
          <button
            onClick={onNextStep}
            disabled={currentStep >= totalSteps - 1}
            className="p-1.5 rounded hover:bg-slate-200/60 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent active:bg-slate-200 transition-colors cursor-pointer"
            title="Step Forward (Right Arrow)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Speed Selection Tabs (Segmented Button styled instead of standard dropdown) */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-400">Tempo:</span>
          <div className="flex items-center gap-0.5 p-0.5 bg-slate-100 rounded border border-slate-200">
            {([1800, 1000, 450] as const).map((spdValue) => {
              const label = spdValue === 1800 ? '0.5x' : spdValue === 1000 ? '1.0x' : '2.0x';
              const isActive = speed === spdValue;
              return (
                <button
                  key={spdValue}
                  onClick={() => onSpeedChange(spdValue)}
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded cursor-pointer transition-all ${
                    isActive ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Keyboard Shortcuts Hint */}
        <div className="hidden sm:flex items-center gap-1 text-[9px] text-slate-400 font-mono">
          <Keyboard className="w-3.5 h-3.5" />
          <span>Space: Play/Pause · Arrows: Step · R: Reset</span>
        </div>
      </div>
    </div>
  );
}
