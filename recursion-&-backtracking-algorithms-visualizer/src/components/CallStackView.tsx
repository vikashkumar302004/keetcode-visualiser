import React from 'react';
import { CallStackFrame } from '../types';
import { Server, ArrowUp, Zap } from 'lucide-react';

interface CallStackViewProps {
  stack: CallStackFrame[];
  maxDepthLimit?: number;
}

export default function CallStackView({ stack, maxDepthLimit = 10 }: CallStackViewProps) {
  const currentDepth = stack.length;
  // Compute percentage for the Stack Depth Meter
  const meterPercentage = Math.min(100, (currentDepth / maxDepthLimit) * 100);

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-lg p-3">
      {/* Header with Stack depth info */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 font-sans">
          <Server className="w-4 h-4 text-slate-600" />
          <span>Execution Call Stack</span>
        </div>
        <div className="text-[10px] font-mono text-slate-500">
          Depth: <span className="font-bold text-slate-800">{currentDepth}</span>/{maxDepthLimit} frames
        </div>
      </div>

      {/* Stack Depth Meter Progress Bar */}
      <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            meterPercentage > 80 ? 'bg-rose-500' : meterPercentage > 50 ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${meterPercentage}%` }}
        />
      </div>

      {/* Push-down stack block representation */}
      <div className="flex-1 flex flex-col-reverse justify-end gap-1.5 overflow-y-auto pr-1 min-h-[140px] scrollbar-thin">
        {stack.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center py-4">
            <span className="font-mono text-xs">Stack is empty</span>
            <span className="text-[10px] text-slate-400 mt-0.5">No active recursive calls</span>
          </div>
        ) : (
          stack.map((frame, index) => {
            const isTop = index === stack.length - 1;

            return (
              <div
                key={frame.id}
                className={`relative border rounded px-2.5 py-1.5 transition-all duration-200 font-mono text-xs ${
                  isTop
                    ? 'bg-amber-50 border-amber-400 text-amber-900 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                {/* Pointer for top of the stack */}
                {isTop && (
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                )}

                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-1">
                    <span className={`font-bold ${isTop ? 'text-amber-800' : 'text-slate-800'}`}>
                      {frame.name}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      (depth {frame.depth})
                    </span>
                  </div>
                  {isTop && (
                    <span className="text-[9px] uppercase tracking-wider font-bold text-amber-800 flex items-center gap-0.5 bg-amber-100/75 px-1 rounded">
                      <Zap className="w-2.5 h-2.5" />
                      Active
                    </span>
                  )}
                </div>

                {/* Local parameter list */}
                <div className="mt-1 grid grid-cols-1 gap-0.5 text-[10px] text-slate-500 bg-white/60 p-1 rounded border border-slate-100">
                  {Object.entries(frame.params).map(([key, val]) => {
                    const formattedValue = Array.isArray(val)
                      ? `[${val.join(',')}]`
                      : typeof val === 'object'
                      ? JSON.stringify(val)
                      : String(val);

                    return (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium text-slate-500">{key}:</span>
                        <span className="font-bold text-slate-700 truncate max-w-[120px]" title={formattedValue}>
                          {formattedValue}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
