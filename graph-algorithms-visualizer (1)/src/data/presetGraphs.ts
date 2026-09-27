import { GraphData, AlgorithmMetadata, AlgorithmType } from '../types';

export interface PresetGraphItem {
  id: string;
  name: string;
  recommendedAlgorithm: AlgorithmType;
  description: string;
  graph: GraphData;
  startNodeId?: string;
}

export const ALGORITHM_METADATA_LIST: AlgorithmMetadata[] = [
  // -------------------------------------------------------------
  // LEVEL 1: Traversals & Fundamentals
  // -------------------------------------------------------------
  {
    id: 'bfs',
    name: 'Breadth First Search (BFS)',
    category: '1. Traversals & Foundations',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Shortest path in unweighted graphs, level-order traversal, finding connected components',
    supportsDirected: true,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: 'Explores neighbors layer-by-layer using a First-In-First-Out (FIFO) Queue.',
    requiresStartNode: true,
    problemTitle: 'LeetCode 102 / 127 • Shortest Path Traversal',
    difficulty: 'Easy',
    tags: ['FIFO Queue', 'Level-by-level', 'Shortest Unweighted Path'],
    problemQuestion: 'Given an unweighted graph and a starting vertex S, find the shortest distance (minimum number of edge hops) to all reachable nodes by exploring neighbor layers.'
  },
  {
    id: 'dfs',
    name: 'Depth First Search (DFS)',
    category: '1. Traversals & Foundations',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Maze exploration, topological ordering, connected components, cycle finding',
    supportsDirected: true,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: 'Explores as deep as possible along each branch before backtracking using a Call Stack / LIFO.',
    requiresStartNode: true,
    problemTitle: 'LeetCode 797 • All Paths & Deep Reachability',
    difficulty: 'Medium',
    tags: ['Recursion', 'Backtracking', 'Call Stack'],
    problemQuestion: 'Given a directed/undirected graph, explore all reachable vertices by plunging as deep along each branch as possible before backtracking.'
  },

  // -------------------------------------------------------------
  // LEVEL 2: Cycle Detection
  // -------------------------------------------------------------
  {
    id: 'cycle-undirected',
    name: 'Cycle in Undirected Graph (Parent Tracking)',
    category: '2. Cycle Detection',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Detecting loops in unoriented networks, checking if an undirected graph is a tree',
    supportsDirected: false,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: 'Tracks the parent of each vertex during BFS/DFS traversal. If an adjacent vertex is already visited and is NOT the parent of the current node, an undirected cycle exists!',
    requiresStartNode: true,
    problemTitle: 'GFG / LeetCode • Detect Cycle in an Undirected Graph (BFS Parent Check)',
    difficulty: 'Medium',
    tags: ['BFS Queue {node, parent}', 'Parent Tracking', 'Tree Verification', 'Undirected Cycle'],
    problemQuestion: 'Given an undirected graph, determine whether it contains any cycle. When traversing neighbors of node u, if you discover an already-visited neighbor v that is NOT u\'s direct parent, an undirected loop/cycle exists.'
  },
  {
    id: 'cycle-directed',
    name: 'Cycle in Directed Graph (DFS Recursion Stack)',
    category: '2. Cycle Detection',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Detecting circular dependencies, deadlock loops in directed graphs',
    supportsDirected: true,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: 'Uses DFS tracking nodes currently in the active recursion call stack (pathVis array or 3-color marks). A back-edge to an active stack ancestor confirms a directed cycle!',
    requiresStartNode: true,
    problemTitle: 'LeetCode 207 • Course Schedule I (Directed Cycle Detection)',
    difficulty: 'Medium',
    tags: ['DFS Call Stack', 'Path Visited', 'Back-Edge Detection', 'Recursion Stack'],
    problemQuestion: 'Given a directed graph, determine if any directed cycle exists. Track visited nodes and the active recursion path stack. If you encounter an edge pointing to a node currently in the call stack, a back-edge forms a directed cycle.'
  },
  {
    id: 'cycle-detection',
    name: 'Cycle Detection (General Tri-Color DFS)',
    category: '2. Cycle Detection',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Deadlock detection, circular dependency validation in DAGs',
    supportsDirected: true,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: 'Tracks state using tri-color recursion marks (Unvisited, Visiting/In-Stack, Visited) to identify back-edges.',
    requiresStartNode: true,
    problemTitle: 'LeetCode 207 • Course Schedule I (Cycle Deadlock)',
    difficulty: 'Medium',
    tags: ['3-Color DFS', 'Back-Edge Detection', 'Recursion Stack'],
    problemQuestion: 'Given a directed graph of task dependencies, determine if any cycle exists by identifying back-edges pointing to vertices currently in the active recursion call stack.'
  },

  // -------------------------------------------------------------
  // LEVEL 3: Directed Graphs & Ordering
  // -------------------------------------------------------------
  {
    id: 'toposort',
    name: "Topological Sort (Kahn's BFS)",
    category: '3. DAGs & Topological Ordering',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Dependency resolution, task scheduling, build order in Directed Acyclic Graphs (DAG)',
    supportsDirected: true,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: 'Calculates in-degrees, places zero-degree nodes in a queue, and strips outgoing edges.',
    requiresStartNode: false,
    problemTitle: 'LeetCode 210 • Course Schedule II (Build Order)',
    difficulty: 'Medium',
    tags: ['In-Degree Array', 'DAG', 'Zero In-Degree Queue'],
    problemQuestion: 'There are N courses to take with prerequisite dependencies. Output a valid linear ordering to finish all courses, or detect a deadlock cycle if completion is impossible.'
  },
  {
    id: 'course-schedule',
    name: "Course Schedule I (canFinish • LC 207)",
    category: '3. DAGs & Topological Ordering',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Cycle detection in task dependencies, verifying whether complete graduation is possible',
    supportsDirected: true,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: "Computes course in-degrees (prerequisites count), processes zero in-degree courses using Kahn's BFS queue, and returns true/false whether all courses can be finished.",
    requiresStartNode: false,
    problemTitle: 'LeetCode 207 • Course Schedule I (canFinish)',
    difficulty: 'Medium',
    tags: ['Kahn BFS', 'In-Degree', 'Topological Sort', 'Cycle Deadlock', 'LeetCode 207'],
    problemQuestion: 'There are numCourses courses labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take bi first before taking ai. Return true if you can finish all courses. Otherwise, return false.'
  },
  {
    id: 'course-schedule-2',
    name: "Course Schedule II (findOrder • LC 210)",
    category: '3. DAGs & Topological Ordering',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Constructing exact valid course graduation sequence, returning empty array [] if deadlock detected',
    supportsDirected: true,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: "LeetCode 210: Returns vector<int> findOrder(numCourses, prerequisites). Builds the exact linear order of courses to graduate using Kahn's algorithm, or returns empty array [] if circular prerequisite cycles exist.",
    requiresStartNode: false,
    problemTitle: 'LeetCode 210 • Course Schedule II (findOrder)',
    difficulty: 'Medium',
    tags: ['Topological Sort', 'Kahn BFS', 'In-Degree Queue', 'findOrder', 'LeetCode 210'],
    problemQuestion: 'There are numCourses courses labeled from 0 to numCourses - 1 with prerequisites pairs [ai, bi] meaning to take ai you must first finish bi. Return the ordering of courses you should take to finish all courses. If it is impossible to finish all courses, return an empty array [].'
  },

  // -------------------------------------------------------------
  // LEVEL 4: Grid Graphs & Multi-Source BFS
  // -------------------------------------------------------------
  {
    id: 'flood-fill',
    name: 'Flood Fill (Grid Search)',
    category: '4. Grid Graphs & Multi-Source BFS',
    timeComplexity: 'O(R × C)',
    spaceComplexity: 'O(R × C)',
    bestFor: 'Bucket fill tool, island counting, connected component segmentation in 2D image matrix',
    supportsDirected: false,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: 'Traverses connected 4-way adjacent grid cells with matching color to repaint regions.',
    requiresStartNode: false,
    problemTitle: 'LeetCode 733 • Flood Fill (Paint Bucket Tool)',
    difficulty: 'Easy',
    tags: ['Connected Components', '4-Directional BFS', 'Matrix Repaint'],
    problemQuestion: 'An image is represented by an m x n integer grid. Given starting pixel (sr, sc) and new color, repaint all 4-directionally connected pixels having the original target color.'
  },
  {
    id: 'rotten-oranges',
    name: 'Rotting Oranges (Multi-Source BFS)',
    category: '4. Grid Graphs & Multi-Source BFS',
    timeComplexity: 'O(R × C)',
    spaceComplexity: 'O(R × C)',
    bestFor: 'Multi-source simultaneous spreading, contagion modeling, wildfire propagation',
    supportsDirected: false,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: 'Runs multi-source BFS starting with all initial rotten oranges simultaneously, rotting 4-directional fresh neighbors minute by minute.',
    requiresStartNode: false,
    problemTitle: 'LeetCode 994 • Rotting Oranges (Multi-Source BFS Spread)',
    difficulty: 'Medium',
    tags: ['Multi-Source BFS', 'Queue <r, c, time>', 'Layer-by-Layer Spread'],
    problemQuestion: 'Given an m x n grid with 0 (empty), 1 (fresh), 2 (rotten): every minute, rotten oranges rot their 4-way adjacent fresh neighbors. Return the minimum minutes until no fresh orange remains, or -1 if impossible.'
  },
  {
    id: 'word-search',
    name: 'Word Search (2D Board DFS • LC 79)',
    category: '4. Grid Graphs & Multi-Source BFS',
    timeComplexity: 'O(R × C × 3^L)',
    spaceComplexity: 'O(L)',
    bestFor: 'Grid character search, 2D matrix DFS backtracking with cell reuse prevention',
    supportsDirected: false,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: 'Searches for a word in a 2D character matrix using 4-directional DFS Backtracking. Marked cells (#) are restored upon backtrack to allow alternative paths.',
    requiresStartNode: false,
    problemTitle: 'LeetCode 79 • Word Search (2D Grid DFS Backtracking)',
    difficulty: 'Medium',
    tags: ['2D Board DFS', 'Backtracking', 'Cell Restoration', 'LeetCode 79'],
    problemQuestion: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically neighboring). The same letter cell may not be used more than once.'
  },
  {
    id: 'word-ladder',
    name: 'Word Ladder (Shortest Transformation • LC 127)',
    category: '4. Grid Graphs & Multi-Source BFS',
    timeComplexity: 'O(M² × N)',
    spaceComplexity: 'O(M × N)',
    bestFor: 'Shortest word mutation sequence, graph BFS shortest path with unit edge weights',
    supportsDirected: false,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: 'Finds the length of the shortest transformation sequence from beginWord to endWord where adjacent words differ by exactly 1 character using BFS.',
    requiresStartNode: true,
    requiresTargetNode: true,
    problemTitle: 'LeetCode 127 • Word Ladder (Shortest Mutation BFS)',
    difficulty: 'Hard',
    tags: ['Word Transformation', 'BFS Shortest Path', 'Unit Weight', 'LeetCode 127'],
    problemQuestion: 'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair differs by a single letter, and sk == endWord. Return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if impossible.'
  },

  // -------------------------------------------------------------
  // LEVEL 5: Shortest Path Algorithms
  // -------------------------------------------------------------
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm (Min-Heap SSSP)",
    category: '5. Shortest Path Algorithms',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    bestFor: 'Single-source shortest path with non-negative edge weights',
    supportsDirected: true,
    requiresWeights: true,
    supportsNegativeWeights: false,
    description: 'Greedily extracts the minimum tentative distance node using a Min-Heap Priority Queue.',
    requiresStartNode: true,
    requiresTargetNode: true,
    problemTitle: 'LeetCode 743 • Network Delay Time (Min-Heap SSSP)',
    difficulty: 'Medium',
    tags: ['Greedy', 'Priority Queue', 'Single-Source Shortest Path'],
    problemQuestion: 'You have a network of nodes connected by weighted edges (delay times >= 0). What is the minimum cost/time required for a signal from source S to reach target nodes?'
  },
  {
    id: 'bellman-ford',
    name: 'Bellman-Ford Algorithm (Negative Weights)',
    category: '5. Shortest Path Algorithms',
    timeComplexity: 'O(V × E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Shortest path handling negative edge weights and detecting negative weight cycles',
    supportsDirected: true,
    requiresWeights: true,
    supportsNegativeWeights: true,
    description: 'Relaxes all edges |V|-1 times, then conducts a |V|-th pass to catch negative cycles.',
    requiresStartNode: true,
    problemTitle: 'LeetCode 787 • Negative Weights & Arbitrage Cycle',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'Edge Relaxation', 'Negative Cycle Detection'],
    problemQuestion: 'Compute shortest path distances from source S when edge weights may be negative. Detect whether the network contains a negative-weight cycle allowing infinite cost reduction.'
  },
  {
    id: 'cheapest-flights',
    name: 'Cheapest Flights Within K Stops',
    category: '5. Shortest Path Algorithms',
    timeComplexity: 'O(K × E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Constrained routing, flight ticketing with max layovers, bounded hop-count shortest paths',
    supportsDirected: true,
    requiresWeights: true,
    supportsNegativeWeights: false,
    description: 'Modified BFS / Bellman-Ford tracking a queue of (stops, city, cost) with min-cost array to avoid exceeding the K layover budget.',
    requiresStartNode: true,
    requiresTargetNode: true,
    problemTitle: 'LeetCode 787 • Cheapest Flights Within K Stops',
    difficulty: 'Medium',
    tags: ['Modified BFS', 'Bellman-Ford', 'Hop Count Limit', 'Price Relaxation', 'LeetCode 787'],
    problemQuestion: 'There are n cities connected by flights with prices. Given src, dst, and max intermediate stops k, find the cheapest flight price from src to dst with at most k stops. If no such route exists within k stops, return -1.'
  },

  // -------------------------------------------------------------
  // LEVEL 6: Minimum Spanning Trees (MST)
  // -------------------------------------------------------------
  {
    id: 'prim',
    name: "Prim's Algorithm (Greedy Cut Property)",
    category: '6. Minimum Spanning Trees',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    bestFor: 'Dense graphs to build a Minimum Spanning Tree from an arbitrary root node',
    supportsDirected: false,
    requiresWeights: true,
    supportsNegativeWeights: true,
    description: 'Grows an MST one edge at a time by picking the minimum cut edge with a Min-Heap.',
    requiresStartNode: true,
    problemTitle: 'LeetCode 1584 • Min Cost to Connect All Points',
    difficulty: 'Medium',
    tags: ['Greedy MST', 'Cut Property', 'Priority Queue'],
    problemQuestion: 'Find a subset of edges that connects all vertices together with minimum total edge weight, starting from a root node and greedily adding the cheapest crossing edge.'
  },
  {
    id: 'kruskal',
    name: "Kruskal's Algorithm (DSU Union-Find)",
    category: '6. Minimum Spanning Trees',
    timeComplexity: 'O(E log E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Sparse graphs to build an MST by sorting edges and avoiding cycles with Disjoint Set Union',
    supportsDirected: false,
    requiresWeights: true,
    supportsNegativeWeights: true,
    description: 'Sorts all edges globally, incrementally joining components using Disjoint Set Union (DSU).',
    requiresStartNode: false,
    problemTitle: 'LeetCode 1135 • Connecting Cities with Minimum Cost',
    difficulty: 'Medium',
    tags: ['Disjoint Set Union', 'Edge Sorting', 'Greedy MST'],
    problemQuestion: 'Sort all graph edges by weight in ascending order. Greedily pick edges that do not form cycles using Disjoint Set Union (DSU) until |V|-1 edges form the MST.'
  },

  // -------------------------------------------------------------
  // LEVEL 7: Euler Tours & Word Chains
  // -------------------------------------------------------------
  {
    id: 'eulerian-circuit',
    name: "Eulerian Circuit & Path (Hierholzer's Tour)",
    category: '7. Euler Tours & Word Chains',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V + E)',
    bestFor: 'Chinese Postman Problem, DNA fragment assembly, garbage truck / street sweep route optimization',
    supportsDirected: false,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: "Verifies that all vertices have even degrees, then uses Hierholzer's algorithm with an edge-removal stack to trace a closed Eulerian circuit.",
    requiresStartNode: true,
    problemTitle: 'Eulerian Circuit (Hierholzer’s Complete Edge Tour)',
    difficulty: 'Hard',
    tags: ['Hierholzer Algorithm', 'Degree Parity', 'Edge Backtracking Stack', 'Seven Bridges', 'Euler Tour'],
    problemQuestion: 'Given an undirected connected graph, determine if an Eulerian circuit exists (all vertices have even degree). Construct a closed trail that visits every single edge in the graph exactly once and returns to the starting vertex.'
  },
  {
    id: 'circle-of-strings',
    name: 'Circle of Strings (Eulerian Tour on Words)',
    category: '7. Euler Tours & Word Chains',
    timeComplexity: 'O(N + 26)',
    spaceComplexity: 'O(26)',
    bestFor: 'Chaining words/strings in a closed loop, word chain games, genome sequencing',
    supportsDirected: true,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: 'Constructs a directed graph where vertices are characters and words are directed edges (first_char -> last_char). A circle of strings exists iff in-degree equals out-degree for all characters AND all active characters form a single Strongly Connected Component.',
    requiresStartNode: false,
    problemTitle: 'GFG / LeetCode Hard • Circle of Strings (Chaining Words in a Loop)',
    difficulty: 'Hard',
    tags: ['Eulerian Circuit', 'Character Graph', 'In-Degree == Out-Degree', 'Strongly Connected', 'Word Chaining'],
    problemQuestion: 'Given an array of strings, determine if they can be chained in a circle such that the last character of each string equals the first character of the next string, and the last string chains back to the first. Modeled as finding an Eulerian Circuit on a character graph.'
  },

  // -------------------------------------------------------------
  // LEVEL 8: Network Connectivity & Real-World Failures (Placed Last)
  // -------------------------------------------------------------
  {
    id: 'kosaraju',
    name: "Kosaraju's Strongly Connected Components (SCC)",
    category: '8. Network Connectivity & Failures',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Partitioning directed graphs into Strongly Connected Components (SCC)',
    supportsDirected: true,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: 'Uses forward DFS finish times, reverses graph edges (transpose), then extracts SCC clusters.',
    requiresStartNode: false,
    problemTitle: 'Strongly Connected Components (SCC Decomposition)',
    difficulty: 'Hard',
    tags: ['Graph Transpose G^T', 'Finish-time Stack', 'Two-Pass DFS'],
    problemQuestion: 'Decompose a directed graph into maximal subgraphs where every vertex in an SCC can reach every other vertex. Uses forward finish-time DFS and backward traversal on G^T.'
  },
  {
    id: 'critical-connections',
    name: "Critical Connections (Bridges in Network)",
    category: '8. Network Connectivity & Failures',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Identifying single points of failure and vulnerability in communications & computer networks',
    supportsDirected: false,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: "Tarjan's algorithm computes discovery times tin[u] and lowest reachable ancestor low[u]. An edge (u, v) is a critical bridge if low[v] > tin[u].",
    requiresStartNode: false,
    problemTitle: 'LeetCode 1192 • Critical Connections in a Network (Tarjan’s Bridges)',
    difficulty: 'Hard',
    tags: ['Tarjan DFS', 'Bridges (Cut Edges)', 'Discovery Time tin', 'Lowest Ancestor low', 'LeetCode 1192'],
    problemQuestion: 'There are n servers numbered 0 to n - 1 and a list of undirected connections. A critical connection (bridge) is an edge that, if removed, will make some servers unable to communicate with others. Return all critical connections in the network.'
  },
  {
    id: 'articulation-points',
    name: 'Articulation Points (Cut Vertices)',
    category: '8. Network Connectivity & Failures',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Identifying critical router/server nodes whose individual crash disconnects the network',
    supportsDirected: false,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: "In the DFS tree, root is a cut vertex if it has >= 2 children. Non-root u is a cut vertex if it has a child v such that low[v] >= tin[u].",
    requiresStartNode: false,
    problemTitle: 'Cut Vertices / Articulation Points in Undirected Graph',
    difficulty: 'Hard',
    tags: ['Cut Vertices', 'Tarjan DFS', 'Subtree Low-Link', 'Critical Routers', 'Graph Biconnectivity'],
    problemQuestion: 'An articulation point (cut vertex) is a vertex whose removal strictly increases the number of connected components of the graph. Find all articulation points in an undirected graph.'
  },
  {
    id: 'network-connected',
    name: 'Make Network Connected (Cable Rewiring)',
    category: '8. Network Connectivity & Failures',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Optimizing infrastructure cabling with minimum cable rewiring across disjoint clusters',
    supportsDirected: false,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: 'Counts connected components and extracts redundant cycle cables using DSU/DFS. If cables >= n - 1, answer is components - 1.',
    requiresStartNode: false,
    problemTitle: 'LeetCode 1319 • Number of Operations to Make Network Connected',
    difficulty: 'Medium',
    tags: ['Disjoint Set Union (DSU)', 'Connected Components', 'Redundant Cables', 'Cycle Detection'],
    problemQuestion: 'There are n computers numbered from 0 to n - 1 and an array of cabling connections. You can extract redundant cables (cables that form cycles) and connect them between any two disconnected computers. Return the minimum number of operations to connect all computers, or -1 if total cables < n - 1.'
  },
  {
    id: 'covid-spread',
    name: 'COVID-19 Social Network Infection',
    category: '8. Network Connectivity & Failures',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    bestFor: 'Epidemic contagion modeling, viral marketing propagation, rumor transmission in social networks',
    supportsDirected: false,
    requiresWeights: false,
    supportsNegativeWeights: false,
    description: 'Multi-source BFS spreading infection along social contact edges day by day until no newly exposed contacts remain.',
    requiresStartNode: true,
    problemTitle: 'COVID-19 Contact Network Infection Spread & Quarantine',
    difficulty: 'Medium',
    tags: ['Multi-Source BFS', 'Contagion Wave', 'Contact Tracing', 'R0 Transmission', 'Epidemic Curve'],
    problemQuestion: 'In a community contact network, patient zero(s) carry a contagious virus at Day 0. Every day, infected individuals transmit the virus to all directly connected uninfected contacts. Track the daily contagion wave, quarantined nodes, and days to epidemic containment.'
  }
];

export const PRESET_GRAPHS: PresetGraphItem[] = [
  {
    id: 'weighted-network',
    name: 'Highway Network (Dijkstra/Prim)',
    recommendedAlgorithm: 'dijkstra',
    description: '6-node weighted network with multiple route choices and distinct edge costs.',
    startNodeId: 'A',
    graph: {
      isDirected: false,
      nodes: [
        { id: 'A', label: 'A', x: 120, y: 220 },
        { id: 'B', label: 'B', x: 260, y: 110 },
        { id: 'C', label: 'C', x: 260, y: 330 },
        { id: 'D', label: 'D', x: 440, y: 110 },
        { id: 'E', label: 'E', x: 440, y: 330 },
        { id: 'F', label: 'F', x: 580, y: 220 }
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', weight: 4, directed: false },
        { id: 'e2', source: 'A', target: 'C', weight: 2, directed: false },
        { id: 'e3', source: 'B', target: 'C', weight: 1, directed: false },
        { id: 'e4', source: 'B', target: 'D', weight: 5, directed: false },
        { id: 'e5', source: 'C', target: 'D', weight: 8, directed: false },
        { id: 'e6', source: 'C', target: 'E', weight: 10, directed: false },
        { id: 'e7', source: 'D', target: 'E', weight: 2, directed: false },
        { id: 'e8', source: 'D', target: 'F', weight: 6, directed: false },
        { id: 'e9', source: 'E', target: 'F', weight: 3, directed: false }
      ]
    }
  },
  {
    id: 'dag-build-order',
    name: 'Task Dependencies DAG (Topological)',
    recommendedAlgorithm: 'toposort',
    description: 'Directed Acyclic Graph with clean dependency ordering (e.g. software build order).',
    startNodeId: 'A',
    graph: {
      isDirected: true,
      nodes: [
        { id: 'A', label: 'A', x: 120, y: 140 },
        { id: 'B', label: 'B', x: 120, y: 300 },
        { id: 'C', label: 'C', x: 300, y: 140 },
        { id: 'D', label: 'D', x: 300, y: 300 },
        { id: 'E', label: 'E', x: 480, y: 220 },
        { id: 'F', label: 'F', x: 620, y: 220 }
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'C', weight: 1, directed: true },
        { id: 'e2', source: 'A', target: 'D', weight: 1, directed: true },
        { id: 'e3', source: 'B', target: 'D', weight: 1, directed: true },
        { id: 'e4', source: 'C', target: 'E', weight: 1, directed: true },
        { id: 'e5', source: 'D', target: 'E', weight: 1, directed: true },
        { id: 'e6', source: 'E', target: 'F', weight: 1, directed: true }
      ]
    }
  },
  {
    id: 'negative-weights-graph',
    name: 'Negative Edge Network (Bellman-Ford)',
    recommendedAlgorithm: 'bellman-ford',
    description: 'Directed graph with positive and negative weights, demonstrating edge relaxation without cycles.',
    startNodeId: 'A',
    graph: {
      isDirected: true,
      nodes: [
        { id: 'A', label: 'A', x: 140, y: 220 },
        { id: 'B', label: 'B', x: 280, y: 120 },
        { id: 'C', label: 'C', x: 280, y: 320 },
        { id: 'D', label: 'D', x: 460, y: 120 },
        { id: 'E', label: 'E', x: 460, y: 320 }
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', weight: 6, directed: true },
        { id: 'e2', source: 'A', target: 'C', weight: 7, directed: true },
        { id: 'e3', source: 'B', target: 'D', weight: 5, directed: true },
        { id: 'e4', source: 'C', target: 'D', weight: -3, directed: true },
        { id: 'e5', source: 'C', target: 'E', weight: 9, directed: true },
        { id: 'e6', source: 'D', target: 'B', weight: -2, directed: true },
        { id: 'e7', source: 'B', target: 'E', weight: -4, directed: true }
      ]
    }
  },
  {
    id: 'negative-cycle-demo',
    name: 'Negative Cycle Trap (Bellman-Ford)',
    recommendedAlgorithm: 'bellman-ford',
    description: 'Contains a negative-weight cycle (B -> C -> D -> B sum = -2), triggering cycle alarm.',
    startNodeId: 'A',
    graph: {
      isDirected: true,
      nodes: [
        { id: 'A', label: 'A', x: 120, y: 220 },
        { id: 'B', label: 'B', x: 280, y: 130 },
        { id: 'C', label: 'C', x: 440, y: 220 },
        { id: 'D', label: 'D', x: 280, y: 310 },
        { id: 'E', label: 'E', x: 580, y: 220 }
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', weight: 3, directed: true },
        { id: 'e2', source: 'B', target: 'C', weight: 2, directed: true },
        { id: 'e3', source: 'C', target: 'D', weight: -6, directed: true },
        { id: 'e4', source: 'D', target: 'B', weight: 2, directed: true },
        { id: 'e5', source: 'C', target: 'E', weight: 4, directed: true }
      ]
    }
  },
  {
    id: 'scc-clusters',
    name: 'Strongly Connected Components (Kosaraju)',
    recommendedAlgorithm: 'kosaraju',
    description: 'Partitioned into 3 distinct SCC groups: {A, B, C}, {D, E}, and {F}.',
    startNodeId: 'A',
    graph: {
      isDirected: true,
      nodes: [
        { id: 'A', label: 'A', x: 140, y: 150 },
        { id: 'B', label: 'B', x: 260, y: 150 },
        { id: 'C', label: 'C', x: 200, y: 290 },
        { id: 'D', label: 'D', x: 420, y: 150 },
        { id: 'E', label: 'E', x: 420, y: 290 },
        { id: 'F', label: 'F', x: 580, y: 220 }
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', weight: 1, directed: true },
        { id: 'e2', source: 'B', target: 'C', weight: 1, directed: true },
        { id: 'e3', source: 'C', target: 'A', weight: 1, directed: true },
        { id: 'e4', source: 'B', target: 'D', weight: 1, directed: true },
        { id: 'e5', source: 'D', target: 'E', weight: 1, directed: true },
        { id: 'e6', source: 'E', target: 'D', weight: 1, directed: true },
        { id: 'e7', source: 'E', target: 'F', weight: 1, directed: true }
      ]
    }
  },
  {
    id: 'mst-mesh',
    name: 'Dense MST Mesh (Prim / Kruskal)',
    recommendedAlgorithm: 'kruskal',
    description: 'Complete 5-node interconnected mesh with diverse edge weights for spanning tree formation.',
    startNodeId: 'A',
    graph: {
      isDirected: false,
      nodes: [
        { id: 'A', label: 'A', x: 180, y: 140 },
        { id: 'B', label: 'B', x: 460, y: 140 },
        { id: 'C', label: 'C', x: 540, y: 320 },
        { id: 'D', label: 'D', x: 320, y: 380 },
        { id: 'E', label: 'E', x: 120, y: 320 }
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', weight: 3, directed: false },
        { id: 'e2', source: 'B', target: 'C', weight: 1, directed: false },
        { id: 'e3', source: 'C', target: 'D', weight: 7, directed: false },
        { id: 'e4', source: 'D', target: 'E', weight: 2, directed: false },
        { id: 'e5', source: 'E', target: 'A', weight: 6, directed: false },
        { id: 'e6', source: 'A', target: 'C', weight: 8, directed: false },
        { id: 'e7', source: 'A', target: 'D', weight: 5, directed: false },
        { id: 'e8', source: 'B', target: 'D', weight: 4, directed: false }
      ]
    }
  },
  {
    id: 'cycle-graph',
    name: 'Cycle Testing Graph (Directed/Undirected)',
    recommendedAlgorithm: 'cycle-detection',
    description: 'Directed graph with a forward branch and a closed loop (B -> C -> D -> B).',
    startNodeId: 'A',
    graph: {
      isDirected: true,
      nodes: [
        { id: 'A', label: 'A', x: 130, y: 220 },
        { id: 'B', label: 'B', x: 280, y: 140 },
        { id: 'C', label: 'C', x: 440, y: 140 },
        { id: 'D', label: 'D', x: 360, y: 310 },
        { id: 'E', label: 'E', x: 560, y: 220 }
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', weight: 1, directed: true },
        { id: 'e2', source: 'B', target: 'C', weight: 1, directed: true },
        { id: 'e3', source: 'C', target: 'D', weight: 1, directed: true },
        { id: 'e4', source: 'D', target: 'B', weight: 1, directed: true },
        { id: 'e5', source: 'C', target: 'E', weight: 1, directed: true }
      ]
    }
  },
  {
    id: 'bridges-network',
    name: 'Critical Network Bridges (LeetCode 1192)',
    recommendedAlgorithm: 'critical-connections',
    description: 'Server network with 2 robust server clusters (A-B-C) and (D-E-F) joined by a single critical bridge C-D.',
    startNodeId: 'A',
    graph: {
      isDirected: false,
      nodes: [
        { id: 'A', label: 'A', x: 130, y: 150 },
        { id: 'B', label: 'B', x: 260, y: 150 },
        { id: 'C', label: 'C', x: 195, y: 280 },
        { id: 'D', label: 'D', x: 395, y: 280 },
        { id: 'E', label: 'E', x: 330, y: 150 },
        { id: 'F', label: 'F', x: 460, y: 150 }
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', weight: 1, directed: false },
        { id: 'e2', source: 'B', target: 'C', weight: 1, directed: false },
        { id: 'e3', source: 'C', target: 'A', weight: 1, directed: false },
        { id: 'e4', source: 'C', target: 'D', weight: 1, directed: false }, // Critical Bridge!
        { id: 'e5', source: 'D', target: 'E', weight: 1, directed: false },
        { id: 'e6', source: 'E', target: 'F', weight: 1, directed: false },
        { id: 'e7', source: 'F', target: 'D', weight: 1, directed: false }
      ]
    }
  },
  {
    id: 'articulation-bowtie',
    name: 'Cut Vertices / Bowtie Graph',
    recommendedAlgorithm: 'articulation-points',
    description: 'Classic dumbbell / bowtie graph where vertex C is a critical articulation point joining two loops.',
    startNodeId: 'A',
    graph: {
      isDirected: false,
      nodes: [
        { id: 'A', label: 'A', x: 140, y: 160 },
        { id: 'B', label: 'B', x: 140, y: 320 },
        { id: 'C', label: 'C', x: 300, y: 240 }, // Cut Vertex!
        { id: 'D', label: 'D', x: 460, y: 160 },
        { id: 'E', label: 'E', x: 460, y: 320 },
        { id: 'F', label: 'F', x: 600, y: 240 }
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', weight: 1, directed: false },
        { id: 'e2', source: 'B', target: 'C', weight: 1, directed: false },
        { id: 'e3', source: 'C', target: 'A', weight: 1, directed: false },
        { id: 'e4', source: 'C', target: 'D', weight: 1, directed: false },
        { id: 'e5', source: 'C', target: 'E', weight: 1, directed: false },
        { id: 'e6', source: 'D', target: 'F', weight: 1, directed: false },
        { id: 'e7', source: 'E', target: 'F', weight: 1, directed: false }
      ]
    }
  },
  {
    id: 'network-connected-demo',
    name: 'Disjoint Clusters & Redundant Cables (LC 1319)',
    recommendedAlgorithm: 'network-connected',
    description: '6 computers in 3 disconnected groups with redundant loop cables that can be moved to connect all nodes.',
    startNodeId: '0',
    graph: {
      isDirected: false,
      nodes: [
        { id: '0', label: '0', x: 140, y: 150 },
        { id: '1', label: '1', x: 260, y: 150 },
        { id: '2', label: '2', x: 200, y: 270 },
        { id: '3', label: '3', x: 280, y: 270 },
        { id: '4', label: '4', x: 460, y: 160 },
        { id: '5', label: '5', x: 580, y: 240 }
      ],
      edges: [
        { id: 'e1', source: '0', target: '1', weight: 1, directed: false },
        { id: 'e2', source: '1', target: '2', weight: 1, directed: false },
        { id: 'e3', source: '2', target: '0', weight: 1, directed: false }, // Cycle in cluster {0,1,2}
        { id: 'e4', source: '0', target: '3', weight: 1, directed: false },
        { id: 'e5', source: '4', target: '5', weight: 1, directed: false }
      ]
    }
  },
  {
    id: 'eulerian-envelope',
    name: 'Eulerian Envelope (All Degrees Even)',
    recommendedAlgorithm: 'eulerian-circuit',
    description: '5-vertex house graph with all vertices having even degree (deg 2 or 4), ensuring an Eulerian circuit.',
    startNodeId: 'A',
    graph: {
      isDirected: false,
      nodes: [
        { id: 'A', label: 'A', x: 300, y: 120 }, // Top roof apex (deg 4)
        { id: 'B', label: 'B', x: 180, y: 220 }, // Upper left (deg 4)
        { id: 'C', label: 'C', x: 420, y: 220 }, // Upper right (deg 4)
        { id: 'D', label: 'D', x: 180, y: 360 }, // Bottom left (deg 2)
        { id: 'E', label: 'E', x: 420, y: 360 }  // Bottom right (deg 2)
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', weight: 1, directed: false },
        { id: 'e2', source: 'A', target: 'C', weight: 1, directed: false },
        { id: 'e3', source: 'B', target: 'C', weight: 1, directed: false },
        { id: 'e4', source: 'B', target: 'D', weight: 1, directed: false },
        { id: 'e5', source: 'C', target: 'E', weight: 1, directed: false },
        { id: 'e6', source: 'D', target: 'E', weight: 1, directed: false },
        { id: 'e7', source: 'A', target: 'D', weight: 1, directed: false },
        { id: 'e8', source: 'A', target: 'E', weight: 1, directed: false }
      ]
    }
  },
  {
    id: 'cheapest-flights-map',
    name: 'Airline Network (K Stops Budget)',
    recommendedAlgorithm: 'cheapest-flights',
    description: 'Flight routes: Direct JFK->LAX is $500 (0 stops), JFK->ORD->LAX is $200 (1 stop), and multi-hop is $100 (3 stops).',
    startNodeId: 'JFK',
    graph: {
      isDirected: true,
      nodes: [
        { id: 'JFK', label: 'JFK', x: 120, y: 220 },
        { id: 'ORD', label: 'ORD', x: 280, y: 140 },
        { id: 'DEN', label: 'DEN', x: 440, y: 140 },
        { id: 'ATL', label: 'ATL', x: 280, y: 320 },
        { id: 'DFW', label: 'DFW', x: 440, y: 320 },
        { id: 'LAX', label: 'LAX', x: 600, y: 220 }
      ],
      edges: [
        { id: 'e1', source: 'JFK', target: 'LAX', weight: 500, directed: true }, // Direct, expensive
        { id: 'e2', source: 'JFK', target: 'ORD', weight: 100, directed: true },
        { id: 'e3', source: 'ORD', target: 'LAX', weight: 100, directed: true }, // 1 stop via ORD = 200 total!
        { id: 'e4', source: 'JFK', target: 'ATL', weight: 80, directed: true },
        { id: 'e5', source: 'ATL', target: 'DFW', weight: 40, directed: true },
        { id: 'e6', source: 'DFW', target: 'LAX', weight: 50, directed: true }  // 2 stops via ATL, DFW = 170
      ]
    }
  },
  {
    id: 'covid-social-network',
    name: 'Community Contact Network (COVID Spread)',
    recommendedAlgorithm: 'covid-spread',
    description: 'Social contact graph showing transmission waves from Patient Zero (Node A) through community clusters.',
    startNodeId: 'A',
    graph: {
      isDirected: false,
      nodes: [
        { id: 'A', label: 'P0', x: 140, y: 220 }, // Patient zero
        { id: 'B', label: 'B', x: 260, y: 140 },
        { id: 'C', label: 'C', x: 260, y: 300 },
        { id: 'D', label: 'D', x: 400, y: 140 },
        { id: 'E', label: 'E', x: 400, y: 300 },
        { id: 'F', label: 'F', x: 540, y: 140 },
        { id: 'G', label: 'G', x: 540, y: 300 }
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', weight: 1, directed: false },
        { id: 'e2', source: 'A', target: 'C', weight: 1, directed: false },
        { id: 'e3', source: 'B', target: 'D', weight: 1, directed: false },
        { id: 'e4', source: 'C', target: 'E', weight: 1, directed: false },
        { id: 'e5', source: 'D', target: 'E', weight: 1, directed: false },
        { id: 'e6', source: 'D', target: 'F', weight: 1, directed: false },
        { id: 'e7', source: 'E', target: 'G', weight: 1, directed: false }
      ]
    }
  },
  {
    id: 'course-schedule-curriculum',
    name: 'CS Curriculum Prerequisites (LeetCode 207/210)',
    recommendedAlgorithm: 'course-schedule',
    description: 'Computer Science curriculum DAG: CS101 -> CS102 -> Algorithms -> Operating Systems.',
    startNodeId: 'CS101',
    graph: {
      isDirected: true,
      nodes: [
        { id: 'CS101', label: 'CS101', x: 120, y: 160 },
        { id: 'MATH', label: 'MATH', x: 120, y: 300 },
        { id: 'CS102', label: 'CS102', x: 280, y: 160 },
        { id: 'DS', label: 'DS', x: 280, y: 300 },
        { id: 'ALGO', label: 'ALGO', x: 450, y: 160 },
        { id: 'OS', label: 'OS', x: 450, y: 300 },
        { id: 'AI', label: 'AI', x: 600, y: 230 }
      ],
      edges: [
        { id: 'e1', source: 'CS101', target: 'CS102', weight: 1, directed: true },
        { id: 'e2', source: 'CS102', target: 'DS', weight: 1, directed: true },
        { id: 'e3', source: 'MATH', target: 'DS', weight: 1, directed: true },
        { id: 'e4', source: 'DS', target: 'ALGO', weight: 1, directed: true },
        { id: 'e5', source: 'CS102', target: 'OS', weight: 1, directed: true },
        { id: 'e6', source: 'ALGO', target: 'AI', weight: 1, directed: true }
      ]
    }
  },
  {
    id: 'cycle-undirected-graph',
    name: 'Undirected Graph with Cycle (1-2-3-1)',
    recommendedAlgorithm: 'cycle-undirected',
    description: 'Undirected network featuring a 3-node cycle (1-2-3) and a tail (2-4-5) to test BFS parent tracking.',
    startNodeId: '1',
    graph: {
      isDirected: false,
      nodes: [
        { id: '1', label: '1', x: 160, y: 160 },
        { id: '2', label: '2', x: 300, y: 160 },
        { id: '3', label: '3', x: 230, y: 300 },
        { id: '4', label: '4', x: 440, y: 160 },
        { id: '5', label: '5', x: 560, y: 160 }
      ],
      edges: [
        { id: 'e1', source: '1', target: '2', weight: 1, directed: false },
        { id: 'e2', source: '2', target: '3', weight: 1, directed: false },
        { id: 'e3', source: '3', target: '1', weight: 1, directed: false },
        { id: 'e4', source: '2', target: '4', weight: 1, directed: false },
        { id: 'e5', source: '4', target: '5', weight: 1, directed: false }
      ]
    }
  },
  {
    id: 'cycle-directed-graph',
    name: 'Directed Graph with Cycle (A → B → C → D → B)',
    recommendedAlgorithm: 'cycle-directed',
    description: 'Directed graph with a back-edge loop between B, C, and D demonstrating recursion stack (pathVis) detection.',
    startNodeId: 'A',
    graph: {
      isDirected: true,
      nodes: [
        { id: 'A', label: 'A', x: 120, y: 220 },
        { id: 'B', label: 'B', x: 260, y: 140 },
        { id: 'C', label: 'C', x: 400, y: 140 },
        { id: 'D', label: 'D', x: 330, y: 280 },
        { id: 'E', label: 'E', x: 540, y: 220 }
      ],
      edges: [
        { id: 'e1', source: 'A', target: 'B', weight: 1, directed: true },
        { id: 'e2', source: 'B', target: 'C', weight: 1, directed: true },
        { id: 'e3', source: 'C', target: 'D', weight: 1, directed: true },
        { id: 'e4', source: 'D', target: 'B', weight: 1, directed: true }, // Back-edge cycle
        { id: 'e5', source: 'C', target: 'E', weight: 1, directed: true }
      ]
    }
  },
  {
    id: 'circle-of-strings-graph',
    name: 'Circle of Strings (for → rig → geek → kaf)',
    recommendedAlgorithm: 'circle-of-strings',
    description: 'Character transition graph modeling words ["for", "rig", "geek", "kaf"] forming a closed Eulerian loop (f → r → g → k → f).',
    startNodeId: 'f',
    graph: {
      isDirected: true,
      nodes: [
        { id: 'f', label: "'f'", x: 180, y: 150 },
        { id: 'r', label: "'r'", x: 460, y: 150 },
        { id: 'g', label: "'g'", x: 460, y: 310 },
        { id: 'k', label: "'k'", x: 180, y: 310 }
      ],
      edges: [
        { id: 'e1', source: 'f', target: 'r', weight: 1, directed: true }, // "for"
        { id: 'e2', source: 'r', target: 'g', weight: 1, directed: true }, // "rig"
        { id: 'e3', source: 'g', target: 'k', weight: 1, directed: true }, // "geek"
        { id: 'e4', source: 'k', target: 'f', weight: 1, directed: true }  // "kaf"
      ]
    }
  },
  {
    id: 'course-schedule-2-valid',
    name: 'Course Schedule II: Solvable DAG (LC 210 Ex 2)',
    recommendedAlgorithm: 'course-schedule-2',
    description: 'LeetCode 210 standard example: 4 courses (0,1,2,3). Course 0 unlocks 1 and 2, which both lead to 3. findOrder returns [0, 1, 2, 3].',
    startNodeId: '0',
    graph: {
      isDirected: true,
      nodes: [
        { id: '0', label: 'Course 0', x: 140, y: 220 },
        { id: '1', label: 'Course 1', x: 320, y: 140 },
        { id: '2', label: 'Course 2', x: 320, y: 300 },
        { id: '3', label: 'Course 3', x: 500, y: 220 }
      ],
      edges: [
        { id: 'e1', source: '0', target: '1', weight: 1, directed: true }, // [1, 0]: take 0 before 1
        { id: 'e2', source: '0', target: '2', weight: 1, directed: true }, // [2, 0]: take 0 before 2
        { id: 'e3', source: '1', target: '3', weight: 1, directed: true }, // [3, 1]: take 1 before 3
        { id: 'e4', source: '2', target: '3', weight: 1, directed: true }  // [3, 2]: take 2 before 3
      ]
    }
  },
  {
    id: 'course-schedule-2-cycle',
    name: 'Course Schedule II: Deadlock Cycle (returns [])',
    recommendedAlgorithm: 'course-schedule-2',
    description: 'LeetCode 210 deadlock testcase: 3 courses with circular prerequisite loop (0 -> 1 -> 2 -> 0). findOrder cannot schedule any course and returns [].',
    startNodeId: '0',
    graph: {
      isDirected: true,
      nodes: [
        { id: '0', label: 'Course 0', x: 200, y: 150 },
        { id: '1', label: 'Course 1', x: 420, y: 150 },
        { id: '2', label: 'Course 2', x: 310, y: 310 }
      ],
      edges: [
        { id: 'e1', source: '0', target: '1', weight: 1, directed: true }, // 0 -> 1
        { id: 'e2', source: '1', target: '2', weight: 1, directed: true }, // 1 -> 2
        { id: 'e3', source: '2', target: '0', weight: 1, directed: true }  // 2 -> 0 circular loop!
      ]
    }
  },
  {
    id: 'word-ladder-graph',
    name: 'Word Ladder: hit → hot → dot/lot → dog/log → cog',
    recommendedAlgorithm: 'word-ladder',
    description: 'LeetCode 127 canonical example: beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]. Minimum transformation sequence length = 5.',
    startNodeId: 'hit',
    graph: {
      isDirected: false,
      nodes: [
        { id: 'hit', label: 'hit', x: 100, y: 220 },
        { id: 'hot', label: 'hot', x: 240, y: 220 },
        { id: 'dot', label: 'dot', x: 380, y: 140 },
        { id: 'lot', label: 'lot', x: 380, y: 300 },
        { id: 'dog', label: 'dog', x: 520, y: 140 },
        { id: 'log', label: 'log', x: 520, y: 300 },
        { id: 'cog', label: 'cog', x: 650, y: 220 }
      ],
      edges: [
        { id: 'e1', source: 'hit', target: 'hot', weight: 1, directed: false },
        { id: 'e2', source: 'hot', target: 'dot', weight: 1, directed: false },
        { id: 'e3', source: 'hot', target: 'lot', weight: 1, directed: false },
        { id: 'e4', source: 'dot', target: 'dog', weight: 1, directed: false },
        { id: 'e5', source: 'dot', target: 'lot', weight: 1, directed: false },
        { id: 'e6', source: 'lot', target: 'log', weight: 1, directed: false },
        { id: 'e7', source: 'dog', target: 'log', weight: 1, directed: false },
        { id: 'e8', source: 'dog', target: 'cog', weight: 1, directed: false },
        { id: 'e9', source: 'log', target: 'cog', weight: 1, directed: false }
      ]
    }
  }
];
