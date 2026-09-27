export type ModuleId = 'prefix-1d' | 'prefix-hashmap' | 'number-theory' | 'integer-math';

export interface Problem {
  id: string;
  seqNumber: number;
  leetcodeTag: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  title: string;
  moduleId: ModuleId;
  description: string;
  details: string;
  invariant: string;
  defaultInput: Record<string, any>;
  inputSchema: {
    type: 'array' | 'number' | 'two-numbers' | 'pow-args' | 'range-add-args';
    labels: string[];
    placeholders?: string[];
  };
}

export interface SimulationStep {
  line: number;
  description: string;
  array?: number[];
  prefixArray?: number[];
  diffArray?: number[];
  leftRightRange?: [number, number]; // [L, R] highlights
  activeIndex?: number;
  activeP?: number; // current prime in sieve
  activeMultiple?: number; // multiple being eliminated
  hashMap?: Record<string, number | number[]>; // key: value or index
  highlightedIndices?: Record<number, 'primary' | 'secondary' | 'accent' | 'emerald' | 'amber' | 'rose' | 'slate'>;
  variables: Record<string, any>;
  logEntry?: string;
}

export interface SimulationData {
  steps: SimulationStep[];
  expectedOutput: string;
}
