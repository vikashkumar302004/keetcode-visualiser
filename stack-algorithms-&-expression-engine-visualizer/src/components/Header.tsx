import React from 'react';
import { Layers, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { Problem, ProblemId } from '../types';
import { STACK_PROBLEMS } from '../data/stackProblems';

interface HeaderProps {
  currentProblem: Problem;
  onProblemSelect: (problemId: ProblemId) => void;
  onCustomPush: (val: string) => void;
  onCustomPop: () => void;
  onCustomClear: () => void;
  customActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentProblem,
  onProblemSelect,
  onCustomPush,
  onCustomPop,
  onCustomClear,
  customActive,
}) => {
  const [customVal, setCustomVal] = React.useState('');

  const currentIndex = STACK_PROBLEMS.findIndex((p) => p.id === currentProblem.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onProblemSelect(STACK_PROBLEMS[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < STACK_PROBLEMS.length - 1) {
      onProblemSelect(STACK_PROBLEMS[currentIndex + 1].id);
    }
  };

  const handlePushSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customVal.trim()) {
      onCustomPush(customVal.trim());
      setCustomVal('');
    }
  };

  return (
    <header className="h-14 border-b border-slate-200 bg-[#FAF9F6] px-4 flex items-center justify-between shrink-0 select-none">
      {/* App Branding */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-200 flex items-center justify-center text-amber-800">
          <Layers className="w-4.5 h-4.5 stroke-[2.25]" />
        </div>
        <div>
          <h1 className="font-serif text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5 leading-none">
            Stack Expression Engine
            <span className="font-sans text-[10px] tracking-wider uppercase font-semibold text-amber-800 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-200/40">
              Interactive
            </span>
          </h1>
          <span className="text-[10px] text-slate-500 font-sans tracking-tight">Multi-Algorithm Visual Sandbox</span>
        </div>
      </div>

      {/* Center Prominent Sequence Dropdown */}
      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-1.5 rounded-md hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
          title="Previous problem"
          id="prev-prob-btn"
        >
          <ChevronLeft className="w-4.5 h-4.5" />
        </button>

        <select
          value={currentProblem.id}
          onChange={(e) => onProblemSelect(e.target.value as ProblemId)}
          className="font-sans text-xs font-semibold text-slate-800 bg-transparent py-1 px-2 pr-8 border-0 focus:ring-0 cursor-pointer text-center"
          id="problem-select-dropdown"
        >
          <optgroup label="📂 Stack Foundations & Dual Structures" className="text-slate-500 font-bold bg-white text-left">
            {STACK_PROBLEMS.filter(p => Number(p.seq) <= 4).map((p) => (
              <option key={p.id} value={p.id} className="text-slate-800 font-sans">
                #{p.seq}: {p.title} ({p.leetcode !== 'N/A' ? p.leetcode : 'Foundations'})
              </option>
            ))}
          </optgroup>
          <optgroup label="🧮 Expression Conversions & Evaluations" className="text-slate-500 font-bold bg-white text-left">
            {STACK_PROBLEMS.filter(p => Number(p.seq) >= 5 && Number(p.seq) <= 11).map((p) => (
              <option key={p.id} value={p.id} className="text-slate-800 font-sans">
                #{p.seq}: {p.title} ({p.leetcode !== 'N/A' ? p.leetcode : 'Foundations'})
              </option>
            ))}
          </optgroup>
          <optgroup label="📈 Monotonic Stack Patterns" className="text-slate-500 font-bold bg-white text-left">
            {STACK_PROBLEMS.filter(p => Number(p.seq) >= 12).map((p) => (
              <option key={p.id} value={p.id} className="text-slate-800 font-sans">
                #{p.seq}: {p.title} ({p.leetcode !== 'N/A' ? p.leetcode : 'Foundations'})
              </option>
            ))}
          </optgroup>
        </select>

        <button
          onClick={handleNext}
          disabled={currentIndex === STACK_PROBLEMS.length - 1}
          className="p-1.5 rounded-md hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
          title="Next problem"
          id="next-prob-btn"
        >
          <ChevronRight className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Stack Tools Area */}
      <div className="flex items-center gap-2">
        {customActive && (
          <div className="flex items-center gap-1.5 bg-amber-50/65 border border-amber-200/50 rounded-lg px-2 py-0.5 animate-pulse">
            <span className="text-[10px] font-sans text-amber-800 font-medium">Custom Sandbox Active</span>
          </div>
        )}

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
          <form onSubmit={handlePushSubmit} className="flex items-center">
            <input
              type="text"
              placeholder="Custom item..."
              value={customVal}
              onChange={(e) => setCustomVal(e.target.value)}
              className="w-24 px-2 py-1 text-xs font-mono bg-transparent border-0 focus:ring-0 focus:outline-hidden"
              id="custom-push-input"
            />
            <button
              type="submit"
              className="text-[11px] font-sans font-bold bg-slate-800 hover:bg-slate-700 text-white px-2 py-1 rounded transition-colors"
              id="custom-push-btn"
            >
              Push
            </button>
          </form>

          <div className="w-px h-5 bg-slate-200 mx-1"></div>

          <button
            onClick={onCustomPop}
            className="text-[11px] font-sans font-bold text-slate-700 hover:bg-slate-100 px-2.5 py-1 rounded transition-colors"
            id="custom-pop-btn"
          >
            Pop
          </button>
          <button
            onClick={onCustomClear}
            className="text-[11px] font-sans font-bold text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded transition-colors"
            id="custom-clear-btn"
          >
            Clear
          </button>
        </div>
      </div>
    </header>
  );
};
