export type ProblemCategory = 'opposite' | 'same' | 'kadane';

export interface Problem {
  id: string;
  seq: number;
  title: string;
  leetcodeId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: ProblemCategory;
  description: string;
  invariant: string;
  defaultArray: number[];
  defaultTarget?: number;
  presets: {
    label: string;
    array: number[];
    target?: number;
  }[];
}

export interface SimulationStep {
  index: number;
  line: number;
  array: (number | string)[]; // Can support characters as strings for Palindrome/Reverse
  // Pointer values are indices
  left?: number;
  right?: number;
  slow?: number;
  fast?: number;
  low?: number;
  mid?: number;
  high?: number;
  i?: number;
  j?: number;
  
  // Custom states
  currentSum?: number;
  maxSum?: number;
  target?: number;
  currentArea?: number;
  maxArea?: number;
  
  // Trapping water specific
  leftMax?: number;
  rightMax?: number;
  leftMaxArr?: number[];
  rightMaxArrArr?: number[]; // leftMax/rightMax scanned arrays
  waterLevels?: number[];
  
  // Subarray / Kadane specific
  activeRange?: [number, number] | null;
  bestRange?: [number, number] | null;
  currentMin?: number;
  minSum?: number;
  totalSum?: number;
  maxProd?: number;
  minProd?: number;
  stockProfit?: number;
  minPrice?: number;
  maxAbsSum?: number;

  // Cycle tracking
  cycleTargetIndex?: number; // Linked list cycle target
  
  // UI helper variables
  variables: Record<string, any>;
  description: string;
  log: string;
}

export interface PlaybackState {
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number; // multiplier (0.5, 1, 2)
}
