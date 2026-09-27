export type AlgorithmType =
  | 'bfs'
  | 'dfs'
  | 'cycle-undirected'
  | 'cycle-directed'
  | 'cycle-detection'
  | 'toposort'
  | 'course-schedule'
  | 'course-schedule-2'
  | 'flood-fill'
  | 'rotten-oranges'
  | 'dijkstra'
  | 'bellman-ford'
  | 'cheapest-flights'
  | 'prim'
  | 'kruskal'
  | 'eulerian-circuit'
  | 'circle-of-strings'
  | 'word-ladder'
  | 'word-search'
  | 'kosaraju'
  | 'critical-connections'
  | 'articulation-points'
  | 'network-connected'
  | 'covid-spread';

export interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  weight: number;
  directed: boolean;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  isDirected: boolean;
}

export type NodeVisualStatus = 'idle' | 'testing' | 'active' | 'visited' | 'path' | 'cycle' | 'cut' | 'infected' | 'quarantined';
export type EdgeVisualStatus = 'idle' | 'evaluating' | 'tree' | 'cross' | 'path' | 'cycle' | 'bridge';

export interface TraceDataStructure {
  type: 'queue' | 'stack' | 'priority_queue' | 'dsu' | 'indegree' | 'components' | 'grid' | 'hierholzer' | 'bridges' | 'word_chain';
  title: string;
  items: Array<{ label: string; value?: string | number; badge?: string; status?: 'active' | 'queued' | 'popped' }>;
  dsuParent?: Record<string, string>;
  dsuRank?: Record<string, number>;
  inDegrees?: Record<string, number>;
  components?: string[][];
}

export interface ExecutionStep {
  stepIndex: number;
  totalSteps?: number;
  cppLine: number;
  description: string;
  phase?: string;
  nodeStates: Record<string, NodeVisualStatus>;
  edgeStates: Record<string, EdgeVisualStatus>;
  visited: Record<string, boolean>;
  distances?: Record<string, number | null>;
  parents?: Record<string, string | null>;
  dataStructure: TraceDataStructure;
  variables?: Record<string, string | number>;
  cycleDetected?: boolean;
  negativeCycle?: boolean;
  mstTotalWeight?: number;
  topoOrder?: string[];
  sccList?: string[][];
  activeNodeId?: string | null;
  activeEdgeId?: string | null;
  // Specific algorithm metrics
  bridges?: string[];
  articulationPoints?: string[];
  eulerCircuit?: string[];
  wordChain?: string[];
  redundantEdgesCount?: number;
  componentsCount?: number;
  flightsCost?: number;
  stopsTaken?: number;
  covidStats?: { infected: number; healthy: number; day: number };
  wordLadder?: { beginWord: string; endWord: string; ladderLength: number; path: string[] };
  wordSearchState?: {
    board: string[][];
    targetWord: string;
    matchedIndex: number;
    currentCell?: [number, number];
    path: [number, number][];
    found?: boolean;
  };
  // Grid representation for Flood Fill and Rotten Oranges
  gridState?: {
    grid: number[][];
    activeCell?: [number, number];
    visitedCells?: [number, number][];
    targetColor?: number;
    replacementColor?: number;
    minutesElapsed?: number;
    freshRemaining?: number;
    rottenCount?: number;
    isRottenOranges?: boolean;
    impossible?: boolean;
  };
}

export interface AlgorithmMetadata {
  id: AlgorithmType;
  name: string;
  category: string;
  timeComplexity: string;
  spaceComplexity: string;
  bestFor: string;
  supportsDirected: boolean;
  requiresWeights: boolean;
  supportsNegativeWeights: boolean;
  description: string;
  requiresStartNode: boolean;
  requiresTargetNode?: boolean;
  // Problem question & competitive programming mapping
  problemTitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  problemQuestion: string;
  exampleInput?: string;
  exampleOutput?: string;
  constraints?: string[];
}
