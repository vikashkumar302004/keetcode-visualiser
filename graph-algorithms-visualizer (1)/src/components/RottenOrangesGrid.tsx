import React from 'react';
import { ExecutionStep } from '../types';
import { RefreshCw, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RottenOrangesGridProps {
  currentStep?: ExecutionStep;
  grid: number[][];
  onUpdateGrid: (newGrid: number[][]) => void;
  onResetGrid: () => void;
  onLoadPresetScenario: (scenario: 'wave' | 'isolated' | 'dual') => void;
}

export const RottenOrangesGrid: React.FC<RottenOrangesGridProps> = ({
  currentStep,
  grid,
  onUpdateGrid,
  onResetGrid,
  onLoadPresetScenario
}) => {
  const activeGrid = currentStep?.gridState?.grid || grid;
  const activeCell = currentStep?.gridState?.activeCell;
  const minutesElapsed = currentStep?.gridState?.minutesElapsed ?? 0;
  const freshRemaining = currentStep?.gridState?.freshRemaining ?? countFresh(activeGrid);
  const isImpossible = currentStep?.gridState?.impossible ?? false;
  const isComplete = currentStep?.phase === 'Complete' && freshRemaining === 0;

  function countFresh(g: number[][]) {
    let cnt = 0;
    for (const r of g) {
      for (const v of r) {
        if (v === 1) cnt++;
      }
    }
    return cnt;
  }

  function countRotten(g: number[][]) {
    let cnt = 0;
    for (const r of g) {
      for (const v of r) {
        if (v === 2) cnt++;
      }
    }
    return cnt;
  }

  const rottenCount = countRotten(activeGrid);

  const handleCellClick = (r: number, c: number) => {
    // Cycle: 0 (empty) -> 1 (fresh) -> 2 (rotten) -> 0
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = (newGrid[r][c] + 1) % 3;
    onUpdateGrid(newGrid);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-3 sm:p-4 bg-[#fbfbfa] rounded-xl border border-stone-200 select-none overflow-y-auto">
      {/* Top Status and Presets Bar */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-xl mb-2 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">🍊</span>
          <span className="text-xs font-bold text-stone-800 tracking-tight">
            Rotting Oranges Simulator
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 font-mono font-bold">
            LeetCode 994
          </span>
        </div>

        {/* Quick Scenario Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onLoadPresetScenario('wave')}
            className="text-[11px] px-2 py-0.5 bg-white border border-stone-200 rounded hover:bg-stone-100 text-stone-700 font-medium transition-colors"
            title="Load standard solvable multi-source spread"
          >
            Wave
          </button>
          <button
            onClick={() => onLoadPresetScenario('isolated')}
            className="text-[11px] px-2 py-0.5 bg-white border border-stone-200 rounded hover:bg-rose-50 hover:text-rose-700 text-stone-700 font-medium transition-colors"
            title="Load scenario with trapped fresh orange (returns -1)"
          >
            Trap (-1)
          </button>
          <button
            onClick={() => onLoadPresetScenario('dual')}
            className="text-[11px] px-2 py-0.5 bg-white border border-stone-200 rounded hover:bg-stone-100 text-stone-700 font-medium transition-colors"
            title="Load dual corner outbreak"
          >
            Dual Corner
          </button>
          <button
            onClick={onResetGrid}
            className="text-[11px] p-1 bg-white border border-stone-200 rounded hover:bg-stone-100 text-stone-600 transition-colors"
            title="Reset Grid"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Real-time telemetry badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 w-full max-w-xl mb-3 py-1.5 px-3 bg-white rounded-lg border border-stone-200 text-xs shadow-2xs">
        <div className="flex items-center gap-1.5 font-semibold text-stone-800">
          <span className="text-amber-500 font-bold">⏱️ Time:</span>
          <span className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-900 font-bold">
            {minutesElapsed} min{minutesElapsed === 1 ? '' : 's'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 font-semibold text-stone-700">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          <span>Fresh:</span>
          <span className="font-mono text-amber-700 font-bold">{freshRemaining}</span>
        </div>

        <div className="flex items-center gap-1.5 font-semibold text-stone-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-800 inline-block" />
          <span>Rotten:</span>
          <span className="font-mono text-emerald-800 font-bold">{rottenCount}</span>
        </div>

        {isImpossible && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            <span>Impossible (-1)</span>
          </div>
        )}

        {isComplete && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            <span>All Rotted ({minutesElapsed}m)</span>
          </div>
        )}
      </div>

      {/* The 2D Orange Matrix Grid */}
      <div className="grid grid-cols-8 gap-1.5 p-2.5 sm:p-3 bg-white rounded-xl border border-stone-200 shadow-xs max-w-lg w-full">
        {activeGrid.map((row, r) =>
          row.map((val, c) => {
            const isActive = activeCell && activeCell[0] === r && activeCell[1] === c;

            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                className={`relative aspect-square flex flex-col items-center justify-center rounded-lg border text-xs cursor-pointer transition-all duration-150 ${
                  isActive
                    ? 'ring-4 ring-amber-400/80 scale-105 z-20 shadow-md'
                    : 'hover:scale-[1.02]'
                } ${
                  val === 2
                    ? 'bg-emerald-800/90 border-emerald-950 text-emerald-100 shadow-2xs'
                    : val === 1
                    ? 'bg-amber-100/90 border-amber-300 text-amber-950 hover:bg-amber-200/90'
                    : 'bg-stone-50/80 border-stone-200 text-stone-400 hover:bg-stone-100'
                }`}
                title={`Cell (${r}, ${c}): ${
                  val === 2 ? 'Rotten Orange (2)' : val === 1 ? 'Fresh Orange (1)' : 'Empty Cell (0)'
                }. Click to toggle.`}
              >
                {val === 2 ? (
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-sm">🧟</span>
                    <span className="text-[9px] font-mono font-bold text-emerald-200 mt-0.5">2</span>
                  </div>
                ) : val === 1 ? (
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-sm">🍊</span>
                    <span className="text-[9px] font-mono font-bold text-amber-900 mt-0.5">1</span>
                  </div>
                ) : (
                  <span className="text-[10px] font-mono text-stone-300">·</span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Legend and Interaction hint */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mt-3 text-[11px] text-stone-600 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-300 flex items-center justify-center text-[10px]">🍊</span>
          <span>1 = Fresh Orange</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-emerald-800 border border-emerald-950 flex items-center justify-center text-[10px]">🧟</span>
          <span>2 = Rotten Orange</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-stone-100 border border-stone-200 flex items-center justify-center text-[9px] text-stone-400">·</span>
          <span>0 = Empty Space</span>
        </div>
      </div>

      <p className="text-[10px] text-stone-400 mt-1 text-center">
        Left-click any cell to cycle Empty → Fresh → Rotten • Hit Play to simulate Multi-Source BFS
      </p>
    </div>
  );
};
