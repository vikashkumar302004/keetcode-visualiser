import React from 'react';
import { Network, RefreshCw, Shuffle, Layers, ChevronLeft, ChevronRight, BookOpen, Compass } from 'lucide-react';
import { TREE_PRESETS } from '../utils/treeUtils';
import { BST_PROBLEMS_SEQUENCE, BSTProblem } from '../data/bstProblems';
import { AlgorithmId } from '../types';

interface HeaderProps {
  currentAlgorithmId: AlgorithmId;
  onSelectProblem: (id: AlgorithmId) => void;
  nodeCount: number;
  treeHeight: number;
  onSelectPreset: (presetId: string) => void;
  onRandomTree: () => void;
  onClearTree: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentAlgorithmId,
  onSelectProblem,
  nodeCount,
  treeHeight,
  onSelectPreset,
  onRandomTree,
  onClearTree,
}) => {
  const currentIndex = BST_PROBLEMS_SEQUENCE.findIndex((p) => p.id === currentAlgorithmId);
  const currentProblem = BST_PROBLEMS_SEQUENCE[currentIndex] || BST_PROBLEMS_SEQUENCE[0];

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectProblem(BST_PROBLEMS_SEQUENCE[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (currentIndex < BST_PROBLEMS_SEQUENCE.length - 1) {
      onSelectProblem(BST_PROBLEMS_SEQUENCE[currentIndex + 1].id);
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 px-3 sm:px-5 py-2 shadow-2xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: App Branding & Title */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs shrink-0">
            <Network className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-sm tracking-tight text-slate-900">
                BST Visualizer
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 uppercase">
                Interactive
              </span>
            </div>
          </div>
        </div>

        {/* Center: PROMINENT SEQUENCE DROPDOWN WITH PREV / NEXT NAVIGATION */}
        <div className="flex items-center gap-1.5 bg-slate-100/90 border border-slate-200 p-1 rounded-xl shadow-inner">
          <button
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            title="Previous Problem in Roadmap"
            className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="relative flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-600 ml-1 hidden sm:inline" />
            <select
              aria-label="Select BST Problem from Structured Sequence"
              value={currentAlgorithmId}
              onChange={(e) => onSelectProblem(e.target.value as AlgorithmId)}
              className="bg-white border border-slate-200 hover:border-slate-300 text-slate-900 font-medium text-xs rounded-lg px-2.5 py-1 pr-7 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-2xs appearance-none"
            >
              {BST_PROBLEMS_SEQUENCE.map((prob) => (
                <option key={prob.id} value={prob.id}>
                  {String(prob.sequenceNumber).padStart(2, '0')}. {prob.title} ({prob.leetcodeTag})
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute right-2 text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex >= BST_PROBLEMS_SEQUENCE.length - 1}
            title="Next Problem in Roadmap"
            className="p-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Tree Presets & Tools */}
        <div className="flex items-center gap-2">
          {/* Tree Statistics */}
          <div className="hidden md:flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg text-[11px] text-slate-600">
            <Layers className="w-3 h-3 text-slate-400" />
            <span>N: <strong className="text-slate-800">{nodeCount}</strong></span>
            <span className="text-slate-300">&bull;</span>
            <span>H: <strong className="text-slate-800">{treeHeight}</strong></span>
          </div>

          {/* Preset Selector */}
          <select
            aria-label="Tree Preset"
            onChange={(e) => onSelectPreset(e.target.value)}
            defaultValue="balanced_classic"
            className="text-[11px] font-medium bg-white border border-slate-200 text-slate-700 rounded-lg px-2 py-1 hover:border-slate-300 focus:outline-none cursor-pointer shadow-2xs"
          >
            <option disabled value="">Tree Presets</option>
            {TREE_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Randomize Tree */}
          <button
            onClick={onRandomTree}
            title="Generate Random Valid BST"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer shadow-2xs"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          {/* Reset Tree */}
          <button
            onClick={onClearTree}
            title="Reset Tree to Default"
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
