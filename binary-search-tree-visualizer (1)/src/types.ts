export type NodeHighlightStatus =
  | 'idle'
  | 'comparing'
  | 'found'
  | 'swapping'
  | 'pruned'
  | 'highlight'
  | 'boundary_active'
  | 'null_slot';

export interface BSTNode {
  id: string;
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
  // Computed layout attributes
  x?: number;
  y?: number;
  level?: number;
  label?: string;
  isVirtualNull?: boolean;
}

export type AlgorithmCategory =
  | 'crud'
  | 'validation'
  | 'range'
  | 'construction'
  | 'relations';

export type AlgorithmId =
  // Category 1: CRUD
  | 'insert'
  | 'search'
  | 'delete'
  // Category 2: Validation & Metrics
  | 'validate'
  | 'find_min_max'
  | 'kth_element'
  | 'recover_bst'
  // Category 3: Range & Pruning
  | 'range_sum'
  | 'prune'
  | 'closest_value'
  // Category 4: Construction & Conversions
  | 'sorted_array_to_bst'
  | 'binary_tree_to_bst'
  | 'bst_from_preorder'
  | 'greater_sum_tree'
  // Category 5: Relations & Successor
  | 'lca'
  | 'successor_predecessor'
  | 'two_sum';

export interface CallStackFrame {
  id: string;
  functionName: string;
  args: string;
  returnValue?: string;
  isActive?: boolean;
}

export interface SimulationStep {
  stepIndex: number;
  treeSnapshot: BSTNode | null;
  description: string;
  activeNodeId?: string | null;
  comparingNodeId?: string | null;
  highlightedNodeIds: Record<string, NodeHighlightStatus>;
  highlightedEdgeKeys: Record<string, 'active' | 'traversed' | 'pruned'>;
  activeCodeLine: number; // 1-based index
  callStack: CallStackFrame[];
  log: string;
  // Optional algorithm-specific helper states
  bounds?: {
    min: number | string;
    max: number | string;
    currentVal?: number;
    isValid?: boolean;
  };
  helperInfo?: {
    label: string;
    value: string;
    badge?: string;
  };
  inorderSuccessorTrace?: {
    targetVal: number;
    successorVal?: number;
    phase: 'searching_target' | 'finding_successor' | 'swapping' | 'deleting_leaf' | 'done';
    details: string;
  };
  rangeSumState?: {
    low: number;
    high: number;
    currentSum: number;
    includedValues: number[];
  };
  kthState?: {
    k: number;
    count: number;
    mode: 'smallest' | 'largest';
    currentVal?: number;
    foundVal?: number;
  };
  lcaState?: {
    p: number;
    q: number;
    currentVal?: number;
    splitFound?: boolean;
    result?: number;
  };
  twoSumState?: {
    target: number;
    leftVal?: number;
    rightVal?: number;
    currentSum?: number;
    found: boolean;
    pair?: [number, number];
  };
  greaterSumState?: {
    runningSum: number;
    currentNodeVal?: number;
    newCumulativeVal?: number;
  };
  recoverBSTState?: {
    firstVal?: number;
    secondVal?: number;
    prevVal?: number;
    phase: 'detecting' | 'swapping' | 'done';
  };
  closestValueState?: {
    target: number;
    closestVal: number;
    minDiff: number;
    currentDiff?: number;
  };
  arrayVisualizer?: {
    label: string;
    elements: number[];
    activeIndex?: number;
    range?: [number, number]; // [left, right]
    midIndex?: number;
  };
}

export interface AlgorithmMetadata {
  id: AlgorithmId;
  title: string;
  category: AlgorithmCategory;
  shortDesc: string;
  timeComplexity: string;
  spaceComplexity: string;
  cppCode: string;
  lineCount: number;
}
