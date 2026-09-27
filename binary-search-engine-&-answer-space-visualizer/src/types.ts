/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProblemCategory = 
  | 'Classic 1D Search' 
  | 'Rotated & Mountain Arrays' 
  | '2D Matrix Search' 
  | 'Binary Search on Answer';

export interface Problem {
  id: string;
  sequenceNum: number;
  title: string;
  leetcode: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: ProblemCategory;
  description: string;
  details: string; // Long-form explanation
  invariant: string;
  
  // Custom inputs config
  defaultArray: number[] | number[][]; // For 2D, it is number[][]
  defaultTarget: number;
  extraParams?: Record<string, {
    label: string;
    defaultValue: number;
    min: number;
    max: number;
    step?: number;
  }>;
}

export interface DiscardedRange {
  start: number;
  end: number;
}

export interface PredicateState {
  isPossible: boolean;
  explanation: string;
  details?: {
    label: string;
    value: string | number;
    subValues?: { label: string; value: string | number; highlight?: boolean }[];
  }[];
}

export interface SimulationStep {
  low: number;
  high: number;
  mid: number | null;
  discardedRanges: DiscardedRange[];
  description: string;
  line: number; // Line number in C++ code snippet (1-indexed)
  found: boolean;
  foundIndex: number | number[] | null; // index or [row, col] for 2D or value for Answer search
  ans: number | null; // recorded answer
  variables: Record<string, any>;
  
  // Custom states for specialized visualizations
  predicateState?: PredicateState;
  row?: number | null; // For 2D matrix
  col?: number | null; // For 2D matrix
  eliminatedRows?: number[]; // Rows eliminated in 2D
  eliminatedCols?: number[]; // Cols eliminated in 2D
}
