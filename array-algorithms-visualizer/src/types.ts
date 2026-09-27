/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type AlgorithmId =
  | 'reverse-array'
  | 'rotate-array'
  | 'plus-one'
  | 'move-zeroes'
  | 'remove-duplicates'
  | 'next-permutation'
  | 'prev-permutation'
  | 'wiggle-sort'
  | 'sort-colors'
  | 'merge-sorted'
  | 'boyer-moore'
  | 'boyer-moore-ii'
  | 'missing-number'
  | 'disappeared-numbers'
  | 'product-except-self'
  | 'pascals-triangle'
  | 'set-matrix-zeroes'
  | 'rotate-image'
  | 'spiral-matrix';

export interface ArrayProblem {
  id: AlgorithmId;
  title: string;
  leetcodeUrl?: string;
  leetcodeTag: string;
  difficulty: Difficulty;
  description: string;
  keyInvariant: string;
  defaultArray: number[];
  defaultParams?: Record<string, any>;
  cppCode: string;
}

export interface SimulationStep {
  array: number[];
  secondaryArray?: number[] | number[][] | null;
  pointers: Record<string, number | null>;
  swaps?: [number, number][]; // indices being swapped
  comparisons?: [number, number][]; // indices being compared
  highlights?: Record<number, 'target' | 'pivot' | 'scanning' | 'sorted' | 'successor' | 'normal'>;
  description: string;
  line: number; // line of C++ code
  variables: Record<string, string | number | boolean | null>;
  logs: string[];
  customState?: {
    // Boyer-Moore
    candidate?: number | null;
    count?: number;
    candidate2?: number | null;
    count2?: number;
    phase?: string;
    // Plus One
    carry?: number;
    // Missing Number
    expectedSum?: number;
    actualSum?: number;
    xorAccumulator?: number;
    // Product Except Self
    prefixProducts?: number[];
    suffixProducts?: number[];
    // Set Matrix Zeroes
    rowZeroes?: boolean[];
    colZeroes?: boolean[];
    firstRowZero?: boolean;
    firstColZero?: boolean;
  };
}
