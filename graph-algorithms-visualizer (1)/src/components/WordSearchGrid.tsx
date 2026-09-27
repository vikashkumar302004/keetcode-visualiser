import React from 'react';
import { ExecutionStep } from '../types';
import { RefreshCw, CheckCircle2, XCircle, Search, Compass } from 'lucide-react';

interface WordSearchGridProps {
  currentStep?: ExecutionStep;
  board: string[][];
  targetWord: string;
  onUpdateBoard: (newBoard: string[][]) => void;
  onUpdateTargetWord: (newWord: string) => void;
  onResetBoard: () => void;
  onLoadPreset: (preset: 'ABCCED' | 'SEE' | 'ABCB') => void;
}

export const WordSearchGrid: React.FC<WordSearchGridProps> = ({
  currentStep,
  board,
  targetWord,
  onUpdateBoard,
  onUpdateTargetWord,
  onResetBoard,
  onLoadPreset
}) => {
  const state = currentStep?.wordSearchState;
  const activeBoard = state?.board || board;
  const word = (state?.targetWord || targetWord).toUpperCase();
  const matchedIndex = state?.matchedIndex ?? 0;
  const currentCell = state?.currentCell;
  const path = state?.path || [];
  const isFound = state?.found === true;
  const isFailed = state?.found === false;

  const isCellInPath = (r: number, c: number) => {
    return path.findIndex(([pr, pc]) => pr === r && pc === c);
  };

  const isCurrentCell = (r: number, c: number) => {
    return currentCell && currentCell[0] === r && currentCell[1] === c;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-3 sm:p-4 bg-[#fbfbfa] rounded-xl border border-stone-200 select-none overflow-y-auto">
      {/* Top Header & Quick Presets */}
      <div className="flex flex-wrap items-center justify-between w-full max-w-xl mb-2 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">🔤</span>
          <span className="text-xs font-bold text-stone-800 tracking-tight">
            Word Search 2D Backtracking
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 font-mono font-bold">
            LeetCode 79
          </span>
        </div>

        {/* Quick Test Words */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-stone-500 hidden sm:inline">Target:</span>
          <button
            onClick={() => onLoadPreset('ABCCED')}
            className={`text-[11px] px-2 py-0.5 border rounded font-mono font-semibold transition-colors ${
              word === 'ABCCED' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
            title="Standard LeetCode Ex 1 (Returns true)"
          >
            "ABCCED"
          </button>
          <button
            onClick={() => onLoadPreset('SEE')}
            className={`text-[11px] px-2 py-0.5 border rounded font-mono font-semibold transition-colors ${
              word === 'SEE' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
            title="LeetCode Ex 2 (Returns true)"
          >
            "SEE"
          </button>
          <button
            onClick={() => onLoadPreset('ABCB')}
            className={`text-[11px] px-2 py-0.5 border rounded font-mono font-semibold transition-colors ${
              word === 'ABCB' ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
            title="LeetCode Ex 3 (Returns false, cell cannot be reused)"
          >
            "ABCB"
          </button>
          <button
            onClick={onResetBoard}
            className="text-[11px] p-1 bg-white border border-stone-200 rounded hover:bg-stone-100 text-stone-600 transition-colors"
            title="Reset Board"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Word Ribbon */}
      <div className="w-full max-w-xl bg-white border border-stone-200/90 rounded-lg p-2.5 shadow-2xs mb-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-stone-500" />
          <span className="text-xs font-semibold text-stone-600">Target Word:</span>
          <div className="flex items-center gap-1">
            {word.split('').map((char, i) => {
              const isMatched = i < matchedIndex;
              const isCurrent = i === matchedIndex && !isFound && !isFailed;
              return (
                <div
                  key={i}
                  className={`w-7 h-7 rounded flex items-center justify-center font-mono font-bold text-xs transition-all ${
                    isFound
                      ? 'bg-emerald-500 text-white shadow-xs scale-105'
                      : isMatched
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-amber-100 text-amber-900 border-2 border-amber-500 animate-pulse'
                      : 'bg-stone-100 text-stone-600 border border-stone-200'
                  }`}
                >
                  {char}
                </div>
              );
            })}
          </div>
        </div>

        {/* Status Badge */}
        <div>
          {isFound ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              exist = true
            </span>
          ) : isFailed ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-100 text-rose-900 text-xs font-bold border border-rose-300">
              <XCircle className="w-3.5 h-3.5 text-rose-600" />
              exist = false
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[11px] font-mono border border-stone-200">
              <Compass className="w-3 h-3 text-stone-400" />
              Progress: {matchedIndex} / {word.length}
            </span>
          )}
        </div>
      </div>

      {/* 2D Board Grid */}
      <div className="flex-1 flex items-center justify-center w-full my-auto">
        <div
          className="grid gap-2 p-3 bg-stone-100/80 rounded-xl border border-stone-300/80 shadow-inner"
          style={{
            gridTemplateColumns: `repeat(${activeBoard[0].length}, minmax(0, 1fr))`
          }}
        >
          {activeBoard.map((row, r) =>
            row.map((char, c) => {
              const pathIdx = isCellInPath(r, c);
              const isInPath = pathIdx !== -1;
              const isCurr = isCurrentCell(r, c);

              let cellStyle = 'bg-white text-stone-800 border-stone-200 hover:border-stone-400 shadow-2xs';
              if (isFound && isInPath) {
                cellStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md ring-2 ring-emerald-300 scale-105';
              } else if (isInPath) {
                cellStyle = 'bg-indigo-600 text-white border-indigo-700 shadow-md ring-2 ring-indigo-300 scale-105';
              } else if (isCurr) {
                cellStyle = 'bg-amber-100 text-amber-900 border-amber-500 ring-2 ring-amber-300 animate-pulse';
              }

              return (
                <div
                  key={`${r}-${c}`}
                  className={`w-14 h-14 sm:w-16 sm:h-16 flex flex-col items-center justify-center rounded-lg font-mono font-bold text-lg sm:text-xl border-2 transition-all relative cursor-pointer ${cellStyle}`}
                  title={`Cell [${r}, ${c}] = '${char}'`}
                >
                  <span>{char}</span>
                  {isInPath && (
                    <span
                      className={`absolute bottom-0.5 right-1 text-[9px] font-mono px-1 rounded ${
                        isFound ? 'bg-emerald-700/80 text-white' : 'bg-indigo-800/80 text-white'
                      }`}
                    >
                      #{pathIdx + 1}
                    </span>
                  )}
                  <span className="absolute top-0.5 left-1 text-[8px] opacity-40 font-mono">
                    {r},{c}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Legend & Instructions */}
      <div className="w-full max-w-xl mt-3 pt-2 border-t border-stone-200 flex flex-wrap items-center justify-between text-[11px] text-stone-600 gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-indigo-600 inline-block" />
            <span>Active Path (DFS)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block" />
            <span>Candidate Cell</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
            <span>Found Match</span>
          </div>
        </div>
        <span className="text-[10px] text-stone-500">
          Explores Up/Down/Left/Right • Backtracks if dead end
        </span>
      </div>
    </div>
  );
};
