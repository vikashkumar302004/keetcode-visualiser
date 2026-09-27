export type ProblemPattern = 
  | 'fixed'
  | 'variable'
  | 'target'
  | 'exact-k';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface TestCasePreset {
  name: string;
  input: string; // e.g. "2, 1, 5, 1, 3, 2" or "ADOBECODEBANC"
  paramK?: number;
  paramTarget?: string; // string or number representation
  description: string;
}

export interface ProblemDefinition {
  id: string;
  seq: number;
  pattern: ProblemPattern;
  patternLabel: string;
  difficulty: Difficulty;
  leetcodeNumber?: number;
  title: string;
  summary: string;
  invariant: string;
  inputType: 'array' | 'string' | 'string-array';
  paramLabel?: string; // e.g. "Window Size (k)", "Target Sum (S)", "Max Distinct (k)"
  defaultK?: number;
  paramTargetLabel?: string; // e.g. "Target String (t)", "Threshold (avg)"
  defaultTarget?: string;
  presets: TestCasePreset[];
  timeComplexity: string;
  spaceComplexity: string;
}

export interface DequeItem {
  index: number;
  value: number | string;
  isFront: boolean;
}

export interface QueueItem {
  index: number;
  value: number | string;
}

export type ActionType = 
  | 'init'
  | 'expand'
  | 'shrink'
  | 'slide'
  | 'record'
  | 'check'
  | 'done';

export interface SimulationStep {
  stepIndex: number;
  totalSteps: number;
  left: number | null;
  right: number | null;
  action: ActionType;
  actionDescription: string;
  codeLine: number; // 1-indexed in the C++ snippet
  isValidWindow: boolean;
  currentMetricLabel: string;
  currentMetricValue: string | number;
  targetLabel?: string;
  targetValue?: string | number;
  bestResultLabel: string;
  bestResultValue: string | number;
  bestWindowRange?: [number, number] | null;
  frequencyMap?: Record<string, number>;
  requiredFrequencyMap?: Record<string, number>;
  matchedCount?: number;
  requiredCount?: number;
  monotonicDeque?: DequeItem[];
  auxiliaryQueue?: QueueItem[];
  variables: Record<string, string | number | boolean>;
  logMessage: string;
}

export interface SimulationResult {
  steps: SimulationStep[];
  finalOutput: string | number | boolean | (number | string)[];
}
