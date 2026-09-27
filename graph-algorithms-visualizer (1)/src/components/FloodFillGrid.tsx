import React from 'react';
import { ExecutionStep } from '../types';
import { Palette, RefreshCw, Layers } from 'lucide-react';

interface FloodFillGridProps {
  currentStep?: ExecutionStep;
  grid: number[][];
  onUpdateGrid: (newGrid: number[][]) => void;
  startCell: [number, number];
  onSetStartCell: (cell: [number, number]) => void;
  onResetGrid: () => void;
}

export const FloodFillGrid: React.FC<FloodFillGridProps> = ({
  currentStep,
  grid,
  onUpdateGrid,
  startCell,
  onSetStartCell,
  onResetGrid
}) => {
  const activeGrid = currentStep?.gridState?.grid || grid;
  const activeCell = currentStep?.gridState?.activeCell;
  const targetColor = currentStep?.gridState?.targetColor ?? 2;
  const replacementColor = currentStep?.gridState?.replacementColor ?? 3;

  const handleCellClick = (r: number, c: number) => {
    // If not running, allow toggling cell value: 0 (empty) -> 1 (wall) -> 2 (target color) -> 0
    const newGrid = grid.map(row => [...row]);
    newGrid[r][c] = (newGrid[r][c] + 1) % 3;
    onUpdateGrid(newGrid);
  };

  const handleSetSeed = (r: number, c: number, e: React.MouseEvent) => {
    e.preventDefault();
    onSetStartCell([r, c]);
  };

  const getCellColor = (val: number, r: number, c: number) => {
    const isStart = startCell[0] === r && startCell[1] === c;
    const isActive = activeCell && activeCell[0] === r && activeCell[1] === c;

    if (isActive) {
      return 'bg-amber-400 border-amber-600 text-stone-900 ring-4 ring-amber-300/60 scale-105 z-20';
    }

    if (val === 1) {
      // Wall / Obstacle
      return 'bg-stone-800 border-stone-900 text-stone-300';
    }
    if (val === 2) {
      // Original Target Color
      return 'bg-sky-100 border-sky-300 text-sky-800';
    }
    if (val === 3) {
      // Repainted / Flooded Color
      return 'bg-emerald-500 border-emerald-600 text-white shadow-xs';
    }
    // Empty background
    return 'bg-stone-50 border-stone-200 text-stone-400 hover:bg-stone-100';
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#fbfbfa] rounded-xl border border-stone-200">
      {/* Flood Fill Controls Header */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-md mb-4 gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
          <Palette className="w-4 h-4 text-emerald-600" />
          <span>2D Matrix Grid (6 × 8)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetGrid}
            className="flex items-center gap-1 text-xs px-2.5 py-1 bg-white border border-stone-200 rounded-md hover:bg-stone-100 text-stone-600 font-medium transition-colors"
            title="Reset Grid Layout"
          >
            <RefreshCw className="w-3 h-3" />
            Reset Grid
          </button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="grid grid-cols-8 gap-1.5 p-3 bg-white rounded-xl border border-stone-200 shadow-xs max-w-md w-full">
        {activeGrid.map((row, r) =>
          row.map((val, c) => {
            const isStart = startCell[0] === r && startCell[1] === c;
            return (
              <div
                key={`${r}-${c}`}
                onClick={() => handleCellClick(r, c)}
                onContextMenu={e => handleSetSeed(r, c, e)}
                className={`relative aspect-square flex items-center justify-center rounded-lg border text-xs font-mono font-bold cursor-pointer transition-all duration-150 ${getCellColor(
                  val,
                  r,
                  c
                )}`}
                title={`Cell (${r}, ${c}): Value ${val}. Right click to set as start seed.`}
              >
                {isStart && (
                  <span className="absolute -top-1.5 -right-1.5 px-1 bg-stone-900 text-[8px] font-extrabold text-white rounded-full">
                    S
                  </span>
                )}
                <span>{val === 1 ? '#' : val}</span>
              </div>
            );
          })
        )}
      </div>

      {/* Grid Legend & Instructions */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[11px] text-stone-500 font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-sky-100 border border-sky-300 inline-block" />
          <span>Target Color (2)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600 inline-block" />
          <span>Flooded (3)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-stone-800 border border-stone-900 inline-block" />
          <span>Wall (#)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-600 inline-block" />
          <span>Active Cell</span>
        </div>
      </div>
      <p className="text-[10px] text-stone-400 mt-2 text-center">
        Left-click cell to toggle type • Right-click to set Seed Cell [S]
      </p>
    </div>
  );
};
