import React, { useState } from 'react';
import { BookOpen, Settings, Check, ArrowRight, Play, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { ProblemMetadata, ProblemId } from '../types';

interface QuestionCardProps {
  selectedProblem: ProblemMetadata;
  inputs: Record<string, any>;
  onInputChange: (key: string, value: any) => void;
}

const PROBLEM_DETAILS: Record<
  string,
  { question: string; testCase: string; output: string }
> = {
  factorial_fibonacci: {
    question: "Compute the N-th Fibonacci number where each term is the sum of the two preceding ones (f(n) = f(n-1) + f(n-2)), or compute the Factorial of N (f(n) = n * f(n-1)). It demonstrates how single or multiple recursive calls grow the computer's memory stack.",
    testCase: "N = 4 (Fibonacci Mode)",
    output: "3 (Sequence: 0, 1, 1, 2, 3)"
  },
  binary_exponentiation: {
    question: "Calculate the mathematical power x^n recursively. By halving the exponent at each level (x^(n/2))^2, we reduce execution steps from N to log(N), achieving rapid execution.",
    testCase: "Base (x) = 2.0, Exponent (n) = 5",
    output: "32.0"
  },
  reverse_palindrome: {
    question: "Determine whether a string is a palindrome (reads the same forward and backward) by recursively checking boundary characters, contracting the pointer limits inward until they meet.",
    testCase: "Text = \"radar\"",
    output: "true (is a palindrome)"
  },
  tower_of_hanoi: {
    question: "Solve the classic mathematical disk-stack puzzle. Transfer N circular disks from Peg A to Peg C using helper Peg B, ensuring no larger disk rests on a smaller disk.",
    testCase: "Disks = 3",
    output: "7 disk transfers (A to C, A to B, C to B, A to C, etc.)"
  },
  subsets_1: {
    question: "Generate all possible unique subsets (the Power Set) of an array of numbers. For every item, bifurcate your path: either Pick the element or Skip it, yielding exactly 2^N subsets.",
    testCase: "Nums = [1, 2, 3]",
    output: "[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]] (8 subsets)"
  },
  subsets_2: {
    question: "Generate all unique subsets of a set that contains duplicate numbers. To avoid redundant duplicates, candidates are sorted and duplicate choices are pruned at the same recursion level.",
    testCase: "Nums = [1, 2, 2]",
    output: "[[], [1], [2], [1,2], [2,2], [1,2,2]] (6 subsets)"
  },
  combination_sum_1: {
    question: "Find all unique combinations of candidate numbers that sum up to a target sum. Candidates can be re-used an unlimited number of times.",
    testCase: "Candidates = [2, 3], Target = 5",
    output: "[[2, 3]]"
  },
  combination_sum_2: {
    question: "Find all unique combinations where candidate numbers sum up to a target sum. Each candidate number can only be used once. No duplicate combinations are allowed.",
    testCase: "Candidates = [1, 2, 2, 5], Target = 5",
    output: "[[1, 2, 2], [5]]"
  },
  letter_combinations: {
    question: "Generate all letter combinations represented by digits from a telephone keypad (e.g. 2 matches 'abc', 3 matches 'def') by branching through mapped characters of each active digit.",
    testCase: "Digits = \"23\"",
    output: "[\"ad\", \"ae\", \"af\", \"bd\", \"be\", \"bf\", \"cd\", \"ce\", \"cf\"]"
  },
  permutations_1: {
    question: "Generate all possible ordered permutations of an array containing unique elements by tracking used numbers in a visited state array.",
    testCase: "Nums = [1, 2, 3]",
    output: "6 ordered permutations: [[1,2,3], [1,3,2], [2,1,3], ...]"
  },
  permutations_2: {
    question: "Generate all unique permutations of a list containing duplicate elements. Restricts redundant orderings by enforcing duplicate candidates to be chosen in a stable order.",
    testCase: "Nums = [1, 1, 2]",
    output: "3 unique permutations: [[1,1,2], [1,2,1], [2,1,1]]"
  },
  palindrome_partitioning: {
    question: "Slice a string into substrings such that every substring in the cut partition is a valid palindrome. Invalid sliced prefixes are pruned immediately.",
    testCase: "Text = \"aab\"",
    output: "[[\"a\", \"a\", \"b\"], [\"aa\", \"b\"]]"
  },
  n_queens: {
    question: "Solve the classical constraint problem of placing N non-attacking Queens on an N x N chessboard. Maintains live row, column, and diagonal conflict vectors to ensure safety.",
    testCase: "Chess Board Size N = 4",
    output: "2 safe chessboard configurations"
  },
  sudoku_solver: {
    question: "Solve an incomplete 4 x 4 Sudoku grid. For each blank cell, trial digits 1 to 4 and recursively backtrack if a row, column, or 2 x 2 block constraint is violated.",
    testCase: "4x4 partially filled Sudoku puzzle preset",
    output: "1 fully solved grid configuration"
  },
  word_search: {
    question: "Search for a target word in a 2D board of letters. The word can be constructed from letters of sequentially adjacent cells. No character cell can be repeated twice in a path.",
    testCase: "Grid with letters, Target Word = \"ABCCED\"",
    output: "true (path exists and was highlighted)"
  },
  rat_in_maze: {
    question: "Guide a rat starting at position (0,0) to reach the target cheese at (3,3) in a grid maze while bypassing blockades (obstacles). Displays all valid paths.",
    testCase: "4x4 Grid with obstacle blocks",
    output: "[\"DDRDRD\", \"DRDDRD\"]"
  }
};

export default function QuestionCard({ selectedProblem, inputs, onInputChange }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(true);

  // Fallback metadata if not in dictionary
  const details = PROBLEM_DETAILS[selectedProblem.id] || {
    question: selectedProblem.descriptionText,
    testCase: "Configurable array/string parameters",
    output: "All matching solutions"
  };

  const difficultyColor =
    selectedProblem.difficulty === 'Easy'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : selectedProblem.difficulty === 'Medium'
      ? 'text-amber-800 bg-amber-50 border-amber-200'
      : 'text-rose-800 bg-rose-50 border-rose-200';

  return (
    <div className="bg-[#FAF9F6] border-b border-slate-200 px-6 py-3 shrink-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side Details */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded">
            {selectedProblem.index}
          </span>
          <h2 className="font-serif text-base lg:text-lg font-extrabold text-slate-900 leading-none">
            {selectedProblem.title}
          </h2>
          <span className={`text-[11px] font-semibold font-mono border px-2 py-0.5 rounded uppercase tracking-wider ${difficultyColor}`}>
            {selectedProblem.difficulty}
          </span>
          {selectedProblem.leetcode && (
            <span className="text-xs font-mono text-slate-500 font-semibold bg-slate-100 px-1.5 py-0.5 rounded">
              {selectedProblem.leetcode}
            </span>
          )}
        </div>

        {/* Action Button: Hide/Show Details */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 hover:text-slate-900 shadow-xs transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span>{expanded ? 'Hide Description' : 'Show Description'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* English Problem Details & Live Custom Configuration Panel */}
      {expanded && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-sans text-slate-600 border-t border-slate-100 pt-3 animate-fadeIn">
          {/* Column 1: Natural English Explanation */}
          <div className="md:col-span-7 space-y-2 border-r border-slate-200/50 pr-4">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 block mb-0.5">
                Question Statement
              </span>
              <p className="text-slate-700 leading-relaxed font-sans text-[11px] lg:text-xs">
                {details.question}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 block mb-0.5">
                  Test Case Input
                </span>
                <span className="font-mono text-slate-800 text-[11px] bg-slate-100 border border-slate-200/50 px-1.5 py-0.5 rounded inline-block">
                  {details.testCase}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 block mb-0.5">
                  Expected Output
                </span>
                <span className="font-mono text-emerald-800 text-[11px] bg-emerald-50 border border-emerald-200/40 px-1.5 py-0.5 rounded inline-block">
                  {details.output}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Parameter Custom Input Configurator */}
          <div className="md:col-span-5 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 mb-2">
              <Settings className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-700">
                Interactive Custom Parameters Input
              </span>
            </div>

            <div className="bg-white border border-slate-200/80 p-2.5 rounded shadow-2xs space-y-2.5">
              {/* Factorial of N */}
              {selectedProblem.id === 'factorial' && (
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Value (N) (range 1-8)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    value={inputs.n ?? 4}
                    onChange={(e) => onInputChange('n', Math.max(1, Math.min(8, Number(e.target.value))))}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                  />
                </div>
              )}

              {/* Fibonacci */}
              {selectedProblem.id === 'fibonacci' && (
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Fibonacci Number (N) (range 1-6)</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={inputs.n ?? 4}
                    onChange={(e) => onInputChange('n', Math.max(1, Math.min(6, Number(e.target.value))))}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                  />
                </div>
              )}

              {/* Sum of N */}
              {selectedProblem.id === 'sum_n' && (
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Accumulator Cap (N) (range 1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={inputs.n ?? 5}
                    onChange={(e) => onInputChange('n', Math.max(1, Math.min(10, Number(e.target.value))))}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                  />
                </div>
              )}

              {/* Array Sum */}
              {selectedProblem.id === 'array_sum' && (
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Custom Array Elements (comma-separated, max 6 items)</label>
                  <input
                    type="text"
                    value={(inputs.nums ?? [1, 2, 3, 4]).join(', ')}
                    onChange={(e) => {
                      const arr = e.target.value
                        .split(',')
                        .map(v => parseInt(v.trim()))
                        .filter(v => !isNaN(v));
                      onInputChange('nums', arr.slice(0, 6));
                    }}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                  />
                </div>
              )}

              {/* Recursive Binary Search */}
              {selectedProblem.id === 'binary_search' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Sorted Array</label>
                    <input
                      type="text"
                      value={(inputs.nums ?? [1, 3, 5, 7, 9]).join(', ')}
                      onChange={(e) => {
                        const arr = e.target.value
                          .split(',')
                          .map(v => parseInt(v.trim()))
                          .filter(v => !isNaN(v))
                          .sort((a, b) => a - b);
                        onInputChange('nums', arr.slice(0, 6));
                      }}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Target Key</label>
                    <input
                      type="number"
                      value={inputs.target ?? 7}
                      onChange={(e) => onInputChange('target', Number(e.target.value))}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                    />
                  </div>
                </div>
              )}

              {/* Fast Power */}
              {selectedProblem.id === 'binary_exponentiation' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Base (x)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="5"
                      value={inputs.x ?? 2}
                      onChange={(e) => onInputChange('x', Math.max(0.5, Math.min(5, Number(e.target.value))))}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Power (n)</label>
                    <input
                      type="number"
                      min="-6"
                      max="6"
                      value={inputs.n ?? 5}
                      onChange={(e) => onInputChange('n', Math.max(-6, Math.min(6, Number(e.target.value))))}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                    />
                  </div>
                </div>
              )}

              {/* Reverse String / Palindrome */}
              {selectedProblem.id === 'reverse_palindrome' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Algorithm Mode</label>
                    <select
                      value={inputs.mode || 'palindrome'}
                      onChange={(e) => onInputChange('mode', e.target.value)}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono"
                    >
                      <option value="palindrome">Palindrome Check</option>
                      <option value="reverse">Reverse String</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Custom Word</label>
                    <input
                      type="text"
                      maxLength={8}
                      value={inputs.text ?? 'radar'}
                      onChange={(e) => onInputChange('text', e.target.value.toLowerCase().replace(/[^a-z]/g, ''))}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                    />
                  </div>
                </div>
              )}

              {/* Tower of Hanoi */}
              {selectedProblem.id === 'tower_of_hanoi' && (
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Disks Quantity (1 - 4)</label>
                  <input
                    type="number"
                    min="1"
                    max="4"
                    value={inputs.disks ?? 3}
                    onChange={(e) => onInputChange('disks', Math.max(1, Math.min(4, Number(e.target.value))))}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                  />
                </div>
              )}

              {/* Subsets I */}
              {selectedProblem.id === 'subsets_1' && (
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Custom Unique Array (comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1, 2, 3"
                    value={(inputs.nums ?? [1, 2, 3]).join(',')}
                    onChange={(e) => {
                      const arr = e.target.value
                        .split(',')
                        .map(v => parseInt(v.trim()))
                        .filter(v => !isNaN(v));
                      onInputChange('nums', arr.slice(0, 4));
                    }}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                  />
                </div>
              )}

              {/* Subsets II */}
              {selectedProblem.id === 'subsets_2' && (
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Custom Array with Duplicates (sorted automatically)</label>
                  <input
                    type="text"
                    placeholder="e.g. 1, 2, 2"
                    value={(inputs.nums ?? [1, 2, 2]).join(',')}
                    onChange={(e) => {
                      const arr = e.target.value
                        .split(',')
                        .map(v => parseInt(v.trim()))
                        .filter(v => !isNaN(v));
                      onInputChange('nums', arr.slice(0, 4));
                    }}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                  />
                </div>
              )}

              {/* Combination Sum I */}
              {selectedProblem.id === 'combination_sum_1' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Candidates</label>
                    <input
                      type="text"
                      value={(inputs.candidates ?? [2, 3]).join(',')}
                      onChange={(e) => {
                        const arr = e.target.value
                          .split(',')
                          .map(v => parseInt(v.trim()))
                          .filter(v => !isNaN(v));
                        onInputChange('candidates', arr.slice(0, 3));
                      }}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Target Sum</label>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={inputs.target ?? 5}
                      onChange={(e) => onInputChange('target', Math.max(1, Math.min(8, Number(e.target.value))))}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                    />
                  </div>
                </div>
              )}

              {/* Combination Sum II */}
              {selectedProblem.id === 'combination_sum_2' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Candidates</label>
                    <input
                      type="text"
                      value={(inputs.candidates ?? [2, 5, 2, 1, 2]).join(',')}
                      onChange={(e) => {
                        const arr = e.target.value
                          .split(',')
                          .map(v => parseInt(v.trim()))
                          .filter(v => !isNaN(v));
                        onInputChange('candidates', arr.slice(0, 5));
                      }}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Target Sum</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={inputs.target ?? 5}
                      onChange={(e) => onInputChange('target', Math.max(1, Math.min(10, Number(e.target.value))))}
                      className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                    />
                  </div>
                </div>
              )}

              {/* Phone Letter Combinations */}
              {selectedProblem.id === 'letter_combinations' && (
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Custom Digits (keys 2-9)</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={inputs.digits ?? '23'}
                    onChange={(e) => onInputChange('digits', e.target.value.replace(/[^2-9]/g, ''))}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                  />
                </div>
              )}

              {/* Permutations I */}
              {selectedProblem.id === 'permutations_1' && (
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Custom Unique Array (max 3 elements)</label>
                  <input
                    type="text"
                    value={(inputs.nums ?? [1, 2, 3]).join(',')}
                    onChange={(e) => {
                      const arr = e.target.value
                        .split(',')
                        .map(v => parseInt(v.trim()))
                        .filter(v => !isNaN(v));
                      onInputChange('nums', arr.slice(0, 3));
                    }}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                  />
                </div>
              )}

              {/* Permutations II */}
              {selectedProblem.id === 'permutations_2' && (
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Custom Duplicates Array (max 3 elements)</label>
                  <input
                    type="text"
                    value={(inputs.nums ?? [1, 1, 2]).join(',')}
                    onChange={(e) => {
                      const arr = e.target.value
                        .split(',')
                        .map(v => parseInt(v.trim()))
                        .filter(v => !isNaN(v));
                      onInputChange('nums', arr.slice(0, 3));
                    }}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                  />
                </div>
              )}

              {/* Palindrome Partitioning */}
              {selectedProblem.id === 'palindrome_partitioning' && (
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Custom Text (max 4 characters)</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={inputs.text ?? 'aab'}
                    onChange={(e) => onInputChange('text', e.target.value.toLowerCase().replace(/[^a-z]/g, ''))}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                  />
                </div>
              )}

              {/* N-Queens */}
              {selectedProblem.id === 'n_queens' && (
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Board Grid Dimension N</label>
                  <select
                    value={inputs.n ?? 4}
                    onChange={(e) => onInputChange('n', Number(e.target.value))}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                  >
                    <option value={4}>4 × 4 Board</option>
                    <option value={5}>5 × 5 Board</option>
                    <option value={6}>6 × 6 Board</option>
                  </select>
                </div>
              )}

              {/* Sudoku Solver */}
              {selectedProblem.id === 'sudoku_solver' && (
                <div className="text-[10px] font-mono text-slate-400 leading-normal italic text-center p-1 border border-slate-100 rounded bg-slate-50">
                  Runs simulation with 4x4 coordinate sudoku preset. Changes trigger live solver backtracking.
                </div>
              )}

              {/* Word Search */}
              {selectedProblem.id === 'word_search' && (
                <div>
                  <label className="text-[9px] font-mono text-slate-400 uppercase tracking-wide block mb-1">Target Word (max 7 characters)</label>
                  <input
                    type="text"
                    maxLength={7}
                    value={inputs.word ?? 'ABCCED'}
                    onChange={(e) => onInputChange('word', e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                    className="w-full px-2 py-1 text-xs bg-white border border-slate-200 rounded font-mono text-center"
                  />
                </div>
              )}

              {/* Rat in a Maze */}
              {selectedProblem.id === 'rat_in_maze' && (
                <div className="text-[10px] font-mono text-slate-400 leading-normal italic text-center p-1 border border-slate-100 rounded bg-slate-50">
                  Starts a rat search path inside a 4x4 obstacles maze preset. Shows path generation states.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
