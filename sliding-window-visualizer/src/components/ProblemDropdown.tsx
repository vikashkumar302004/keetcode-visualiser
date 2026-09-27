import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Check, 
  Search, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Target, 
  Equal,
  Sparkles
} from 'lucide-react';
import { ProblemDefinition, ProblemPattern } from '../types';

interface ProblemDropdownProps {
  problems: ProblemDefinition[];
  currentProblem: ProblemDefinition;
  onSelectProblem: (problem: ProblemDefinition) => void;
}

interface PatternGroup {
  key: ProblemPattern;
  title: string;
  badge: string;
  badgeColor: string;
  accentBorder: string;
  description: string;
}

const PATTERN_GROUPS: PatternGroup[] = [
  {
    key: 'fixed',
    title: 'Fixed Window Size (k)',
    badge: 'Fixed Size',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    accentBorder: 'border-blue-400',
    description: 'Window size stays constant (R - L + 1 = k). Expand R and slide L together.'
  },
  {
    key: 'variable',
    title: 'Variable / Dynamic Window',
    badge: 'Variable Size',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accentBorder: 'border-emerald-400',
    description: 'Window expands with R to explore, and shrinks with L when the condition is violated.'
  },
  {
    key: 'target',
    title: 'Target String & Anagram Matching',
    badge: 'Target Match',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    accentBorder: 'border-amber-400',
    description: 'Track frequency table and matched character counts (e.g. LC #567, #76, #30).'
  },
  {
    key: 'exact-k',
    title: 'Exact-K via At-Most-K Trick',
    badge: 'Exact-K',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    accentBorder: 'border-purple-400',
    description: 'exact(k) = atMost(k) - atMost(k - 1). Elegant two-pass window formulation.'
  }
];

export const ProblemDropdown: React.FC<ProblemDropdownProps> = ({
  problems,
  currentProblem,
  onSelectProblem
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatternFilter, setSelectedPatternFilter] = useState<string>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const filteredProblems = problems.filter(p => {
    const matchesPattern = selectedPatternFilter === 'all' || p.pattern === selectedPatternFilter;
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch = !query || 
      p.title.toLowerCase().includes(query) ||
      p.patternLabel.toLowerCase().includes(query) ||
      (p.leetcodeNumber && String(p.leetcodeNumber).includes(query)) ||
      String(p.seq).includes(query);
    return matchesPattern && matchesSearch;
  });

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Hard':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getPatternIcon = (pattern: ProblemPattern) => {
    switch (pattern) {
      case 'fixed':
        return <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case 'variable':
        return <Maximize2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case 'target':
        return <Target className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      case 'exact-k':
        return <Equal className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        id="btn-problem-dropdown-trigger"
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="w-64 sm:w-80 md:w-96 text-left text-xs sm:text-sm font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md py-1.5 pl-2.5 pr-8 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-amber-500 truncate cursor-pointer transition-colors flex items-center justify-between shadow-2xs"
      >
        <div className="flex items-center space-x-2 truncate">
          <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 shrink-0">
            #{String(currentProblem.seq).padStart(2, '0')}
          </span>
          <span className="truncate font-semibold text-slate-900">
            {currentProblem.title}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-medium px-1.5 py-0.5 rounded border border-slate-200 bg-white text-slate-500 shrink-0">
            {currentProblem.patternLabel}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 ml-2 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Menu with Pattern Sub-classifications */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-[340px] sm:w-[460px] md:w-[540px] bg-white rounded-lg border border-slate-200 shadow-xl z-50 overflow-hidden flex flex-col max-h-[78vh] animate-in fade-in-50 duration-100">
          {/* Header Search and Pattern Filter Pills */}
          <div className="p-2.5 bg-slate-50 border-b border-slate-200 space-y-2 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search problem, LC #, or algorithm..."
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-white rounded-md border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-amber-400"
                autoFocus
              />
            </div>

            {/* Pattern Filter Pills (Sub-classified categories) */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-0.5 text-[11px]">
              <button
                onClick={() => setSelectedPatternFilter('all')}
                className={`px-2 py-0.5 rounded-full font-medium whitespace-nowrap transition-colors border ${
                  selectedPatternFilter === 'all'
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                All ({problems.length})
              </button>
              {PATTERN_GROUPS.map((grp) => {
                const count = problems.filter(p => p.pattern === grp.key).length;
                const isSelected = selectedPatternFilter === grp.key;
                return (
                  <button
                    key={grp.key}
                    onClick={() => setSelectedPatternFilter(grp.key)}
                    className={`px-2 py-0.5 rounded-full font-medium whitespace-nowrap transition-colors border ${
                      isSelected
                        ? `${grp.badgeColor} font-bold ring-1 ring-amber-400`
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {grp.badge} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Categorized Problems List */}
          <div className="overflow-y-auto p-2 space-y-3 flex-1">
            {PATTERN_GROUPS.map((grp) => {
              const groupProblems = filteredProblems.filter(p => p.pattern === grp.key);
              if (groupProblems.length === 0) return null;

              return (
                <div key={grp.key} className="space-y-1">
                  {/* Category Classification Header */}
                  <div className="px-2 py-1 rounded bg-slate-100/70 border border-slate-200/60 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      {getPatternIcon(grp.key)}
                      <span className="font-semibold text-xs text-slate-800 tracking-tight">
                        {grp.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({groupProblems.length})
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 hidden sm:inline truncate max-w-[200px]" title={grp.description}>
                      {grp.description}
                    </span>
                  </div>

                  {/* Problem Items */}
                  <div className="space-y-0.5 pl-1">
                    {groupProblems.map((problem) => {
                      const isSelected = problem.id === currentProblem.id;

                      return (
                        <button
                          key={problem.id}
                          onClick={() => {
                            onSelectProblem(problem);
                            setIsOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center justify-between gap-2 transition-all ${
                            isSelected
                              ? 'bg-amber-50 border border-amber-200 text-amber-950 font-semibold'
                              : 'hover:bg-slate-50 border border-transparent text-slate-700'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <span className="font-mono text-[11px] text-slate-500 shrink-0 w-6">
                              #{String(problem.seq).padStart(2, '0')}
                            </span>

                            {problem.leetcodeNumber && (
                              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                                LC {problem.leetcodeNumber}
                              </span>
                            )}

                            <span className="text-xs truncate text-slate-800">
                              {problem.title}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0">
                            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${getDifficultyBadge(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>

                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filteredProblems.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-500">
                No algorithms found matching &quot;{searchTerm}&quot;
              </div>
            )}
          </div>

          {/* Footer stats / helper */}
          <div className="p-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
            <span>16 Curated Sliding Window Patterns</span>
            <span className="font-mono">Esc to close</span>
          </div>
        </div>
      )}
    </div>
  );
};
