import React, { useState } from 'react';
import { ArrowLeftRight, ChevronLeft, ChevronRight, RotateCcw, AlertCircle } from 'lucide-react';
import { Problem } from '../types';

interface HeaderProps {
  problems: Problem[];
  selectedProblem: Problem;
  onSelectProblem: (p: Problem) => void;
  currentArray: number[];
  onUpdateArray: (arr: number[]) => void;
  targetValue: number;
  onUpdateTarget: (val: number) => void;
  onReset: () => void;
}

export default function Header({
  problems,
  selectedProblem,
  onSelectProblem,
  currentArray,
  onUpdateArray,
  targetValue,
  onUpdateTarget,
  onReset,
}: HeaderProps) {
  const [arrayInput, setArrayInput] = useState<string>(currentArray.join(', '));
  const [targetInput, setTargetInput] = useState<string>(targetValue.toString());
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state if selectedProblem changes
  React.useEffect(() => {
    setArrayInput(currentArray.join(', '));
    setTargetInput(targetValue.toString());
    setErrorMsg(null);
  }, [selectedProblem, currentArray, targetValue]);

  const currentIndex = problems.findIndex(p => p.id === selectedProblem.id);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectProblem(problems[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < problems.length - 1) {
      onSelectProblem(problems[currentIndex + 1]);
    }
  };

  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const found = problems.find(p => p.id === e.target.value);
    if (found) {
      onSelectProblem(found);
    }
  };

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      // Parse array
      const parsedArray = arrayInput
        .split(',')
        .map(val => val.trim())
        .filter(val => val !== '')
        .map(val => {
          const num = Number(val);
          if (isNaN(num)) throw new Error('Array contains invalid numbers');
          return num;
        });

      if (parsedArray.length === 0) {
        throw new Error('Array cannot be empty');
      }
      if (parsedArray.length > 16) {
        throw new Error('Array is too long for compact display (max 16 elements)');
      }

      // Parse target
      const parsedTarget = Number(targetInput);
      if (isNaN(parsedTarget)) {
        throw new Error('Target value must be a valid number');
      }

      onUpdateArray(parsedArray);
      onUpdateTarget(parsedTarget);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse inputs');
    }
  };

  const handlePresetSelect = (presetArray: number[], presetTarget?: number) => {
    setErrorMsg(null);
    onUpdateArray(presetArray);
    if (presetTarget !== undefined) {
      onUpdateTarget(presetTarget);
    }
  };

  return (
    <header className="bg-[#FAF9F6] border-b border-slate-200 px-5 py-3 sticky top-0 z-40 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shrink-0">
      {/* Brand Label */}
      <div className="flex items-center gap-3">
        <div className="bg-amber-500 text-white p-2 rounded-lg shadow-sm">
          <ArrowLeftRight className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-serif text-slate-800 tracking-tight flex items-center gap-2">
            Two Pointers & Kadane's
            <span className="text-sm font-sans font-medium px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-full">
              Interactive
            </span>
          </h1>
          <p className="text-xs font-sans text-slate-500">Dual-Canvas Algorithm Visualizer</p>
        </div>
      </div>

      {/* Prominent Sequence Dropdown */}
      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-xs max-w-md w-full md:w-auto">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Previous Problem"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <select
          value={selectedProblem.id}
          onChange={handleDropdownChange}
          className="flex-1 bg-transparent font-sans text-sm font-semibold text-slate-700 px-3 py-1 focus:outline-none cursor-pointer truncate"
        >
          <optgroup label="1. Opposite Direction (Inward Convergence)" className="font-bold text-slate-400 bg-white text-xs">
            {problems
              .filter((p) => p.category === 'opposite')
              .map((p) => (
                <option key={p.id} value={p.id} className="font-medium text-slate-700 text-sm">
                  #{String(p.seq).padStart(2, '0')}: {p.title}
                </option>
              ))}
          </optgroup>
          <optgroup label="2. Same Direction (Fast & Slow, Sliding Window)" className="font-bold text-slate-400 bg-white text-xs">
            {problems
              .filter((p) => p.category === 'same')
              .map((p) => (
                <option key={p.id} value={p.id} className="font-medium text-slate-700 text-sm">
                  #{String(p.seq).padStart(2, '0')}: {p.title}
                </option>
              ))}
          </optgroup>
          <optgroup label="3. Kadane's & Subarray Optimization" className="font-bold text-slate-400 bg-white text-xs">
            {problems
              .filter((p) => p.category === 'kadane')
              .map((p) => (
                <option key={p.id} value={p.id} className="font-medium text-slate-700 text-sm">
                  #{String(p.seq).padStart(2, '0')}: {p.title}
                </option>
              ))}
          </optgroup>
        </select>

        <button
          onClick={handleNext}
          disabled={currentIndex === problems.length - 1}
          className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Next Problem"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Setup Tools Form */}
      <form onSubmit={handleApplyCustom} className="flex flex-wrap items-center gap-3">
        {/* Preset Selector */}
        <div className="flex flex-col">
          <label className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Presets</label>
          <select
            onChange={(e) => {
              const idx = Number(e.target.value);
              if (idx >= 0 && selectedProblem.presets[idx]) {
                const preset = selectedProblem.presets[idx];
                handlePresetSelect(preset.array, preset.target);
              }
            }}
            value=""
            className="bg-white border border-slate-200 text-xs font-medium text-slate-700 rounded-md px-2 py-1.5 focus:outline-none focus:border-amber-400 max-w-[150px]"
          >
            <option value="" disabled>Load Preset...</option>
            {selectedProblem.presets.map((preset, i) => (
              <option key={i} value={i}>{preset.label}</option>
            ))}
          </select>
        </div>

        {/* Custom Array Input */}
        <div className="flex flex-col">
          <label className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Array Input (nums)</label>
          <input
            type="text"
            value={arrayInput}
            onChange={(e) => setArrayInput(e.target.value)}
            className="bg-white border border-slate-200 text-xs font-mono font-medium text-slate-700 rounded-md px-2 py-1.5 focus:outline-none focus:border-amber-400 w-[140px]"
            placeholder="e.g. 1, 2, 3"
          />
        </div>

        {/* Target Field if needed */}
        {selectedProblem.defaultTarget !== undefined && (
          <div className="flex flex-col">
            <label className="text-[10px] font-sans font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Target (k)</label>
            <input
              type="text"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="bg-white border border-slate-200 text-xs font-mono font-medium text-slate-700 rounded-md px-2 py-1.5 focus:outline-none focus:border-amber-400 w-[50px] text-center"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-end gap-2 h-full pt-4">
          <button
            type="submit"
            className="bg-slate-800 hover:bg-slate-700 text-white font-sans text-xs font-semibold px-3 py-1.5 rounded-md transition-colors shadow-xs"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={onReset}
            className="border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-sans text-xs font-semibold px-2.5 py-1.5 rounded-md transition-colors flex items-center gap-1 shadow-xs"
            title="Reset to default array"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {errorMsg && (
          <div className="absolute top-[100%] right-5 mt-1 bg-rose-50 border border-rose-200 text-rose-800 px-3 py-1.5 rounded-lg text-xs font-sans flex items-center gap-1.5 shadow-md z-50 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </form>
    </header>
  );
}
