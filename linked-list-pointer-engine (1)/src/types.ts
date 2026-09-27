/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AlgorithmId =
  | 'reverse-list'
  | 'reverse-list-ii'
  | 'swap-pairs'
  | 'reverse-k-group'
  | 'merge-two'
  | 'add-two'
  | 'merge-k'
  | 'partition-list'
  | 'remove-duplicates'
  | 'remove-duplicates-ii'
  | 'odd-even'
  | 'rotate-list'
  | 'delete-node'
  | 'remove-nth'
  | 'flatten-multilevel'
  | 'reorder-list'
  | 'palindrome-list'
  | 'intersection-list';

export interface ListNodeState {
  id: string; // unique identifier, e.g., "node-1"
  val: number | string;
  nextId: string | null; // next pointer targets which node id
  childId?: string | null; // for flatten-multilevel
  address: string; // e.g. "0x01", "0x02", "nullptr"
  isDummy?: boolean;
  isBypassed?: boolean; // visually struck out or bypassed
  isChildNode?: boolean; // nested track node for flatten multilevel
  originalTrack?: number; // 0 for head/l1, 1 for l2, etc.
}

export interface PointerState {
  dummy?: string | null;
  prev?: string | null;
  curr?: string | null;
  next?: string | null;
  head?: string | null;
  tail?: string | null;
  groupPrev?: string | null;
  groupStart?: string | null;
  groupEnd?: string | null;
  groupNext?: string | null;
  lessHead?: string | null;
  lessTail?: string | null;
  greaterHead?: string | null;
  greaterTail?: string | null;
  p1?: string | null;
  p2?: string | null;
  evenHead?: string | null;
  even?: string | null;
  odd?: string | null;
  fast?: string | null;
  slow?: string | null;
  temp?: string | null;
  childHead?: string | null;
}

export interface BrokenLinkState {
  fromNodeId: string;
  toNodeId: string | null;
  isRewiredBackward: boolean; // if link curves backwards
}

export interface SimulationStep {
  stepIndex: number;
  description: string;
  lineHighlight: number; // line index in the C++ snippet (1-based)
  nodes: ListNodeState[]; // memory snapshot of nodes
  tracks: {
    title: string;
    nodeIds: string[]; // ordering of nodes to render in this track
    childTrackNodeIds?: string[]; // secondary horizontal sub-track for multilevel children
  }[];
  pointers: PointerState;
  brokenLinks: BrokenLinkState[];
  carry?: number | null; // for Add Two Numbers
  mathState?: {
    val1?: number;
    val2?: number;
    sum?: number;
    carry?: number;
    newDigit?: number;
  };
  partitionState?: {
    lessIds: string[];
    greaterIds: string[];
  };
  kGroupBracket?: {
    startId: string;
    endId: string;
    k: number;
  } | null;
  logs: string[]; // chronological history of operations up to this step
}

export interface ProblemMetadata {
  id: AlgorithmId;
  title: string;
  leetcodeTag: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  keyInvariant: string;
  defaultValues: string; // e.g. "1 -> 2 -> 3 -> 4 -> 5"
  defaultParams: Record<string, number>; // e.g. { k: 2, left: 2, right: 4 }
  paramLabels: Record<string, string>; // labels for custom input UI
  questionText?: string;
  exampleInput?: string;
  expectedOutput?: string;
}
