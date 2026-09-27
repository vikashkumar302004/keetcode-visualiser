export type AlgorithmId =
  | 'reverse_words'
  | 'longest_common_prefix'
  | 'valid_anagram'
  | 'isomorphic_strings'
  | 'atoi'
  | 'string_compression'
  | 'valid_palindrome'
  | 'longest_palindromic_substring'
  | 'palindromic_substrings_count'
  | 'strstr_naive'
  | 'kmp_lps'
  | 'kmp_search'
  | 'repeated_substring'
  | 'rabin_karp'
  | 'z_algorithm'
  | 'manacher';

export interface ProblemMetadata {
  id: AlgorithmId;
  sequenceNum: number;
  category: string;
  title: string;
  leetcodeTag: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  invariant: string;
  details: string;
  defaultText: string;
  defaultPattern: string;
  expectedOutput: string;
}

export type CellState = 'neutral' | 'matched' | 'mismatched' | 'scanning' | 'prefix' | 'suffix' | 'highlight' | 'active';

export interface SimulationStep {
  stepIndex: number;
  line: number; // line number in C++ code snippet (1-based)
  description: string;
  
  // Basic input states for display
  text: string;
  pattern: string;
  
  // Pointer indices
  textPointer: number;      // 'i' or core index
  patternPointer: number;   // 'j', 'len', or second index
  twoPointers?: {
    left: number;
    right: number;
    write?: number;
  };
  
  // Custom cell states
  textStates: Record<number, CellState>;
  patternStates: Record<number, CellState>;
  
  // Sliding Pattern Alignment offset (the starting index where P aligns with T)
  slidingOffset?: number;
  
  // KMP specific
  lps?: number[];
  skipArc?: {
    from: number; // visual index in P (or relative text)
    to: number;
  } | null;
  matchedIndices?: number[];
  
  // Rabin-Karp specific
  hashTarget?: number;
  hashCurrent?: number;
  hashWindowStart?: number;
  spuriousHit?: boolean;
  hashBase?: number;
  hashMod?: number;
  hashPower?: number; // base^(m-1) % mod
  
  // Z-Algorithm specific
  zArray?: number[];
  zBoxL?: number;
  zBoxR?: number;
  
  // Manacher specific
  manacherP?: number[];
  manacherString?: string;
  manacherCenter?: number;
  manacherRight?: number;
  manacherMirror?: number;
  manacherCurrentRadius?: number;
  
  // Isomorphic specific
  mappingStoT?: Record<string, string>;
  mappingTtoS?: Record<string, string>;
  
  // Anagram / Frequency specific
  charFrequency?: Record<string, number>;
  charFrequencyDelta?: Record<string, number>; // Delta chart info
  
  // atoi state
  atoiState?: {
    sign: number;
    num: number;
    stage: 'whitespace' | 'sign' | 'digits' | 'clamp' | 'done';
  };
  
  // Longest Common Prefix specific
  lcpCurrentPrefix?: string;
  lcpStringIndex?: number; // which string is being checked
  lcpStringsList?: string[];
  
  // Variables & Call stack tracking
  vars: Record<string, any>;
}
