import React, { useState, useEffect } from 'react';
import { ProblemMetadata } from '../types';
import { ChevronDown, ChevronUp, Play, RefreshCw, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

interface QuestionCardProps {
  problem: ProblemMetadata;
  customText: string;
  customPattern: string;
  onSimulate: (text: string, pattern: string) => void;
  onResetToDefault: () => void;
}

export default function QuestionCard({
  problem,
  customText,
  customPattern,
  onSimulate,
  onResetToDefault
}: QuestionCardProps) {
  const [isExpanded, setIsExpanded] = useState(true); // Open by default for maximum educational clarity
  const [textVal, setTextVal] = useState(customText);
  const [patternVal, setPatternVal] = useState(customPattern);

  // Sync state with parent state (when switching problems)
  useEffect(() => {
    setTextVal(customText);
    setPatternVal(customPattern);
  }, [customText, customPattern]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSimulate(textVal, patternVal);
  };

  const hasPattern = [
    'valid_anagram',
    'isomorphic_strings',
    'strstr_naive',
    'kmp_search',
    'rabin_karp',
    'z_algorithm'
  ].includes(problem.id);

  // Get difficulty color classes
  const getDifficultyBadge = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Hard':
        return 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  const getPlaceholderHelp = () => {
    switch (problem.id) {
      case 'longest_common_prefix':
        return 'flower,flow,flight';
      case 'kmp_lps':
        return 'ABABCABAB';
      default:
        return 'Input text string';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col gap-3.5 shadow-sm shrink-0 font-sans select-none">
      
      {/* Upper Row: Title, LC Tag, Difficulty, Details toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
            #{problem.sequenceNum.toString().padStart(2, '0')}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-500/10 text-amber-800 rounded border border-amber-200">
            {problem.category}
          </span>
          <h2 className="text-sm md:text-base font-serif font-bold text-slate-900 tracking-tight ml-1">
            {problem.title}
          </h2>
          <span className="text-[11px] font-mono font-medium text-slate-400">
            {problem.leetcodeTag}
          </span>
          <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded-full ${getDifficultyBadge(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <span>{isExpanded ? 'Hide Info' : 'Show Info'}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Info Card Content */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 p-3 bg-[#FAF9F6] rounded-lg border border-slate-200/60 text-xs">
          
          {/* Question / Task Description */}
          <div className="md:col-span-6 flex flex-col gap-1 border-r-0 md:border-r border-slate-200 md:pr-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
              Problem Description (English)
            </span>
            <p className="text-slate-700 font-medium leading-relaxed font-sans mt-0.5">
              {problem.details}
            </p>
          </div>

          {/* Current Live Test Case Input Variables */}
          <div className="md:col-span-3 flex flex-col gap-1 border-r-0 md:border-r border-slate-200 md:pr-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
              Current Test Case Inputs
            </span>
            <div className="mt-1 font-mono text-[11px] text-slate-600 flex flex-col gap-0.5">
              <div>S: <span className="font-bold text-indigo-700">"{customText}"</span></div>
              {hasPattern && (
                <div>T: <span className="font-bold text-amber-700">"{customPattern}"</span></div>
              )}
            </div>
          </div>

          {/* Expected Output */}
          <div className="md:col-span-3 flex flex-col justify-center gap-1 bg-white p-2.5 rounded border border-slate-200">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Expected Output
            </span>
            <div className="font-mono text-xs font-bold text-emerald-950 bg-emerald-50/50 border border-emerald-100 p-1.5 rounded mt-0.5 break-words">
              {problem.expectedOutput}
            </div>
          </div>

        </div>
      )}

      {/* Input Parameters Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        
        {/* Primary Input */}
        <div className={`flex flex-col gap-1 ${hasPattern ? 'md:col-span-5' : 'md:col-span-8'}`}>
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
            {problem.id === 'longest_common_prefix' ? 'Strings List (comma separated)' : 'Primary String (S)'}
          </label>
          <input
            type="text"
            value={textVal}
            onChange={(e) => setTextVal(e.target.value)}
            placeholder={getPlaceholderHelp()}
            className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 rounded-lg px-3 py-1.5 text-xs font-mono font-medium focus:outline-none focus:bg-white transition-all text-slate-800"
            required
          />
        </div>

        {/* Pattern Input */}
        {hasPattern && (
          <div className="flex flex-col gap-1 md:col-span-3">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Pattern / Match Target (T)
            </label>
            <input
              type="text"
              value={patternVal}
              onChange={(e) => setPatternVal(e.target.value)}
              placeholder="Enter pattern"
              className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 rounded-lg px-3 py-1.5 text-xs font-mono font-medium focus:outline-none focus:bg-white transition-all text-slate-800"
              required
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 md:col-span-4">
          <button
            type="button"
            onClick={onResetToDefault}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold transition-all hover:border-slate-300"
            title="Reset to default test case"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" />
            <span>Reset Case</span>
          </button>

          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Simulate</span>
          </button>
        </div>

      </form>
    </div>
  );
}
