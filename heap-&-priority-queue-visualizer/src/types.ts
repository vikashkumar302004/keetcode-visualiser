export type HeapType = 'max' | 'min';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ProblemCategory = 
  | 'Core Heap Foundations'
  | 'Top-K Elements Pattern'
  | 'Two-Heap Balancing Pattern'
  | 'K-Way Merge Pattern'
  | 'Heap on Pairs & Intervals Pattern'
  | 'Greedy Priority Queue Pattern';

export type NodeState = 
  | 'default'
  | 'comparing'
  | 'violation'
  | 'swapping'
  | 'satisfied'
  | 'extracted'
  | 'active';

export interface ResultOutput {
  label: string;
  value: string | number | any[];
  isFinal?: boolean;
  unit?: string;
  history?: (string | number)[];
  details?: string;
}

export interface HeapNodeItem {
  value: number;
  label?: string;
  subLabel?: string;
}

export interface DualHeapState {
  isDual: boolean;
  maxHeap: number[];
  minHeap: number[];
  maxHeapLabels?: string[];
  minHeapLabels?: string[];
  maxHeapStates?: Record<number, NodeState>;
  minHeapStates?: Record<number, NodeState>;
  currentMedian?: number | string | null;
  incomingElement?: number | null;
  balanceStatus?: 'balanced' | 'rebalancing' | 'inserting' | 'popping';
}

export interface HeapifyInspectorData {
  currentIndex: number;
  parentIndex: number;
  leftIndex: number;
  rightIndex: number;
  candidateIndex: number;
  formula: string;
}

export interface TopKInspectorData {
  k: number;
  incomingVal: number | string;
  currentTop: number | string;
  comparisonResult: string;
  currentHeapCount: number;
  frequencyMap?: Record<string, number>;
}

export interface TwoHeapInspectorData {
  maxHeapSize: number;
  minHeapSize: number;
  median: number | string;
  invariantSatisfied: boolean;
  balanceDiff: number;
}

export interface KWayInspectorData {
  listPointers: { listId: number; index: number; value: number; totalItems: number }[];
  mergedOutput: number[];
  currentMinPopped?: number;
}

export interface GreedyInspectorData {
  totalCost?: number;
  lastMergedPair?: [number, number];
  currentPairsPopped?: number[];
  queueState?: { item: string; readyAt: number }[];
  currentUnit?: number;
  scheduleOutput?: string[];
}

export interface PairsInspectorData {
  pairsInHeap: { pair: [number, number] | number[]; metric: number | string; label?: string }[];
  resultPairs: ([number, number] | number[] | string)[];
  currentExtracted?: [number, number] | number[];
  details?: string;
}

export interface InspectorState {
  type: 'heapify' | 'topk' | 'twoheap' | 'kway' | 'greedy' | 'heapsort' | 'pairs';
  heapify?: HeapifyInspectorData;
  topK?: TopKInspectorData;
  twoHeap?: TwoHeapInspectorData;
  kWay?: KWayInspectorData;
  greedy?: GreedyInspectorData;
  pairs?: PairsInspectorData;
}

export interface SimulationStep {
  stepNumber: number;
  description: string;
  cppLineNumber: number;
  heap: number[];
  heapLabels?: string[];
  heapType: HeapType;
  nodeStates: Record<number, NodeState>;
  comparingIndices: number[];
  swappingIndices: number[];
  satisfiedIndices: number[];
  extractedIndices?: number[];
  arrayHighlight?: {
    indices: number[];
    type: 'compare' | 'swap' | 'sorted' | 'active';
    label?: string;
  };
  dualHeap?: DualHeapState;
  inspectorState: InspectorState;
  callStack: string[];
  logEntry?: string;
  extraInfo?: Record<string, any>;
  resultOutput?: ResultOutput;
}

export interface TestCaseParam {
  key: string;
  label: string;
  type: 'array' | 'number' | 'string' | 'matrix';
  defaultValue: any;
  placeholder?: string;
}

export interface ProblemDefinition {
  id: string;
  sequenceNumber: number;
  title: string;
  leetCodeNum?: number | string;
  difficulty: Difficulty;
  category: ProblemCategory;
  description: string;
  constraints: string[];
  complexity: {
    time: string;
    space: string;
  };
  algorithmicInsight: string;
  defaultHeapType: HeapType;
  params: TestCaseParam[];
  defaultTestCase: Record<string, any>;
  expectedOutputFormula?: (testCase: Record<string, any>) => string;
}
