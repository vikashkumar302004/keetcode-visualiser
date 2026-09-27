import React, { useState } from 'react';
import { AlgorithmMetadata } from '../types';
import { HelpCircle, ChevronDown, ChevronUp, Clock, Layers, BookOpen, Sparkles, Tag } from 'lucide-react';

interface ProblemQuestionBarProps {
  algorithmMeta?: AlgorithmMetadata;
  onOpenInfoModal: () => void;
}

export const ProblemQuestionBar: React.FC<ProblemQuestionBarProps> = ({
  algorithmMeta,
  onOpenInfoModal
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  if (!algorithmMeta) return null;

  const difficultyColor = {
    Easy: 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold',
    Medium: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
    Hard: 'bg-rose-100 text-rose-900 border-rose-300 font-bold'
  }[algorithmMeta.difficulty || 'Medium'];

  return (
    <div className="w-full bg-stone-50/90 border-b border-stone-200 shadow-2xs shrink-0 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        {/* Top Header Row: Category, Title, Difficulty, and Quick Stats */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-900 text-white shrink-0">
              Problem Prompt
            </span>

            <span className={`text-[11px] px-2 py-0.5 rounded border shrink-0 ${difficultyColor}`}>
              {algorithmMeta.difficulty}
            </span>

            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-stone-200/80 text-stone-700 shrink-0">
              {algorithmMeta.category}
            </span>

            <h2 className="text-sm sm:text-base font-bold text-stone-900">
              {algorithmMeta.problemTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Complexity badges */}
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <span className="flex items-center gap-1 bg-white border border-stone-200 px-2 py-0.5 rounded font-mono text-[11px] text-stone-700 shadow-2xs">
                <Clock className="w-3 h-3 text-stone-500" />
                <span>{algorithmMeta.timeComplexity}</span>
              </span>
              <span className="flex items-center gap-1 bg-white border border-stone-200 px-2 py-0.5 rounded font-mono text-[11px] text-stone-700 shadow-2xs">
                <Layers className="w-3 h-3 text-stone-500" />
                <span>{algorithmMeta.spaceComplexity}</span>
              </span>
            </div>

            {/* Theory Guide Modal Trigger */}
            <button
              onClick={onOpenInfoModal}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-100 border border-stone-200 rounded shadow-2xs transition-colors"
              title="View Algorithm Theory & Pseudocode"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Algorithm</span> Theory
            </button>

            {/* Collapse/Expand Bar */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 rounded transition-colors"
              title={isCollapsed ? 'Show Problem Description' : 'Compact View'}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Prominent Question Body Card */}
        {!isCollapsed && (
          <div className="mt-2 p-2.5 sm:p-3 bg-white rounded-lg border border-stone-200/90 shadow-2xs flex flex-col gap-2">
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5 p-1 rounded bg-amber-50 border border-amber-200 text-amber-700 shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                  {algorithmMeta.problemQuestion}
                </p>
                {algorithmMeta.description && (
                  <p className="mt-1 text-[11px] sm:text-xs text-stone-500 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                    <span><strong className="text-stone-700 font-semibold">How it works:</strong> {algorithmMeta.description}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Tags and Metadata Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-stone-400 flex items-center gap-1 mr-1">
                  <Tag className="w-3 h-3" />
                  Key Concepts:
                </span>
                {algorithmMeta.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[11px] font-medium border border-stone-200/80"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="text-[11px] text-stone-500">
                <span>Best suited for: </span>
                <span className="text-stone-700 font-medium">{algorithmMeta.bestFor}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
