import React from 'react';
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw, Cpu, Layers } from 'lucide-react';
import { QueueProblem } from '../types';
import { QUEUE_PROBLEMS } from '../data/queueProblems';

interface HeaderProps {
  currentProblem: QueueProblem;
  onSelectProblem: (id: string) => void;
  capacity: number;
  onCapacityChange: (cap: number) => void;
  onRandomFill: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProblem,
  onSelectProblem,
  capacity,
  onCapacityChange,
  onRandomFill,
  onReset,
}) => {
  const currentIndex = QUEUE_PROBLEMS.findIndex((p) => p.id === currentProblem.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectProblem(QUEUE_PROBLEMS[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUEUE_PROBLEMS.length - 1) {
      onSelectProblem(QUEUE_PROBLEMS[currentIndex + 1].id);
    }
  };

  const hasCapacitySelector = ['01', '02', '03'].includes(currentProblem.id);
  const hasRandomFill = !['04', '05', '09', '12', '13', '14'].includes(currentProblem.id);

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 text-slate-100 border-b border-slate-800 shadow-sm px-4 py-2 flex items-center justify-between font-sans">
      {/* Branding */}
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 bg-amber-500 rounded-lg text-slate-950 flex items-center justify-center">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
            Queue & Deque <span className="text-amber-400 font-normal text-xs px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">Visualizer</span>
          </h1>
          <p className="text-[10px] text-slate-400">Interactive Algorithms Playground</p>
        </div>
      </div>

      {/* Prominent Sequence Dropdown */}
      <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-1 border border-slate-700">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition"
          title="Previous Algorithm"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <select
          value={currentProblem.id}
          onChange={(e) => onSelectProblem(e.target.value)}
          className="bg-slate-900 text-amber-400 text-xs font-semibold px-3 py-1.5 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500 max-w-[280px] cursor-pointer"
        >
          {Array.from(new Set(QUEUE_PROBLEMS.map((p) => p.category))).map((cat) => (
            <optgroup
              key={cat}
              label={cat}
              className="text-slate-400 bg-slate-900 font-bold text-[11px] uppercase tracking-wider not-italic"
            >
              {QUEUE_PROBLEMS.filter((p) => p.category === cat).map((prob) => (
                <option
                  key={prob.id}
                  value={prob.id}
                  className="text-slate-100 bg-slate-900 font-sans not-italic font-semibold text-xs normal-case"
                >
                  #{String(prob.sequenceNum).padStart(2, '0')}: {prob.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <button
          onClick={handleNext}
          disabled={currentIndex === QUEUE_PROBLEMS.length - 1}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition"
          title="Next Algorithm"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Queue Configuration Tools */}
      <div className="flex items-center gap-3">
        {/* Capacity Selector (Only relevant for bounded queues) */}
        {hasCapacitySelector && (
          <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
            <span className="text-[11px] font-medium text-slate-300">Slots:</span>
            <select
              value={capacity}
              onChange={(e) => onCapacityChange(Number(e.target.value))}
              className="bg-slate-900 text-amber-400 text-xs font-bold rounded px-1.5 py-0.5 focus:outline-none border border-slate-700 cursor-pointer"
            >
              {[5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {hasRandomFill && (
            <button
              onClick={onRandomFill}
              className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 bg-slate-800 text-slate-200 rounded hover:bg-slate-700 border border-slate-700 transition"
              title="Populate random test case values"
            >
              <Shuffle className="w-3.5 h-3.5 text-amber-400" />
              <span>Random</span>
            </button>
          )}

          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1.5 bg-slate-800 text-slate-200 rounded hover:bg-slate-700 border border-slate-700 transition"
            title="Reset current simulation state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
