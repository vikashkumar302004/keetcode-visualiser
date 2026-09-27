export type ProblemId =
  | 'factorial'
  | 'fibonacci'
  | 'sum_n'
  | 'array_sum'
  | 'binary_search'
  | 'binary_exponentiation'
  | 'reverse_palindrome'
  | 'tower_of_hanoi'
  | 'subsets_1'
  | 'subsets_2'
  | 'combination_sum_1'
  | 'combination_sum_2'
  | 'letter_combinations'
  | 'permutations_1'
  | 'permutations_2'
  | 'palindrome_partitioning'
  | 'n_queens'
  | 'sudoku_solver'
  | 'word_search'
  | 'rat_in_maze';

export type NodeState =
  | 'active'       // Pulsing amber badge: current executing call
  | 'success'      // Emerald leaf: base case reached (valid solution/leaf)
  | 'fail'         // Rose leaf: base case reached (dead end/pruned)
  | 'backtracking' // Backtracking animation indicator
  | 'completed'    // Completed subtree (dimmed state)
  | 'idle';        // Discovered but not yet entered or resolved

export interface TreeNode {
  id: string;
  label: string;
  choice?: string; // e.g. "+ nums[i]" or "exclude" or "board[r][c] = Q"
  parentId: string | null;
  state: NodeState;
  depth: number;
  result?: string; // Return value of this call once completed
}

export interface CallStackFrame {
  id: string;
  name: string;
  params: Record<string, string | number | boolean | number[] | string[]>;
  depth: number;
}

// Physical workspace states
export interface HanoiState {
  pegs: Record<'A' | 'B' | 'C', number[]>;
  moveCount: number;
}

export interface ChessboardState {
  size: number;
  queens: { row: number; col: number }[]; // Coordinates of active Queens
  conflicts: {
    rows: Set<number>;
    cols: Set<number>;
    diag1: Set<number>; // row - col
    diag2: Set<number>; // row + col
  };
  trialCell?: { row: number; col: number; valid: boolean };
}

export interface SudokuState {
  grid: number[][]; // 9x9 grid, 0 for empty
  original: boolean[][]; // Is cell pre-filled/fixed?
  conflictCell?: { row: number; col: number } | null;
}

export interface Grid2DState {
  grid: string[][]; // 2D characters or cells
  rows: number;
  cols: number;
  path: [number, number][]; // coordinates traversed
  visited: boolean[][];
  word?: string; // for word search, the target word
  wordIndex?: number; // for word search, index of character being matched
  targetX?: number; // for rat in maze
  targetY?: number;
}

export interface SimulationStep {
  stepIndex: number;
  activeNodeId: string | null;
  treeNodes: Record<string, TreeNode>;
  callStack: CallStackFrame[];
  currentPath: string[]; // for subsets/permutations accumulator path representation
  boardState?: {
    hanoi?: HanoiState;
    queens?: ChessboardState;
    sudoku?: SudokuState;
    grid2d?: Grid2DState;
  };
  description: string;
  highlightedLine: number; // 1-indexed line of C++ code to highlight
  solutions: any[]; // Accumulated solution outputs found so far
  metrics: {
    nodesVisited: number;
    maxDepth: number;
    validLeaves: number;
    prunedBranches: number;
  };
  choices: string[]; // List of available choices at this stack level
}

export interface ProblemMetadata {
  id: ProblemId;
  index: string; // e.g., "#01"
  leetcode?: string; // e.g., "LC #78"
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title: string;
  category: string;
  invariant: string;
  descriptionText: string;
  questionStatement?: string; // Plain English question details
  sampleTestCase?: string;    // Clear parameters representation
  expectedOutput?: string;    // Expected target solution representation
  defaultInputs: Record<string, any>;
  cppCode: string;
  cppLineMap: Record<string, number>; // Maps logical code steps to line numbers
}
