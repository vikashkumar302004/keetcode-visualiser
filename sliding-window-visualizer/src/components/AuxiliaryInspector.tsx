import React from 'react';
import { SimulationStep, ProblemDefinition } from '../types';
import { Hash, ListOrdered, CheckCircle2, ArrowRight } from 'lucide-react';

interface AuxiliaryInspectorProps {
  problem: ProblemDefinition;
  step: SimulationStep | null;
}

export const AuxiliaryInspector: React.FC<AuxiliaryInspectorProps> = ({
  problem,
  step
}) => {
  if (!step) return null;

  const hasDeque = step.monotonicDeque !== undefined;
  const hasQueue = step.auxiliaryQueue !== undefined;
  const hasFreqMap = step.frequencyMap && Object.keys(step.frequencyMap).length > 0;
  const hasTargetGauge = step.requiredCount !== undefined && step.matchedCount !== undefined;

  if (!hasDeque && !hasQueue && !hasFreqMap && !hasTargetGauge) {
    // Render a clean invariant tracker
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs">
        <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-100">
          <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
            Window Invariant Inspector
          </span>
          <span className="text-[11px] font-mono text-slate-500">
            {problem.patternLabel}
          </span>
        </div>
        <div className="mt-2 text-xs text-slate-700 flex items-start space-x-2">
          <span className="font-semibold text-amber-700 font-mono shrink-0">RULE:</span>
          <span>{problem.invariant}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs space-y-3">
      {/* Target Gauge for LC #76 or Anagram Match */}
      {hasTargetGauge && (
        <div>
          <div className="flex items-center justify-between text-xs pb-1.5 mb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Target Match Progress</span>
            </span>
            <span className="font-mono text-xs font-bold text-slate-800">
              {step.matchedCount} / {step.requiredCount} required characters satisfied
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
            <div 
              className={`h-full transition-all duration-300 ${
                step.matchedCount! >= step.requiredCount! ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${Math.min(100, (step.matchedCount! / step.requiredCount!) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Monotonic Deque Display for LC #239 */}
      {hasDeque && (
        <div>
          <div className="flex items-center justify-between text-xs pb-1.5 mb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <ListOrdered className="w-3.5 h-3.5 text-indigo-600" />
              <span>Monotonic Decreasing Deque (Indices &amp; Values)</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Front = Window Maximum
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto py-1">
            {step.monotonicDeque!.length === 0 ? (
              <span className="text-xs font-mono text-slate-600 italic">Deque is empty</span>
            ) : (
              step.monotonicDeque!.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center px-2.5 py-1 rounded-md border font-mono text-xs transition-all ${
                    item.isFront
                      ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold ring-2 ring-amber-300/50 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-500 text-[10px]">idx:</span>
                    <span>{item.index}</span>
                  </div>
                  <div className="text-sm font-bold mt-0.5">
                    val: {item.value}
                  </div>
                  {item.isFront && (
                    <span className="text-[9px] uppercase font-bold text-amber-700 mt-0.5">
                      Front (Max)
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Auxiliary Queue Display (e.g. First Negative) */}
      {hasQueue && (
        <div>
          <div className="flex items-center justify-between text-xs pb-1.5 mb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
              Auxiliary Negative Elements Queue
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              Size: {step.auxiliaryQueue!.length}
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto py-1">
            {step.auxiliaryQueue!.length === 0 ? (
              <span className="text-xs font-mono text-slate-600 italic">No negative elements currently in window queue</span>
            ) : (
              step.auxiliaryQueue!.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center px-2.5 py-1 rounded-md border font-mono text-xs ${
                    idx === 0
                      ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-slate-500 text-[10px]">idx: {item.index}</span>
                  <span className="text-sm font-bold text-rose-700">{item.value}</span>
                  {idx === 0 && <span className="text-[9px] text-rose-600 font-semibold">Front</span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Frequency Hash Map Ribbon */}
      {hasFreqMap && (
        <div>
          <div className="flex items-center justify-between text-xs pb-1.5 mb-2 border-b border-slate-100">
            <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-600" />
              <span>Window Frequency Hash Map</span>
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {Object.keys(step.frequencyMap!).length} active keys
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {Object.entries(step.frequencyMap!).map(([key, count]) => {
              const reqCount = step.requiredFrequencyMap?.[key];
              const isSatisfied = reqCount !== undefined && count >= reqCount;
              const isDuplicate = count > 1 && problem.id === 'longest-substring-no-repeat';

              return (
                <div
                  key={key}
                  className={`px-2.5 py-1 rounded-md border font-mono text-xs flex items-center space-x-1.5 transition-all ${
                    isDuplicate
                      ? 'bg-rose-100 border-rose-300 text-rose-900 font-bold'
                      : isSatisfied
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                      : reqCount !== undefined
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <span className="font-bold text-slate-900">'{key}'</span>
                  <span className="text-slate-400">:</span>
                  <span className="font-bold">{count}</span>
                  {reqCount !== undefined && (
                    <span className="text-[10px] text-slate-500">
                      / {reqCount} req
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
