/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Cpu
} from 'lucide-react';
import { CodeBlock } from '../types';

interface CppTracePanelProps {
  codeBlock: CodeBlock;
  currentLine: number;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (val: number) => void;
  variables: Record<string, any>;
  currentStepIndex: number;
  totalSteps: number;
}

export const CppTracePanel: React.FC<CppTracePanelProps> = ({
  codeBlock,
  currentLine,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  onReset,
  speed,
  onSpeedChange,
  variables,
  currentStepIndex,
  totalSteps
}) => {
  return (
    <div id="cpp-trace-panel" className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden h-full">
      {/* Header */}
      <div id="trace-panel-header" className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div id="trace-panel-title-container" className="flex items-center gap-2">
          <Cpu id="cpu-icon" className="w-4 h-4 text-indigo-600" />
          <span id="trace-panel-title" className="font-sans font-semibold text-xs tracking-wider uppercase text-slate-700">
            C++ Execution Engine
          </span>
        </div>
        <div id="trace-panel-step-badge" className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          Step {currentStepIndex + 1} / {totalSteps}
        </div>
      </div>

      {/* Code Display Area */}
      <div id="code-display-area" className="flex-1 overflow-auto bg-slate-900 text-slate-100 p-4 font-mono text-sm leading-relaxed relative min-h-[300px]">
        {codeBlock.lines.map((lineText, idx) => {
          const lineNum = idx + 1;
          const isHighlighted = lineNum === currentLine;

          return (
            <div
              id={`code-line-row-${lineNum}`}
              key={lineNum}
              className={`flex items-start transition-colors duration-150 ${
                isHighlighted 
                  ? 'bg-indigo-950/70 border-l-4 border-indigo-500 -ml-4 pl-3' 
                  : 'pl-0'
              }`}
            >
              {/* Line Number */}
              <span id={`line-number-${lineNum}`} className={`w-8 select-none text-right pr-3 font-mono text-xs ${
                isHighlighted ? 'text-indigo-400 font-bold' : 'text-slate-600'
              }`}>
                {lineNum}
              </span>
              {/* Line Code */}
              <pre id={`code-line-${lineNum}`} className="flex-1 overflow-x-auto whitespace-pre font-mono text-xs md:text-sm">
                <code>{lineText}</code>
              </pre>
            </div>
          );
        })}
      </div>

      {/* Speed & Control Dashboard */}
      <div id="control-dashboard" className="p-4 border-t border-slate-200 bg-slate-50/30 flex flex-col gap-4">
        {/* Playback Controls */}
        <div id="playback-controls-row" className="flex items-center justify-between gap-2">
          <div id="playback-buttons-group" className="flex items-center gap-1.5">
            {/* Previous Step */}
            <button
              id="btn-prev-step"
              onClick={onPrev}
              disabled={currentStepIndex === 0}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Previous Step"
            >
              <ChevronLeft id="prev-icon" className="w-4 h-4" />
            </button>

            {/* Play/Pause Button */}
            <button
              id="btn-play-pause"
              onClick={onPlayPause}
              className={`px-5 py-2.5 rounded-lg font-sans font-medium text-xs tracking-wide text-white transition-all flex items-center justify-center gap-2 ${
                isPlaying 
                  ? 'bg-amber-600 hover:bg-amber-700 shadow-sm' 
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm'
              }`}
              style={{ paddingLeft: '20px', paddingRight: '20px' }} // Strict 2x padding ratio
            >
              {isPlaying ? (
                <>
                  <Pause id="pause-icon" className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play id="play-icon" className="w-3.5 h-3.5 fill-current" />
                  <span>Autoplay</span>
                </>
              )}
            </button>

            {/* Next Step */}
            <button
              id="btn-next-step"
              onClick={onNext}
              disabled={currentStepIndex === totalSteps - 1}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Next Step"
            >
              <ChevronRight id="next-icon" className="w-4 h-4" />
            </button>

            {/* Reset Button */}
            <button
              id="btn-reset"
              onClick={onReset}
              className="p-2 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors ml-2"
              title="Reset Simulation"
            >
              <RotateCcw id="reset-icon" className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Slider */}
          <div id="speed-slider-container" className="flex items-center gap-2 flex-1 max-w-[140px] md:max-w-none justify-end">
            <span id="speed-slider-label" className="font-sans text-xs text-slate-500 whitespace-nowrap">Speed:</span>
            <input
              id="speed-range-slider"
              type="range"
              min="500"
              max="3000"
              step="250"
              value={speed}
              onChange={(e) => onSpeedChange(Number(e.target.value))}
              className="w-20 md:w-24 accent-indigo-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
            />
            <span id="speed-value" className="font-mono text-xs text-slate-600 w-8 text-right">
              {(speed / 1000).toFixed(1)}s
            </span>
          </div>
        </div>

        {/* Live Debug Variable Stack */}
        <div id="variable-debugger-stack" className="border border-slate-200 rounded-lg bg-white p-3">
          <span id="debugger-label" className="font-sans font-bold text-[10px] tracking-wider uppercase text-slate-400 block mb-2">
            Local Variables (Stack Frame)
          </span>
          <div id="debugger-variables-container" className="grid grid-cols-2 gap-2 text-xs font-mono max-h-[140px] overflow-y-auto">
            {Object.keys(variables).length === 0 || Object.values(variables).every(v => v === null) ? (
              <span id="debugger-empty-state" className="col-span-2 text-slate-400 italic text-[11px]">
                No active variables defined in current block scope
              </span>
            ) : (
              Object.entries(variables).map(([name, val]) => {
                if (val === null) return null;
                let displayVal = '';
                if (Array.isArray(val)) {
                  if (Array.isArray(val[0])) {
                    displayVal = `[ ${val.map(item => `[${item.join(', ')}]`).join(', ')} ]`;
                  } else {
                    displayVal = `[${val.join(', ')}]`;
                  }
                } else if (typeof val === 'boolean') {
                  displayVal = val ? 'true' : 'false';
                } else {
                  displayVal = String(val);
                }

                return (
                  <div id={`debug-var-row-${name}`} key={name} className="flex items-center justify-between py-1 px-1.5 rounded bg-slate-50 border border-slate-100">
                    <span id={`debug-var-name-${name}`} className="text-slate-500 font-semibold">{name}</span>
                    <span id={`debug-var-value-${name}`} className="text-indigo-600 font-medium truncate max-w-[120px]" title={displayVal}>
                      {displayVal}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
