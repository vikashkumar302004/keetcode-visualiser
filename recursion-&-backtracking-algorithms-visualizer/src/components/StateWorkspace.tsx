import React from 'react';
import { ProblemId, SimulationStep } from '../types';
import { HelpCircle, Layers, Shield, Sparkles } from 'lucide-react';

interface StateWorkspaceProps {
  problemId: ProblemId;
  activeStep: SimulationStep | null;
}

export default function StateWorkspace({ problemId, activeStep }: StateWorkspaceProps) {
  if (!activeStep) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 font-sans text-xs p-6 border border-slate-200 bg-white rounded-lg min-h-[220px]">
        No active state visualizer. Run simulation to begin.
      </div>
    );
  }

  const { boardState, currentPath, solutions } = activeStep;

  // ==========================================
  // RENDERER 1: Tower of Hanoi
  // ==========================================
  if (problemId === 'tower_of_hanoi' && boardState?.hanoi) {
    const { pegs, moveCount } = boardState.hanoi;
    const diskColors = ['bg-emerald-400', 'bg-sky-400', 'bg-amber-400', 'bg-rose-400'];

    return (
      <div className="flex flex-col h-full border border-slate-200 bg-white rounded-lg p-4 justify-between min-h-[240px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Hanoi Rods & Disks</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            Move Count: <strong className="text-slate-800">{moveCount}</strong>
          </span>
        </div>

        {/* Pegs Arena */}
        <div className="flex-1 flex justify-around items-end pt-8 pb-3 relative min-h-[140px]">
          {(['A', 'B', 'C'] as const).map((pegKey) => {
            const disksOnPeg = pegs[pegKey] || [];
            return (
              <div key={pegKey} className="relative flex flex-col items-center w-28 h-28">
                {/* Peg Shaft */}
                <div className="absolute bottom-0 w-2 h-24 bg-slate-300 rounded-t-full" />

                {/* Disks stacked bottom to top */}
                <div className="absolute bottom-0 flex flex-col-reverse items-center w-full">
                  {disksOnPeg.map((diskVal, dIdx) => {
                    const widthPercent = 30 + diskVal * 15; // variable width depending on disk value
                    const colorClass = diskColors[(diskVal - 1) % diskColors.length];
                    return (
                      <div
                        key={`${pegKey}-${diskVal}`}
                        className={`h-4 rounded-sm border border-slate-800/20 text-[9px] font-mono font-bold text-white flex items-center justify-center shadow-sm transition-all duration-300 ${colorClass}`}
                        style={{ width: `${widthPercent}%` }}
                      >
                        {diskVal}
                      </div>
                    );
                  })}
                </div>

                {/* Peg Base Label */}
                <div className="absolute -bottom-5 text-xs font-mono font-bold text-slate-600">
                  Peg {pegKey}
                </div>
              </div>
            );
          })}
        </div>

        {/* Base Floor */}
        <div className="h-2 bg-slate-400 rounded-full w-full mt-4" />
      </div>
    );
  }

  // ==========================================
  // RENDERER 2: N-Queens Chessboard
  // ==========================================
  if (problemId === 'n_queens' && boardState?.queens) {
    const { size, queens, conflicts, trialCell } = boardState.queens;

    return (
      <div className="flex flex-col h-full border border-slate-200 bg-white rounded-lg p-3 justify-between min-h-[240px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <Shield className="w-4 h-4 text-slate-700" />
            <span>N-Queens Conflict Safety Array</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span>Queens: {queens.length}/{size}</span>
          </div>
        </div>

        {/* Checkerboard Grid */}
        <div className="flex-1 flex items-center justify-center py-2">
          <div
            className="grid border border-slate-300 shadow-sm"
            style={{
              gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
              width: `${size * 42}px`,
              height: `${size * 42}px`,
            }}
          >
            {Array.from({ length: size }).map((_, r) =>
              Array.from({ length: size }).map((_, c) => {
                const isDark = (r + c) % 2 === 1;
                const hasQueen = queens.some((q) => q.row === r && q.col === c);

                const colBlocked = conflicts.cols.has(c);
                const d1Blocked = conflicts.diag1.has(r - c);
                const d2Blocked = conflicts.diag2.has(r + c);
                const isConflictCell = colBlocked || d1Blocked || d2Blocked;

                // Check if trial cell
                const isTrial = trialCell && trialCell.row === r && trialCell.col === c;
                const trialValid = trialCell?.valid;

                let cellBg = isDark ? 'bg-amber-100/40' : 'bg-white';
                let cellBorder = 'border-slate-200';

                if (hasQueen) {
                  cellBg = 'bg-amber-500/10 text-amber-900';
                  cellBorder = 'border-amber-400';
                } else if (isTrial) {
                  cellBg = trialValid ? 'bg-emerald-100/50' : 'bg-rose-100/50';
                  cellBorder = trialValid ? 'border-emerald-500 border-2' : 'border-rose-500 border-2';
                } else if (isConflictCell) {
                  cellBg = isDark ? 'bg-rose-50/50' : 'bg-rose-50/20';
                }

                return (
                  <div
                    key={`cell-${r}-${c}`}
                    className={`relative border flex items-center justify-center transition-all duration-200 ${cellBg} ${cellBorder}`}
                  >
                    {hasQueen && (
                      <span className="text-xl select-none" role="img" aria-label="queen">
                        👑
                      </span>
                    )}

                    {isTrial && !hasQueen && (
                      <div className={`text-[10px] font-mono font-bold ${trialValid ? 'text-emerald-700 animate-pulse' : 'text-rose-600 line-through'}`}>
                        {trialValid ? 'Safe' : 'X'}
                      </div>
                    )}

                    {/* Show row-col index tiny */}
                    <span className="absolute bottom-0.5 right-0.5 text-[7px] font-mono text-slate-300">
                      {r},{c}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDERER 3: Sudoku Board
  // ==========================================
  if (problemId === 'sudoku_solver' && boardState?.sudoku) {
    const { grid, original, conflictCell } = boardState.sudoku;

    return (
      <div className="flex flex-col h-full border border-slate-200 bg-white rounded-lg p-3 justify-between min-h-[240px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>4×4 Sudoku Grid Sandbox</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Heavy borders denote 2×2 quadrants
          </span>
        </div>

        {/* 4x4 Grid Board */}
        <div className="flex-1 flex items-center justify-center py-2">
          <div className="grid grid-cols-4 border-2 border-slate-800 shadow-sm w-44 h-44">
            {grid.map((row, r) =>
              row.map((val, c) => {
                const isClue = original[r][c];
                const isConflict = conflictCell && conflictCell.row === r && conflictCell.col === c;

                // Dynamic border classes to delineate 2x2 quadrants
                const borderBottom = (r === 1) ? 'border-b-2 border-b-slate-800' : 'border-b border-b-slate-200';
                const borderRight = (c === 1) ? 'border-r-2 border-r-slate-800' : 'border-r border-r-slate-200';

                return (
                  <div
                    key={`sudoku-${r}-${c}`}
                    className={`flex items-center justify-center font-mono text-sm font-bold transition-all duration-150 ${borderBottom} ${borderRight} ${
                      isClue
                        ? 'bg-slate-100 text-slate-800'
                        : isConflict
                        ? 'bg-rose-100 text-rose-800 animate-shake'
                        : val !== 0
                        ? 'bg-amber-50 text-amber-700 animate-pulse'
                        : 'bg-white'
                    }`}
                  >
                    {val !== 0 ? val : ''}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDERER 4: 2D Grid DFS (Word Search / Rat in Maze)
  // ==========================================
  if ((problemId === 'word_search' || problemId === 'rat_in_maze') && boardState?.grid2d) {
    const { grid, rows, cols, path, visited, targetX, targetY } = boardState.grid2d;

    return (
      <div className="flex flex-col h-full border border-slate-200 bg-white rounded-lg p-3 justify-between min-h-[240px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <Layers className="w-4 h-4 text-slate-600" />
            <span>
              {problemId === 'word_search' ? '2D Word Grid (3×4)' : 'Rat Pathway Maze (4×4)'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {problemId === 'word_search' ? '4-Directional DFS Match' : 'Source (0,0) → Destination (3,3)'}
          </span>
        </div>

        {/* 2D Grid display */}
        <div className="flex-1 flex items-center justify-center py-2">
          <div
            className="grid border border-slate-300 gap-1 p-1 bg-slate-50 rounded"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              width: `${cols * 44}px`,
              height: `${rows * 44}px`,
            }}
          >
            {grid.map((row, r) =>
              row.map((val, c) => {
                const isVisited = visited[r][c];
                const isPathEnd = path.length > 0 && path[path.length - 1][0] === r && path[path.length - 1][1] === c;
                const isDestination = targetX === c && targetY === r;

                let cellClass = 'bg-white border-slate-200 text-slate-700';
                if (isVisited) {
                  cellClass = 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-1 ring-emerald-300';
                }
                if (isPathEnd) {
                  cellClass = 'bg-amber-100 border-amber-500 text-amber-900 font-bold scale-105 z-10 animate-bounce';
                }
                if (problemId === 'rat_in_maze' && val === '█') {
                  cellClass = 'bg-slate-800 border-slate-900 text-slate-200 font-bold';
                }

                return (
                  <div
                    key={`grid-${r}-${c}`}
                    className={`relative border rounded flex items-center justify-center font-mono text-sm transition-all duration-200 shadow-sm ${cellClass}`}
                  >
                    {/* Render character or maze elements */}
                    {problemId === 'rat_in_maze' ? (
                      val === '●' ? (
                        <span className="text-amber-500 text-base animate-pulse">🐀</span>
                      ) : isDestination ? (
                        <span className="text-emerald-600 text-base">🧀</span>
                      ) : (
                        val
                      )
                    ) : (
                      val
                    )}

                    {/* Step path index tiny counter */}
                    {isVisited && (
                      <span className="absolute top-0.5 left-0.5 text-[8px] font-bold text-emerald-700 leading-none">
                        {path.findIndex((coord) => coord[0] === r && coord[1] === c) + 1}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // DEFAULT / RENDERER 5: Path Accumulator Tray (Subsets / Sums / Combinations)
  // ==========================================
  return (
    <div className="flex flex-col h-full border border-slate-200 bg-white rounded-lg p-4 justify-between min-h-[240px]">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
          <Layers className="w-4 h-4 text-amber-600" />
          <span>Combinatorial Path State Tray</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          curr accumulator path size: {currentPath.length}
        </span>
      </div>

      {/* Path Tray representation */}
      <div className="flex-1 flex flex-col justify-center items-center py-4">
        {currentPath.length === 0 ? (
          <div className="text-center p-4 border-2 border-dashed border-slate-200 rounded-lg w-full max-w-sm text-slate-400">
            <p className="text-xs font-mono">Path: [ empty ]</p>
            <p className="text-[10px] text-slate-400 mt-1">
              Currently choosing "skip" or popping state during backtracking.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 items-center justify-center max-w-md">
            {currentPath.map((item, idx) => {
              const isLast = idx === currentPath.length - 1;
              return (
                <div key={`${item}-${idx}`} className="flex items-center">
                  <div
                    className={`px-3 py-1.5 rounded border font-mono text-xs font-bold shadow-sm transition-all duration-300 ${
                      isLast
                        ? 'bg-amber-100 border-amber-400 text-amber-900 animate-pulse scale-105'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {item}
                  </div>
                  {idx < currentPath.length - 1 && (
                    <span className="mx-1 text-slate-300 font-bold">→</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmed solutions ticker preview */}
      <div className="border-t border-slate-100 pt-2">
        <span className="text-[10px] text-slate-500 block mb-1 font-sans">
          Accumulated Solutions Count: <strong className="text-slate-800">{solutions.length}</strong>
        </span>
        <div className="flex gap-1.5 overflow-x-auto py-1 max-w-full scrollbar-none whitespace-nowrap text-[10px] font-mono text-slate-600">
          {solutions.length === 0 ? (
            <span className="text-slate-400 italic">None registered yet</span>
          ) : (
            solutions.slice(-4).map((sol, index) => {
              const formatted = Array.isArray(sol)
                ? `[${sol.map(row => Array.isArray(row) ? `[${row.join(',')}]` : row).join(',')}]`
                : typeof sol === 'string'
                ? `"${sol}"`
                : JSON.stringify(sol);

              return (
                <div
                  key={index}
                  className="bg-emerald-50 text-emerald-800 border border-emerald-100 px-1.5 py-0.5 rounded"
                  title={formatted}
                >
                  {formatted.length > 25 ? `${formatted.substring(0, 25)}...` : formatted}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
