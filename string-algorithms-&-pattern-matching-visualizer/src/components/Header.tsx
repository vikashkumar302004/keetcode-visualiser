import React from 'react';
import { STRING_PROBLEMS } from '../data/stringProblems';
import { AlgorithmId, ProblemMetadata } from '../types';
import { Code, HelpCircle, RefreshCw, Layers, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentProblem: ProblemMetadata;
  onProblemChange: (problem: ProblemMetadata) => void;
  caseSensitive: boolean;
  onCaseSensitiveToggle: () => void;
}

export default function Header({
  currentProblem,
  onProblemChange,
  caseSensitive,
  onCaseSensitiveToggle
}: HeaderProps) {
  
  const handlePrev = () => {
    const prevIdx = STRING_PROBLEMS.findIndex(p => p.id === currentProblem.id) - 1;
    if (prevIdx >= 0) {
      onProblemChange(STRING_PROBLEMS[prevIdx]);
    }
  };

  const handleNext = () => {
    const nextIdx = STRING_PROBLEMS.findIndex(p => p.id === currentProblem.id) + 1;
    if (nextIdx < STRING_PROBLEMS.length) {
      onProblemChange(STRING_PROBLEMS[nextIdx]);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = STRING_PROBLEMS.find(p => p.id === e.target.value);
    if (selected) {
      onProblemChange(selected);
    }
  };

  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-6 py-4 bg-[#FAF9F6] border-b border-slate-200 gap-4 shrink-0 select-none">
      {/* Zone 1: Brand Title (Single wordmark as per top bar contract) */}
      <div className="flex items-center gap-2">
        <Layers className="w-5 h-5 text-amber-600" />
        <span className="text-lg font-serif font-bold tracking-tight text-slate-900 whitespace-nowrap">
          String &amp; Pattern Matching Engine
        </span>
        <span className="text-[10px] tracking-wide font-sans bg-amber-500/10 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200/50">
          Interactive
        </span>
      </div>

      {/* Zone 2: Sequential Problem Selection Selector */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
        <button
          onClick={handlePrev}
          disabled={STRING_PROBLEMS.findIndex(p => p.id === currentProblem.id) === 0}
          className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 rounded hover:bg-white transition-all text-sm font-semibold"
          title="Previous Algorithm"
        >
          &lt;
        </button>

        <select
          value={currentProblem.id}
          onChange={handleSelect}
          className="bg-white border-0 text-slate-800 text-xs font-semibold px-2 py-1.5 rounded focus:outline-none cursor-pointer max-w-[280px] truncate"
        >
          {Array.from(new Set(STRING_PROBLEMS.map(p => p.category))).map(category => (
            <optgroup key={category} label={category} className="text-[11px] text-slate-500 font-sans uppercase tracking-wider font-bold bg-slate-50">
              {STRING_PROBLEMS.filter(p => p.category === category).map(prob => (
                <option key={prob.id} value={prob.id} className="text-xs text-slate-800 bg-white capitalize font-sans font-medium">
                  #{prob.sequenceNum.toString().padStart(2, '0')}: {prob.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <button
          onClick={handleNext}
          disabled={STRING_PROBLEMS.findIndex(p => p.id === currentProblem.id) === STRING_PROBLEMS.length - 1}
          className="p-1.5 text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-600 rounded hover:bg-white transition-all text-sm font-semibold"
          title="Next Algorithm"
        >
          &gt;
        </button>
      </div>

      {/* Zone 3: Interactive Configuration Toggles */}
      <div className="flex items-center gap-3">
        {/* Case Sensitivity Switch */}
        <button
          onClick={onCaseSensitiveToggle}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all whitespace-nowrap ${
            caseSensitive
              ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Case Sensitive: {caseSensitive ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </header>
  );
}
