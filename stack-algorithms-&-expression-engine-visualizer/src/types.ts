export type ProblemId =
  | 'basic-stack'
  | 'valid-parentheses'
  | 'min-stack'
  | 'queue-using-stacks'
  | 'infix-to-postfix'
  | 'infix-to-prefix'
  | 'evaluate-postfix'
  | 'evaluate-prefix'
  | 'postfix-to-infix'
  | 'prefix-to-infix'
  | 'basic-calculator'
  | 'next-greater-element'
  | 'daily-temperatures'
  | 'online-stock-span'
  | 'largest-rectangle'
  | 'maximal-rectangle'
  | 'trapping-rain-water'
  | 'asteroid-collision'
  | 'remove-k-digits';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Problem {
  id: ProblemId;
  seq: string;
  title: string;
  leetcode: string;
  difficulty: Difficulty;
  description: string;
  keyInsight: string;
  defaultInput: string;
  inputType: 'text' | 'array' | 'none';
  inputPlaceholder: string;
}

export interface StackItem {
  id: string;
  value: string | number;
  subValue?: string | number; // e.g. minVal for MinStack, index/span, etc.
  isHighlighted?: boolean;
}

export interface TokenItem {
  value: string;
  type: 'operand' | 'operator' | 'parenthesis' | 'space' | 'unknown';
  isScanned?: boolean;
  isActive?: boolean;
}

export interface PrecedenceComparison {
  op1: string;
  op2: string;
  prec1: number;
  prec2: number;
  result: 'push' | 'pop' | 'pop-all' | 'none';
  reason: string;
}

export interface MonotonicState {
  invariant: string;
  poppedElement?: string | number;
  nearestSmaller?: string | number;
}

export interface HistogramState {
  currentWidth: number;
  currentHeight: number;
  currentArea: number;
  maxArea: number;
  activeIndices: number[];
  leftBoundary?: number;
  rightBoundary?: number;
}

export interface TrappingRainWaterState {
  trapped: number[];
  leftMax: number[];
  rightMax: number[];
  currentLeft: number;
  currentRight: number;
  totalWater: number;
}

export interface AsteroidState {
  collided: boolean;
  activeLeft?: number;
  activeRight?: number;
}

export interface SimulationStep {
  stepIndex: number;
  description: string;
  line: number;
  stack: StackItem[];
  secondaryStack?: StackItem[]; // for custom problems like queue-using-stacks (outStack) or basic-calc
  inputTokens?: TokenItem[];
  inputCursor?: number;
  outputString?: string;
  variables: Record<string, any>;
  precedenceCompare?: PrecedenceComparison;
  monotonicState?: MonotonicState;
  histogramState?: HistogramState;
  waterState?: TrappingRainWaterState;
  asteroidState?: AsteroidState;
  logs: string[];
}
