/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface VisualNode {
  id: number;
  val: string | number;
  next: number | null;
  // Visual positions (to draw custom Lasso/Loop or Linear path)
  x?: number;
  y?: number;
  // For palindrome/reorder, to show reversing
  isReversed?: boolean;
  isDeleted?: boolean;
}

export interface SimulationStep {
  stepIndex: number;
  slowIndex: number | null; // index in the visual node list
  fastIndex: number | null; // index in the visual node list
  prevSlowIndex?: number | null; // specific to delete middle
  pointer1Index?: number | null; // Phase 2 slow / ptr1
  pointer2Index?: number | null; // Phase 2 fast / ptr2
  nodes: VisualNode[];
  phase: string;
  isCollision: boolean;
  collisionIndex: number | null;
  description: string;
  cppLine: number;
  metrics: {
    steps: number;
    distance?: string | number;
    slowVal?: string | number;
    fastVal?: string | number;
    cycleLength?: number | null;
    ptr1Val?: string | number;
    ptr2Val?: string | number;
  };
  logMessage: string;
  // Custom states for Happy Number
  happyNumberState?: {
    currentSlow: number;
    currentFast: number;
    slowSumSteps: string;
    fastSumSteps: string;
  };
  // Custom states for LeetCode #287 and LeetCode #457 Array mapping
  arrayState?: {
    nums: number[];
    slowIndex: number;
    fastIndex: number;
    slowNextIndex: number;
    fastNextIndex: number;
  };
}

export interface Problem {
  id: string;
  orderIndex: number;
  title: string;
  leetcodeNum: string;
  difficulty: Difficulty;
  category: 'Middle Node' | 'Cycle Detection' | 'Cyclic Array';
  description: string;
  detailedDescription: string;
  expectedExplanation: string;
  invariant: string;
  defaultValues: number[];
  defaultPos: number; // For cycles, index of node where cycle starts, -1 if no cycle
  cppSnippetId: string;
}
