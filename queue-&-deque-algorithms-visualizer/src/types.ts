export type AlgorithmId =
  | '01' // Standard Linear Queue
  | '02' // Design Circular Queue
  | '03' // Design Circular Deque
  | '04' // Implement Queue using Stacks
  | '05' // Implement Stack using Queues
  | '06' // Sliding Window Maximum
  | '07' // Longest Continuous Subarray With Absolute Diff <= Limit
  | '08' // Shortest Subarray with Sum at Least K
  | '09' // First Non-Repeating Character in a Stream
  | '10' // Moving Average from Data Stream
  | '11' // Reveal Cards In Increasing Order
  | '12' // Rotting Oranges
  | '13' // Gas Station / Circular Tour
  | '14' // Task Scheduler
  | '15' // LRU Cache
  | '16' // Binary Tree Level Order Traversal
  | '17' // Number of Recent Calls
  | '18' // Design Bounded Blocking Queue
  | '19' // Queue Reconstruction by Height
  | '20'; // 0-1 BFS Shortest Path using Deque

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface QueueProblem {
  id: AlgorithmId;
  sequenceNum: number;
  leetcodeTag: string;
  difficulty: Difficulty;
  title: string;
  description: string;
  keyInsight: string;
  defaultInput: Record<string, any>;
  cppSnippetId: string;
  category: string;
}

export interface SimulationStep {
  stepIndex: number;
  line: number; // line number of C++ code trace to highlight
  explanation: string;
  logs: string[]; // chronological logs up to this step
  
  // Queue & Deque Visual States
  queue?: (string | number | null)[];
  front?: number | null;
  rear?: number | null;
  count?: number;
  capacity?: number;

  // Stacks & Queues (LC #232 / LC #225)
  stack1?: (string | number)[];
  stack2?: (string | number)[];
  queue1?: (string | number)[];
  queue2?: (string | number)[];
  activeTransfer?: boolean;

  // Sliding Window / Arrays
  array?: (number | string)[];
  prefixSums?: number[]; // for LC 862
  windowL?: number | null;
  windowR?: number | null;
  deque?: (number | string)[]; // indices or values
  maxDeque?: (number | string)[]; // for LC 1438
  minDeque?: (number | string)[]; // for LC 1438
  ans?: any;

  // Stream Processing
  charFreq?: Record<string, number>;
  firstNonRepeating?: string | null;

  // Moving Average
  sum?: number;
  average?: number;

  // Reveal Cards & Tree Traversal Levels
  deck?: number[];
  revealed?: any[];

  // Rotting Oranges (Grid BFS)
  grid?: number[][]; // 0=empty, 1=fresh, 2=rotten
  orangeQueue?: [number, number, number][]; // [r, c, mins]
  freshCount?: number;
  minutes?: number;
  activeCells?: [number, number][]; // cells currently being scanned/rotting

  // Gas Station / Circular Tour
  gas?: number[];
  cost?: number[];
  tank?: number;
  totalSurplus?: number;
  startCandidate?: number;
  activeStation?: number | null;

  // Task Scheduler
  tasks?: string[];
  taskCooldowns?: Record<string, number>;
  taskCounts?: Record<string, number>;
  scheduleResult?: string[];
  time?: number;

  // Highlights / Pointers
  highlightedIndices?: number[];
  pointers?: Record<string, number | null>;
}
