import {
  AlgorithmType,
  GraphData,
  ExecutionStep,
  NodeVisualStatus,
  EdgeVisualStatus
} from '../types';
import {
  generateCriticalConnectionsSteps,
  generateArticulationPointsSteps,
  generateMakeConnectedSteps,
  generateEulerianCircuitSteps,
  generateCheapestFlightsSteps,
  generateCovidSpreadSteps,
  generateCourseScheduleSteps,
  generateCourseSchedule2Steps,
  generateCycleUndirectedSteps,
  generateCycleDirectedSteps,
  generateCircleOfStringsSteps,
  generateWordLadderSteps,
  generateWordSearchSteps
} from './advancedEngine';

export function buildAdjacencyList(graph: GraphData) {
  const adj: Record<string, Array<{ target: string; weight: number; edgeId: string }>> = {};
  for (const node of graph.nodes) {
    adj[node.id] = [];
  }
  for (const edge of graph.edges) {
    if (!adj[edge.source]) adj[edge.source] = [];
    adj[edge.source].push({ target: edge.target, weight: edge.weight, edgeId: edge.id });
    if (!graph.isDirected && !edge.directed) {
      if (!adj[edge.target]) adj[edge.target] = [];
      adj[edge.target].push({ target: edge.source, weight: edge.weight, edgeId: edge.id });
    }
  }
  return adj;
}

export function buildAdjacencyMatrix(graph: GraphData) {
  const nodes = graph.nodes.map(n => n.id);
  const matrix: Record<string, Record<string, number | null>> = {};
  for (const u of nodes) {
    matrix[u] = {};
    for (const v of nodes) {
      matrix[u][v] = null;
    }
  }
  for (const edge of graph.edges) {
    if (matrix[edge.source]) {
      matrix[edge.source][edge.target] = edge.weight;
    }
    if (!graph.isDirected && !edge.directed && matrix[edge.target]) {
      matrix[edge.target][edge.source] = edge.weight;
    }
  }
  return { nodes, matrix };
}

export function generateAlgorithmSteps(
  algorithm: AlgorithmType,
  graph: GraphData,
  startNodeId: string,
  targetNodeId?: string,
  gridData?: { grid: number[][]; startCell: [number, number]; targetColor?: number },
  wordSearchData?: { board?: string[][]; targetWord?: string }
): ExecutionStep[] {
  const steps: ExecutionStep[] = [];
  const nodeIds = graph.nodes.map(n => n.id);
  const edgeIds = graph.edges.map(e => e.id);

  const initNodeStates: Record<string, NodeVisualStatus> = {};
  nodeIds.forEach(id => { initNodeStates[id] = 'idle'; });

  const initEdgeStates: Record<string, EdgeVisualStatus> = {};
  edgeIds.forEach(id => { initEdgeStates[id] = 'idle'; });

  const initVisited: Record<string, boolean> = {};
  nodeIds.forEach(id => { initVisited[id] = false; });

  const initDist: Record<string, number | null> = {};
  nodeIds.forEach(id => { initDist[id] = null; });

  const initParents: Record<string, string | null> = {};
  nodeIds.forEach(id => { initParents[id] = null; });

  const adj = buildAdjacencyList(graph);

  // Helper to find edge ID
  const findEdge = (u: string, v: string) => {
    return graph.edges.find(
      e => (e.source === u && e.target === v) || (!graph.isDirected && !e.directed && e.source === v && e.target === u)
    );
  };

  const safeStart = nodeIds.includes(startNodeId) ? startNodeId : (nodeIds[0] || 'A');

  switch (algorithm) {
    case 'bfs': {
      // 1. void bfs(int start, const vector<vector<int>>& adj, int n)
      // 2. vector<bool> visited(n, false);
      // 3. queue<int> q;
      // 5. visited[start] = true;
      // 6. q.push(start);
      // 8. while (!q.empty()) {
      // 9. int u = q.front();
      // 10. q.pop();
      // 13. for (int v : adj[u]) {
      // 14. if (!visited[v]) {
      // 15. visited[v] = true;
      // 16. q.push(v);
      const visited = { ...initVisited };
      const nodeStates = { ...initNodeStates };
      const edgeStates = { ...initEdgeStates };
      const queue: string[] = [];

      steps.push({
        stepIndex: 0,
        cppLine: 2,
        description: `Initialize visited array of size ${nodeIds.length} with all false, allocate FIFO queue.`,
        phase: 'Initialization',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...visited },
        dataStructure: {
          type: 'queue',
          title: 'Queue (FIFO)',
          items: []
        }
      });

      visited[safeStart] = true;
      queue.push(safeStart);
      nodeStates[safeStart] = 'active';

      steps.push({
        stepIndex: steps.length,
        cppLine: 5,
        description: `Mark starting node ${safeStart} visited: visited[${safeStart}] = true.`,
        phase: 'Enqueue Start',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...visited },
        activeNodeId: safeStart,
        dataStructure: {
          type: 'queue',
          title: 'Queue (FIFO)',
          items: [{ label: safeStart, status: 'queued' }]
        }
      });

      steps.push({
        stepIndex: steps.length,
        cppLine: 6,
        description: `Push starting node ${safeStart} into queue: q.push(${safeStart}).`,
        phase: 'Enqueue Start',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...visited },
        activeNodeId: safeStart,
        dataStructure: {
          type: 'queue',
          title: 'Queue (FIFO)',
          items: [{ label: safeStart, status: 'queued' }]
        }
      });

      while (queue.length > 0) {
        steps.push({
          stepIndex: steps.length,
          cppLine: 8,
          description: `Queue is not empty (size = ${queue.length}). Continue BFS loop.`,
          phase: 'Loop Check',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          dataStructure: {
            type: 'queue',
            title: 'Queue (FIFO)',
            items: queue.map((n, i) => ({ label: n, status: i === 0 ? 'active' : 'queued' }))
          }
        });

        const u = queue.shift()!;
        nodeStates[u] = 'active';

        steps.push({
          stepIndex: steps.length,
          cppLine: 9,
          description: `Extract front node: u = ${u}. Processing neighbors of ${u}.`,
          phase: 'Node Visit',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          activeNodeId: u,
          variables: { u },
          dataStructure: {
            type: 'queue',
            title: 'Queue (FIFO)',
            items: queue.map(n => ({ label: n, status: 'queued' }))
          }
        });

        const neighbors = adj[u] || [];
        for (const neighbor of neighbors) {
          const v = neighbor.target;
          const edge = findEdge(u, v);
          const edgeId = edge ? edge.id : '';

          if (edgeId) {
            edgeStates[edgeId] = 'evaluating';
          }

          steps.push({
            stepIndex: steps.length,
            cppLine: 13,
            description: `Examine neighbor v = ${v} adjacent to u = ${u}. Check if visited[${v}] is false.`,
            phase: 'Edge Inspection',
            nodeStates: { ...nodeStates, [v]: visited[v] ? nodeStates[v] : 'testing' },
            edgeStates: { ...edgeStates },
            visited: { ...visited },
            activeNodeId: u,
            activeEdgeId: edgeId,
            variables: { u, v, 'visited[v]': String(visited[v]) },
            dataStructure: {
              type: 'queue',
              title: 'Queue (FIFO)',
              items: queue.map(n => ({ label: n, status: 'queued' }))
            }
          });

          if (!visited[v]) {
            visited[v] = true;
            queue.push(v);
            nodeStates[v] = 'testing';
            if (edgeId) edgeStates[edgeId] = 'tree';

            steps.push({
              stepIndex: steps.length,
              cppLine: 15,
              description: `Unvisited neighbor found: visited[${v}] = true. Push ${v} to queue.`,
              phase: 'Neighbor Enqueued',
              nodeStates: { ...nodeStates },
              edgeStates: { ...edgeStates },
              visited: { ...visited },
              activeNodeId: v,
              activeEdgeId: edgeId,
              variables: { u, v, 'visited[v]': 'true' },
              dataStructure: {
                type: 'queue',
                title: 'Queue (FIFO)',
                items: queue.map(n => ({ label: n, status: 'queued' }))
              }
            });
          } else {
            if (edgeId && edgeStates[edgeId] !== 'tree') {
              edgeStates[edgeId] = 'cross';
            }
          }
        }

        nodeStates[u] = 'visited';
        steps.push({
          stepIndex: steps.length,
          cppLine: 18,
          description: `Finished processing all neighbors of node ${u}. Node marked visited.`,
          phase: 'Node Complete',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          activeNodeId: u,
          dataStructure: {
            type: 'queue',
            title: 'Queue (FIFO)',
            items: queue.map(n => ({ label: n, status: 'queued' }))
          }
        });
      }

      steps.push({
        stepIndex: steps.length,
        cppLine: 19,
        description: `Queue is empty. BFS traversal complete. Explored all reachable vertices from ${safeStart}.`,
        phase: 'Complete',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...visited },
        dataStructure: {
          type: 'queue',
          title: 'Queue (FIFO)',
          items: []
        }
      });
      break;
    }

    case 'dfs': {
      // 1. void dfs(int u, const vector<vector<int>>& adj, vector<bool>& visited)
      // 2. visited[u] = true;
      // 5. for (int v : adj[u]) {
      // 6. if (!visited[v]) {
      // 8. dfs(v, adj, visited);
      // 11. // Backtrack from node u
      // 14. void run_dfs(int start, ...)
      // 15. vector<bool> visited(n, false);
      // 16. dfs(start, adj, visited);
      const visited = { ...initVisited };
      const nodeStates = { ...initNodeStates };
      const edgeStates = { ...initEdgeStates };
      const callStack: string[] = [];

      steps.push({
        stepIndex: 0,
        cppLine: 15,
        description: `Initialize visited array with false for ${nodeIds.length} vertices. Start DFS at ${safeStart}.`,
        phase: 'Initialization',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...visited },
        dataStructure: {
          type: 'stack',
          title: 'Call Stack (LIFO)',
          items: []
        }
      });

      const dfsVisit = (u: string) => {
        visited[u] = true;
        callStack.push(u);
        nodeStates[u] = 'active';

        steps.push({
          stepIndex: steps.length,
          cppLine: 2,
          description: `Call dfs(${u}): mark visited[${u}] = true. Push to call stack.`,
          phase: 'Function Entry',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          activeNodeId: u,
          variables: { u },
          dataStructure: {
            type: 'stack',
            title: 'Call Stack (LIFO)',
            items: [...callStack].reverse().map(n => ({ label: `dfs(${n})`, status: n === u ? 'active' : 'queued' }))
          }
        });

        const neighbors = adj[u] || [];
        for (const neighbor of neighbors) {
          const v = neighbor.target;
          const edge = findEdge(u, v);
          const edgeId = edge ? edge.id : '';

          if (edgeId && edgeStates[edgeId] === 'idle') {
            edgeStates[edgeId] = 'evaluating';
          }

          steps.push({
            stepIndex: steps.length,
            cppLine: 5,
            description: `Iterate neighbor v = ${v} from u = ${u}. Check if visited[${v}] == false.`,
            phase: 'Edge Inspection',
            nodeStates: { ...nodeStates, [v]: visited[v] ? nodeStates[v] : 'testing' },
            edgeStates: { ...edgeStates },
            visited: { ...visited },
            activeNodeId: u,
            activeEdgeId: edgeId,
            variables: { u, v, 'visited[v]': String(visited[v]) },
            dataStructure: {
              type: 'stack',
              title: 'Call Stack (LIFO)',
              items: [...callStack].reverse().map(n => ({ label: `dfs(${n})`, status: n === u ? 'active' : 'queued' }))
            }
          });

          if (!visited[v]) {
            if (edgeId) edgeStates[edgeId] = 'tree';
            steps.push({
              stepIndex: steps.length,
              cppLine: 8,
              description: `Neighbor ${v} is unvisited. Recursive call dfs(${v}).`,
              phase: 'Tree Edge Descent',
              nodeStates: { ...nodeStates },
              edgeStates: { ...edgeStates },
              visited: { ...visited },
              activeNodeId: v,
              activeEdgeId: edgeId,
              variables: { u, v },
              dataStructure: {
                type: 'stack',
                title: 'Call Stack (LIFO)',
                items: [...callStack].reverse().map(n => ({ label: `dfs(${n})`, status: 'queued' }))
              }
            });

            dfsVisit(v);
          } else {
            if (edgeId && edgeStates[edgeId] !== 'tree') {
              edgeStates[edgeId] = 'cross';
            }
          }
        }

        callStack.pop();
        nodeStates[u] = 'visited';
        steps.push({
          stepIndex: steps.length,
          cppLine: 11,
          description: `Backtrack from dfs(${u}). Pop ${u} from call stack.`,
          phase: 'Backtracking',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          activeNodeId: u,
          variables: { u },
          dataStructure: {
            type: 'stack',
            title: 'Call Stack (LIFO)',
            items: [...callStack].reverse().map(n => ({ label: `dfs(${n})`, status: 'queued' }))
          }
        });
      };

      dfsVisit(safeStart);

      steps.push({
        stepIndex: steps.length,
        cppLine: 17,
        description: `DFS traversal complete. Call stack is empty. All connected vertices visited.`,
        phase: 'Complete',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...visited },
        dataStructure: {
          type: 'stack',
          title: 'Call Stack (LIFO)',
          items: []
        }
      });
      break;
    }

    case 'dijkstra': {
      // 1. vector<int> dijkstra(...)
      // 2. vector<int> dist(n, INF);
      // 3. priority_queue<...> pq;
      // 5. dist[start] = 0;
      // 6. pq.push({0, start});
      // 8. while (!pq.empty()) {
      // 9. auto [d, u] = pq.top();
      // 10. pq.pop();
      // 12. if (d > dist[u]) continue;
      // 14. for (auto& [v, weight] : adj[u]) {
      // 15. if (dist[u] + weight < dist[v]) {
      // 16. dist[v] = dist[u] + weight;
      // 17. pq.push({dist[v], v});
      // 21. return dist;
      const dist: Record<string, number | null> = { ...initDist };
      const parents: Record<string, string | null> = { ...initParents };
      const visited: Record<string, boolean> = { ...initVisited };
      const nodeStates = { ...initNodeStates };
      const edgeStates = { ...initEdgeStates };

      // Priority queue items: { d: number, u: string }
      type PQItem = { d: number; u: string };
      const pq: PQItem[] = [];

      steps.push({
        stepIndex: 0,
        cppLine: 2,
        description: `Initialize distance array with ∞ (infinity) for all nodes.`,
        phase: 'Initialization',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...visited },
        distances: { ...dist },
        parents: { ...parents },
        dataStructure: {
          type: 'priority_queue',
          title: 'Min-Heap Priority Queue',
          items: []
        }
      });

      dist[safeStart] = 0;
      pq.push({ d: 0, u: safeStart });
      nodeStates[safeStart] = 'testing';

      steps.push({
        stepIndex: steps.length,
        cppLine: 5,
        description: `Set source dist[${safeStart}] = 0 and push {0, ${safeStart}} to min-heap.`,
        phase: 'Source Push',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...visited },
        distances: { ...dist },
        parents: { ...parents },
        activeNodeId: safeStart,
        dataStructure: {
          type: 'priority_queue',
          title: 'Min-Heap Priority Queue',
          items: [{ label: `${safeStart}`, value: `d = 0`, badge: 'top' }]
        }
      });

      while (pq.length > 0) {
        // Sort pq ascending by distance
        pq.sort((a, b) => a.d - b.d);

        steps.push({
          stepIndex: steps.length,
          cppLine: 8,
          description: `Priority queue has ${pq.length} item(s). Minimum is at top.`,
          phase: 'Queue Peek',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          distances: { ...dist },
          parents: { ...parents },
          dataStructure: {
            type: 'priority_queue',
            title: 'Min-Heap Priority Queue',
            items: pq.map((item, idx) => ({
              label: item.u,
              value: `d = ${item.d}`,
              badge: idx === 0 ? 'min' : undefined
            }))
          }
        });

        const top = pq.shift()!;
        const { d, u } = top;

        if (visited[u]) {
          steps.push({
            stepIndex: steps.length,
            cppLine: 12,
            description: `Entry {${d}, ${u}} is stale because node ${u} is already finalized with distance ${dist[u]}. Skip.`,
            phase: 'Stale Check',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...visited },
            distances: { ...dist },
            parents: { ...parents },
            activeNodeId: u,
            variables: { d, u, 'dist[u]': dist[u] ?? 'INF' },
            dataStructure: {
              type: 'priority_queue',
              title: 'Min-Heap Priority Queue',
              items: pq.map(item => ({ label: item.u, value: `d = ${item.d}` }))
            }
          });
          continue;
        }

        visited[u] = true;
        nodeStates[u] = 'active';

        steps.push({
          stepIndex: steps.length,
          cppLine: 9,
          description: `Extract minimum distance node u = ${u} with confirmed shortest distance d = ${d}.`,
          phase: 'Node Finalized',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...visited },
          distances: { ...dist },
          parents: { ...parents },
          activeNodeId: u,
          variables: { u, d },
          dataStructure: {
            type: 'priority_queue',
            title: 'Min-Heap Priority Queue',
            items: pq.map(item => ({ label: item.u, value: `d = ${item.d}` }))
          }
        });

        const neighbors = adj[u] || [];
        for (const neighbor of neighbors) {
          const v = neighbor.target;
          const weight = neighbor.weight;
          const edge = findEdge(u, v);
          const edgeId = edge ? edge.id : '';

          if (edgeId) edgeStates[edgeId] = 'evaluating';

          const currentDistV = dist[v];
          const newDist = (dist[u] ?? 0) + weight;

          steps.push({
            stepIndex: steps.length,
            cppLine: 14,
            description: `Relaxation check: Edge (${u} -> ${v}) weight = ${weight}. Is dist[${u}] (${dist[u]}) + ${weight} < dist[${v}] (${currentDistV === null ? '∞' : currentDistV})?`,
            phase: 'Edge Relaxation',
            nodeStates: { ...nodeStates, [v]: nodeStates[v] === 'visited' ? 'visited' : 'testing' },
            edgeStates: { ...edgeStates },
            visited: { ...visited },
            distances: { ...dist },
            parents: { ...parents },
            activeNodeId: u,
            activeEdgeId: edgeId,
            variables: { u, v, weight, 'dist[u] + w': newDist, 'dist[v]': currentDistV ?? 'INF' },
            dataStructure: {
              type: 'priority_queue',
              title: 'Min-Heap Priority Queue',
              items: pq.map(item => ({ label: item.u, value: `d = ${item.d}` }))
            }
          });

          if (currentDistV === null || newDist < currentDistV) {
            dist[v] = newDist;
            parents[v] = u;
            pq.push({ d: newDist, u: v });
            if (edgeId) edgeStates[edgeId] = 'tree';

            steps.push({
              stepIndex: steps.length,
              cppLine: 16,
              description: `Shortest path improved! Updated dist[${v}] = ${newDist}. Pushed {${newDist}, ${v}} to min-heap.`,
              phase: 'Distance Updated',
              nodeStates: { ...nodeStates, [v]: 'testing' },
              edgeStates: { ...edgeStates },
              visited: { ...visited },
              distances: { ...dist },
              parents: { ...parents },
              activeNodeId: v,
              activeEdgeId: edgeId,
              variables: { 'dist[v]': newDist },
              dataStructure: {
                type: 'priority_queue',
                title: 'Min-Heap Priority Queue',
                items: [...pq].sort((a, b) => a.d - b.d).map(item => ({ label: item.u, value: `d = ${item.d}` }))
              }
            });
          } else {
            if (edgeId && edgeStates[edgeId] !== 'tree') {
              edgeStates[edgeId] = 'cross';
            }
          }
        }

        nodeStates[u] = 'visited';
      }

      // If target node is requested or just highlight shortest paths
      const target = targetNodeId && nodeIds.includes(targetNodeId) ? targetNodeId : nodeIds[nodeIds.length - 1];
      if (target && dist[target] !== null) {
        let curr: string | null = target;
        while (curr && parents[curr]) {
          const parentNode: string = parents[curr] as string;
          const edge = findEdge(parentNode, curr);
          if (edge) edgeStates[edge.id] = 'path';
          nodeStates[curr] = 'path';
          curr = parentNode;
        }
        if (curr) nodeStates[curr] = 'path';
      }

      steps.push({
        stepIndex: steps.length,
        cppLine: 21,
        description: `Dijkstra completed. Shortest path tree finalized from source ${safeStart}. Target ${target} shortest dist = ${dist[target] ?? 'Unreachable'}.`,
        phase: 'Shortest Path Tree Complete',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...visited },
        distances: { ...dist },
        parents: { ...parents },
        dataStructure: {
          type: 'priority_queue',
          title: 'Min-Heap Priority Queue',
          items: []
        }
      });
      break;
    }

    case 'bellman-ford': {
      // 1. bool bellmanFord(...)
      // 2. dist.assign(V, INF); dist[src] = 0;
      // 6. for (int i = 1; i <= V - 1; ++i) {
      // 7. bool any_updated = false;
      // 8. for (const auto& e : edges) {
      // 9. if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) {
      // 10. dist[e.v] = dist[e.u] + e.w;
      // 11. any_updated = true;
      // 14. if (!any_updated) break;
      // 18. for (const auto& e : edges) {
      // 19. if (dist[e.u] != INF && dist[e.u] + e.w < dist[e.v]) {
      // 20. return false; // Negative cycle detected!
      // 23. return true;
      const dist: Record<string, number | null> = { ...initDist };
      const parents: Record<string, string | null> = { ...initParents };
      const nodeStates = { ...initNodeStates };
      const edgeStates = { ...initEdgeStates };
      const V = nodeIds.length;

      steps.push({
        stepIndex: 0,
        cppLine: 2,
        description: `Initialize distances: dist[${safeStart}] = 0, all other nodes set to ∞. Prepare for |V|-1 = ${V - 1} relaxation passes.`,
        phase: 'Initialization',
        nodeStates: { ...nodeStates, [safeStart]: 'active' },
        edgeStates: { ...edgeStates },
        visited: { ...initVisited },
        distances: { ...dist, [safeStart]: 0 },
        parents: { ...parents },
        dataStructure: {
          type: 'queue',
          title: 'Edge Relaxations',
          items: [{ label: 'Pass 0', value: 'Initialized' }]
        }
      });

      dist[safeStart] = 0;
      let negativeCycleFound = false;

      for (let pass = 1; pass <= V - 1; pass++) {
        let anyUpdated = false;

        steps.push({
          stepIndex: steps.length,
          cppLine: 6,
          description: `--- Pass ${pass} of ${V - 1} --- Iterating over all ${graph.edges.length} edges.`,
          phase: `Pass ${pass}/${V - 1}`,
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...initVisited },
          distances: { ...dist },
          parents: { ...parents },
          variables: { 'Iteration i': pass, '|V| - 1': V - 1 },
          dataStructure: {
            type: 'queue',
            title: `Relaxation Pass ${pass}`,
            items: [{ label: `Pass ${pass}`, value: 'In Progress' }]
          }
        });

        for (const edge of graph.edges) {
          const u = edge.source;
          const v = edge.target;
          const w = edge.weight;

          edgeStates[edge.id] = 'evaluating';

          steps.push({
            stepIndex: steps.length,
            cppLine: 8,
            description: `Testing edge (${u} -> ${v}, w = ${w}). Current dist[${u}] = ${dist[u] ?? '∞'}, dist[${v}] = ${dist[v] ?? '∞'}.`,
            phase: 'Edge Evaluation',
            nodeStates: { ...nodeStates, [u]: 'testing', [v]: 'testing' },
            edgeStates: { ...edgeStates },
            visited: { ...initVisited },
            distances: { ...dist },
            parents: { ...parents },
            activeEdgeId: edge.id,
            variables: { u, v, w, 'dist[u]': dist[u] ?? 'INF', 'dist[v]': dist[v] ?? 'INF' },
            dataStructure: {
              type: 'queue',
              title: `Pass ${pass} / ${V - 1}`,
              items: [{ label: `Edge (${u}, ${v})`, value: `w = ${w}` }]
            }
          });

          if (dist[u] !== null && (dist[v] === null || dist[u]! + w < dist[v]!)) {
            const updatedDist = dist[u]! + w;
            dist[v] = updatedDist;
            parents[v] = u;
            anyUpdated = true;
            edgeStates[edge.id] = 'tree';

            steps.push({
              stepIndex: steps.length,
              cppLine: 10,
              description: `Relaxation successful! dist[${v}] updated from ${dist[v] ?? '∞'} to ${updatedDist}.`,
              phase: 'Relaxation',
              nodeStates: { ...nodeStates, [v]: 'active' },
              edgeStates: { ...edgeStates },
              visited: { ...initVisited },
              distances: { ...dist },
              parents: { ...parents },
              activeEdgeId: edge.id,
              variables: { 'dist[v]': updatedDist, any_updated: 'true' },
              dataStructure: {
                type: 'queue',
                title: `Pass ${pass}`,
                items: [{ label: `Relaxed (${u}, ${v})`, value: `New dist[${v}] = ${updatedDist}` }]
              }
            });
          } else {
            edgeStates[edge.id] = 'idle';
          }
        }

        if (!anyUpdated) {
          steps.push({
            stepIndex: steps.length,
            cppLine: 14,
            description: `Early termination: No distances changed during Pass ${pass}. Convergence reached early!`,
            phase: 'Early Convergence',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...initVisited },
            distances: { ...dist },
            parents: { ...parents },
            dataStructure: {
              type: 'queue',
              title: 'Result',
              items: [{ label: 'Converged early', value: `At pass ${pass}` }]
            }
          });
          break;
        }
      }

      // Check negative cycle (V-th pass)
      steps.push({
        stepIndex: steps.length,
        cppLine: 18,
        description: `Running V-th pass to check for negative-weight cycles. If any edge can still relax, a negative cycle exists!`,
        phase: 'Negative Cycle Check',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...initVisited },
        distances: { ...dist },
        parents: { ...parents },
        dataStructure: {
          type: 'queue',
          title: 'Negative Cycle Check',
          items: [{ label: 'Checking pass', value: 'Pass V' }]
        }
      });

      for (const edge of graph.edges) {
        const u = edge.source;
        const v = edge.target;
        const w = edge.weight;

        if (dist[u] !== null && (dist[v] === null || dist[u]! + w < dist[v]!)) {
          negativeCycleFound = true;
          edgeStates[edge.id] = 'cycle';
          nodeStates[u] = 'cycle';
          nodeStates[v] = 'cycle';

          steps.push({
            stepIndex: steps.length,
            cppLine: 20,
            description: `NEGATIVE WEIGHT CYCLE DETECTED! Edge (${u} -> ${v}, w=${w}) can still be relaxed: ${dist[u]} + ${w} < ${dist[v]}. Shortest path is undefined!`,
            phase: 'Negative Cycle Found',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...initVisited },
            distances: { ...dist },
            parents: { ...parents },
            activeEdgeId: edge.id,
            negativeCycle: true,
            variables: { u, v, w, 'dist[u] + w': (dist[u] ?? 0) + w, 'dist[v]': dist[v] ?? 'INF' },
            dataStructure: {
              type: 'queue',
              title: 'ALARM: Negative Cycle',
              items: [{ label: 'Cycle Edge', value: `(${u}, ${v}) w=${w}` }]
            }
          });
          break;
        }
      }

      if (!negativeCycleFound) {
        steps.push({
          stepIndex: steps.length,
          cppLine: 23,
          description: `No negative weight cycles detected. All shortest path distances from source ${safeStart} are globally optimal.`,
          phase: 'Complete',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...initVisited },
          distances: { ...dist },
          parents: { ...parents },
          negativeCycle: false,
          dataStructure: {
            type: 'queue',
            title: 'Optimal Distances',
            items: nodeIds.map(id => ({ label: id, value: dist[id] !== null ? dist[id]! : 'INF' }))
          }
        });
      }
      break;
    }

    case 'prim': {
      // 1. int primMST(...)
      // 2. vector<bool> inMST(V, false);
      // 3. priority_queue<tuple<int,int,int>, ...> pq;
      // 6. pq.push({0, 0, -1});
      // 8. while (!pq.empty()) {
      // 9. auto [w, u, p] = pq.top(); pq.pop();
      // 12. if (inMST[u]) continue;
      // 13. inMST[u] = true;
      // 14. mstWeight += w;
      // 16. for (auto& [v, weight] : adj[u]) {
      // 17. if (!inMST[v]) pq.push({weight, v, u});
      // 22. return mstWeight;
      const inMST: Record<string, boolean> = { ...initVisited };
      const nodeStates = { ...initNodeStates };
      const edgeStates = { ...initEdgeStates };
      let mstWeight = 0;

      type PrimPQItem = { w: number; u: string; p: string | null; edgeId?: string };
      const pq: PrimPQItem[] = [];

      steps.push({
        stepIndex: 0,
        cppLine: 2,
        description: `Initialize inMST array with all false. Min-heap stores candidate cut edges {weight, u, parent}.`,
        phase: 'Initialization',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...inMST },
        mstTotalWeight: 0,
        dataStructure: {
          type: 'priority_queue',
          title: 'Min-Cut Priority Queue',
          items: []
        }
      });

      pq.push({ w: 0, u: safeStart, p: null });

      steps.push({
        stepIndex: steps.length,
        cppLine: 6,
        description: `Push starting vertex ${safeStart} with weight 0 into priority queue: {0, ${safeStart}, -1}.`,
        phase: 'Seed Min-Heap',
        nodeStates: { ...nodeStates, [safeStart]: 'testing' },
        edgeStates: { ...edgeStates },
        visited: { ...inMST },
        mstTotalWeight: 0,
        activeNodeId: safeStart,
        dataStructure: {
          type: 'priority_queue',
          title: 'Min-Cut Priority Queue',
          items: [{ label: safeStart, value: 'w = 0', badge: 'root' }]
        }
      });

      while (pq.length > 0) {
        pq.sort((a, b) => a.w - b.w);
        const top = pq.shift()!;
        const { w, u, p, edgeId } = top;

        if (inMST[u]) {
          steps.push({
            stepIndex: steps.length,
            cppLine: 12,
            description: `Vertex ${u} is already part of the MST. Discard cut edge to prevent cycle.`,
            phase: 'Cycle Avoidance',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...inMST },
            mstTotalWeight: mstWeight,
            activeNodeId: u,
            dataStructure: {
              type: 'priority_queue',
              title: 'Min-Cut Priority Queue',
              items: pq.map(i => ({ label: `${i.p ?? 'none'} -> ${i.u}`, value: `w = ${i.w}` }))
            }
          });
          continue;
        }

        inMST[u] = true;
        mstWeight += w;
        nodeStates[u] = 'path';
        if (edgeId) edgeStates[edgeId] = 'tree';

        steps.push({
          stepIndex: steps.length,
          cppLine: 13,
          description: `Add node ${u} to MST! Added weight +${w}. Total MST weight now = ${mstWeight}.`,
          phase: 'MST Growth',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...inMST },
          mstTotalWeight: mstWeight,
          activeNodeId: u,
          activeEdgeId: edgeId,
          variables: { u, parent: p ?? 'None', edgeWeight: w, mstWeight },
          dataStructure: {
            type: 'priority_queue',
            title: 'Min-Cut Priority Queue',
            items: pq.map(i => ({ label: `${i.p ?? 'none'} -> ${i.u}`, value: `w = ${i.w}` }))
          }
        });

        const neighbors = adj[u] || [];
        for (const neighbor of neighbors) {
          const v = neighbor.target;
          const weight = neighbor.weight;
          const edge = findEdge(u, v);
          const eId = edge ? edge.id : undefined;

          if (!inMST[v]) {
            pq.push({ w: weight, u: v, p: u, edgeId: eId });
            if (eId && edgeStates[eId] !== 'tree') {
              edgeStates[eId] = 'evaluating';
            }

            steps.push({
              stepIndex: steps.length,
              cppLine: 17,
              description: `Neighbor ${v} not in MST. Push cut edge (${u} - ${v}, w=${weight}) to Min-Heap.`,
              phase: 'Add Cut Edges',
              nodeStates: { ...nodeStates, [v]: 'testing' },
              edgeStates: { ...edgeStates },
              visited: { ...inMST },
              mstTotalWeight: mstWeight,
              activeNodeId: v,
              activeEdgeId: eId,
              variables: { u, v, weight },
              dataStructure: {
                type: 'priority_queue',
                title: 'Min-Cut Priority Queue',
                items: [...pq].sort((a, b) => a.w - b.w).map(i => ({ label: `${i.p} -> ${i.u}`, value: `w = ${i.w}` }))
              }
            });
          }
        }
      }

      steps.push({
        stepIndex: steps.length,
        cppLine: 22,
        description: `Prim's MST construction completed! Spanning tree contains all vertices with optimal total weight = ${mstWeight}.`,
        phase: 'MST Complete',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...inMST },
        mstTotalWeight: mstWeight,
        dataStructure: {
          type: 'priority_queue',
          title: 'Result',
          items: [{ label: 'Total MST Cost', value: mstWeight }]
        }
      });
      break;
    }

    case 'kruskal': {
      // 1. int kruskalMST(...)
      // 2. sort(edges.begin(), edges.end(), ...)
      // 5. DisjointSet dsu(V);
      // 8. for (const auto& e : edges) {
      // 9. int rootU = dsu.find(e.u);
      // 10. int rootV = dsu.find(e.v);
      // 12. if (rootU != rootV) {
      // 13. dsu.unite(rootU, rootV);
      // 14. mstWeight += e.weight;
      // 15. edgesCount++;
      // 16. if (edgesCount == V - 1) break;
      // 20. return mstWeight;
      const nodeStates = { ...initNodeStates };
      const edgeStates = { ...initEdgeStates };
      let mstWeight = 0;
      let edgesCount = 0;

      // Disjoint Set Union
      const parent: Record<string, string> = {};
      const rank: Record<string, number> = {};
      nodeIds.forEach(id => {
        parent[id] = id;
        rank[id] = 0;
      });

      const findRoot = (i: string): string => {
        if (parent[i] === i) return i;
        parent[i] = findRoot(parent[i]);
        return parent[i];
      };

      const unite = (u: string, v: string) => {
        const rootU = findRoot(u);
        const rootV = findRoot(v);
        if (rootU !== rootV) {
          if (rank[rootU] < rank[rootV]) {
            parent[rootU] = rootV;
          } else if (rank[rootU] > rank[rootV]) {
            parent[rootV] = rootU;
          } else {
            parent[rootV] = rootU;
            rank[rootU]++;
          }
          return true;
        }
        return false;
      };

      // Sort edges by weight
      const sortedEdges = [...graph.edges].sort((a, b) => a.weight - b.weight);

      steps.push({
        stepIndex: 0,
        cppLine: 2,
        description: `Sort all ${graph.edges.length} edges in non-decreasing order of weight.`,
        phase: 'Edge Sorting',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...initVisited },
        mstTotalWeight: 0,
        dataStructure: {
          type: 'dsu',
          title: 'Sorted Edges',
          items: sortedEdges.map(e => ({ label: `(${e.source}, ${e.target})`, value: `w = ${e.weight}` })),
          dsuParent: { ...parent },
          dsuRank: { ...rank }
        }
      });

      steps.push({
        stepIndex: steps.length,
        cppLine: 5,
        description: `Initialize Disjoint Set Union (DSU) with each node in its own disjoint set: parent[u] = u.`,
        phase: 'DSU Init',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...initVisited },
        mstTotalWeight: 0,
        dataStructure: {
          type: 'dsu',
          title: 'DSU State',
          items: nodeIds.map(id => ({ label: id, value: `parent: ${id}` })),
          dsuParent: { ...parent },
          dsuRank: { ...rank }
        }
      });

      for (const edge of sortedEdges) {
        edgeStates[edge.id] = 'evaluating';

        const rootU = findRoot(edge.source);
        const rootV = findRoot(edge.target);

        steps.push({
          stepIndex: steps.length,
          cppLine: 9,
          description: `Evaluate next cheapest edge (${edge.source} - ${edge.target}, w=${edge.weight}). find(${edge.source}) = ${rootU}, find(${edge.target}) = ${rootV}.`,
          phase: 'Find Roots',
          nodeStates: { ...nodeStates, [edge.source]: 'testing', [edge.target]: 'testing' },
          edgeStates: { ...edgeStates },
          visited: { ...initVisited },
          mstTotalWeight: mstWeight,
          activeEdgeId: edge.id,
          variables: { 'edge.u': edge.source, 'edge.v': edge.target, 'rootU': rootU, 'rootV': rootV, weight: edge.weight },
          dataStructure: {
            type: 'dsu',
            title: 'DSU Find Operations',
            items: [
              { label: `find(${edge.source})`, value: rootU },
              { label: `find(${edge.target})`, value: rootV }
            ],
            dsuParent: { ...parent },
            dsuRank: { ...rank }
          }
        });

        if (rootU !== rootV) {
          unite(rootU, rootV);
          mstWeight += edge.weight;
          edgesCount++;
          edgeStates[edge.id] = 'tree';
          nodeStates[edge.source] = 'path';
          nodeStates[edge.target] = 'path';

          steps.push({
            stepIndex: steps.length,
            cppLine: 13,
            description: `Roots differ (${rootU} ≠ ${rootV}): No cycle formed! Union sets, include edge in MST (+${edge.weight}). Total MST = ${mstWeight}.`,
            phase: 'Edge Accepted',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...initVisited },
            mstTotalWeight: mstWeight,
            activeEdgeId: edge.id,
            variables: { mstWeight, edgesCount, targetEdges: nodeIds.length - 1 },
            dataStructure: {
              type: 'dsu',
              title: 'DSU Union Performed',
              items: nodeIds.map(id => ({ label: id, value: `root: ${findRoot(id)}` })),
              dsuParent: { ...parent },
              dsuRank: { ...rank }
            }
          });

          if (edgesCount === nodeIds.length - 1) {
            steps.push({
              stepIndex: steps.length,
              cppLine: 16,
              description: `Reached |V| - 1 = ${nodeIds.length - 1} edges! Spanning tree is complete, early break.`,
              phase: 'Early Stop',
              nodeStates: { ...nodeStates },
              edgeStates: { ...edgeStates },
              visited: { ...initVisited },
              mstTotalWeight: mstWeight,
              dataStructure: {
                type: 'dsu',
                title: 'Result',
                items: [{ label: 'Edges picked', value: `${edgesCount}/${nodeIds.length - 1}` }],
                dsuParent: { ...parent },
                dsuRank: { ...rank }
              }
            });
            break;
          }
        } else {
          edgeStates[edge.id] = 'cross';
          steps.push({
            stepIndex: steps.length,
            cppLine: 12,
            description: `Roots match (${rootU} == ${rootV}): Edge (${edge.source} - ${edge.target}) would create a CYCLE. Edge REJECTED.`,
            phase: 'Edge Rejected (Cycle)',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...initVisited },
            mstTotalWeight: mstWeight,
            activeEdgeId: edge.id,
            dataStructure: {
              type: 'dsu',
              title: 'Cycle Prevented',
              items: [{ label: 'Rejected', value: `(${edge.source}, ${edge.target})` }],
              dsuParent: { ...parent },
              dsuRank: { ...rank }
            }
          });
        }
      }

      steps.push({
        stepIndex: steps.length,
        cppLine: 20,
        description: `Kruskal's algorithm completed. Optimal Minimum Spanning Tree built with weight = ${mstWeight}.`,
        phase: 'Complete',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...initVisited },
        mstTotalWeight: mstWeight,
        dataStructure: {
          type: 'dsu',
          title: 'Final MST Cost',
          items: [{ label: 'Total Weight', value: mstWeight }],
          dsuParent: { ...parent },
          dsuRank: { ...rank }
        }
      });
      break;
    }

    case 'toposort': {
      // 1. vector<int> topologicalSort(...)
      // 2. vector<int> inDegree(V, 0);
      // 3. for (int u = 0; u < V; ++u) ...
      // 6. queue<int> q;
      // 7. for (int i = 0; i < V; ++i) if (inDegree[i] == 0) q.push(i);
      // 11. while (!q.empty()) {
      // 12. int u = q.front(); q.pop(); order.push_back(u);
      // 15. for (int v : adj[u]) {
      // 16. if (--inDegree[v] == 0) q.push(v);
      // 21. return (order.size() == V) ? order : vector<int>();
      const inDegree: Record<string, number> = {};
      nodeIds.forEach(id => { inDegree[id] = 0; });

      // Compute in-degrees
      for (const edge of graph.edges) {
        inDegree[edge.target] = (inDegree[edge.target] || 0) + 1;
      }

      const nodeStates = { ...initNodeStates };
      const edgeStates = { ...initEdgeStates };
      const queue: string[] = [];
      const topoOrder: string[] = [];

      steps.push({
        stepIndex: 0,
        cppLine: 2,
        description: `Calculate in-degrees for all vertices by counting incoming directed edges.`,
        phase: 'Compute In-Degrees',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...initVisited },
        topoOrder: [],
        dataStructure: {
          type: 'indegree',
          title: 'In-Degree Array',
          items: nodeIds.map(id => ({ label: id, value: inDegree[id] })),
          inDegrees: { ...inDegree }
        }
      });

      // Find all in-degree 0 nodes
      for (const id of nodeIds) {
        if (inDegree[id] === 0) {
          queue.push(id);
          nodeStates[id] = 'active';
        }
      }

      steps.push({
        stepIndex: steps.length,
        cppLine: 7,
        description: `Enqueue all nodes with in-degree == 0: [${queue.join(', ')}]. These have zero prerequisites.`,
        phase: 'Queue Zero In-Degree',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...initVisited },
        topoOrder: [],
        dataStructure: {
          type: 'queue',
          title: 'Zero In-Degree Queue',
          items: queue.map(id => ({ label: id, status: 'queued' })),
          inDegrees: { ...inDegree }
        }
      });

      while (queue.length > 0) {
        const u = queue.shift()!;
        topoOrder.push(u);
        nodeStates[u] = 'path';

        steps.push({
          stepIndex: steps.length,
          cppLine: 12,
          description: `Dequeue u = ${u}. Append ${u} to topological order: [${topoOrder.join(' → ')}].`,
          phase: 'Process Vertex',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...initVisited },
          activeNodeId: u,
          topoOrder: [...topoOrder],
          variables: { u, orderLength: topoOrder.length },
          dataStructure: {
            type: 'queue',
            title: 'Topological Order Output',
            items: topoOrder.map((id, idx) => ({ label: `#${idx + 1}`, value: id })),
            inDegrees: { ...inDegree }
          }
        });

        const neighbors = adj[u] || [];
        for (const neighbor of neighbors) {
          const v = neighbor.target;
          const edge = findEdge(u, v);
          const edgeId = edge ? edge.id : '';

          if (edgeId) edgeStates[edgeId] = 'evaluating';

          inDegree[v] = Math.max(0, inDegree[v] - 1);

          steps.push({
            stepIndex: steps.length,
            cppLine: 16,
            description: `Decrement in-degree of child v = ${v}: inDegree[${v}] is now ${inDegree[v]}.`,
            phase: 'Decrement In-Degree',
            nodeStates: { ...nodeStates, [v]: inDegree[v] === 0 ? 'testing' : nodeStates[v] },
            edgeStates: { ...edgeStates },
            visited: { ...initVisited },
            activeNodeId: u,
            activeEdgeId: edgeId,
            topoOrder: [...topoOrder],
            variables: { u, v, 'new inDegree[v]': inDegree[v] },
            dataStructure: {
              type: 'indegree',
              title: 'Updated In-Degrees',
              items: nodeIds.map(id => ({ label: id, value: inDegree[id] })),
              inDegrees: { ...inDegree }
            }
          });

          if (inDegree[v] === 0) {
            queue.push(v);
            nodeStates[v] = 'active';
            if (edgeId) edgeStates[edgeId] = 'tree';

            steps.push({
              stepIndex: steps.length,
              cppLine: 17,
              description: `Prerequisites cleared for ${v} (inDegree[${v}] == 0)! Push ${v} into queue.`,
              phase: 'Enqueue Newly Freed',
              nodeStates: { ...nodeStates },
              edgeStates: { ...edgeStates },
              visited: { ...initVisited },
              activeNodeId: v,
              topoOrder: [...topoOrder],
              dataStructure: {
                type: 'queue',
                title: 'Queue',
                items: queue.map(id => ({ label: id, status: 'queued' })),
                inDegrees: { ...inDegree }
              }
            });
          }
        }
      }

      const isDAG = topoOrder.length === nodeIds.length;

      steps.push({
        stepIndex: steps.length,
        cppLine: 21,
        description: isDAG
          ? `Topological Sort successful! Valid ordering: [${topoOrder.join(' → ')}]. The graph is a DAG.`
          : `Topological Sort failed! Only ${topoOrder.length} of ${nodeIds.length} nodes ordered. Graph contains a DIRECTED CYCLE!`,
        phase: 'Complete',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...initVisited },
        topoOrder: [...topoOrder],
        cycleDetected: !isDAG,
        dataStructure: {
          type: 'queue',
          title: isDAG ? 'Valid Topo Sequence' : 'Cycle Detected',
          items: topoOrder.map((id, idx) => ({ label: `Step ${idx + 1}`, value: id }))
        }
      });
      break;
    }

    case 'cycle-detection': {
      // 1. enum State { UNVISITED, VISITING, VISITED };
      // 3. bool hasCycleDFS(int u, ...)
      // 4. state[u] = VISITING; // In current recursion call stack
      // 6. for (int v : adj[u]) {
      // 7. if (state[v] == VISITING) return true; // Back-edge!
      // 10. if (state[v] == UNVISITED && hasCycleDFS(v, ...)) return true;
      // 15. state[u] = VISITED;
      // 16. return false;
      enum State { UNVISITED = 0, VISITING = 1, VISITED = 2 }
      const states: Record<string, State> = {};
      nodeIds.forEach(id => { states[id] = State.UNVISITED; });

      const nodeStates = { ...initNodeStates };
      const edgeStates = { ...initEdgeStates };
      let cycleFound = false;

      steps.push({
        stepIndex: 0,
        cppLine: 1,
        description: `Initialize tri-color state array: 0 = UNVISITED (white), 1 = VISITING (in call stack, gray), 2 = VISITED (done, black).`,
        phase: 'Initialization',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...initVisited },
        dataStructure: {
          type: 'stack',
          title: 'Recursion Call Stack',
          items: []
        }
      });

      const dfsCycle = (u: string, parentNode: string | null): boolean => {
        states[u] = State.VISITING;
        nodeStates[u] = 'testing';

        steps.push({
          stepIndex: steps.length,
          cppLine: 4,
          description: `Enter dfs(${u}). Set state[${u}] = VISITING (added to active recursion stack).`,
          phase: 'Enter Stack',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...initVisited },
          activeNodeId: u,
          variables: { u, state: 'VISITING (in stack)' },
          dataStructure: {
            type: 'stack',
            title: 'Call Stack (Ancestors)',
            items: nodeIds.filter(id => states[id] === State.VISITING).map(id => ({ label: id, status: 'active' }))
          }
        });

        const neighbors = adj[u] || [];
        for (const neighbor of neighbors) {
          const v = neighbor.target;
          const edge = findEdge(u, v);
          const edgeId = edge ? edge.id : '';

          // If undirected, ignore immediate parent
          if (!graph.isDirected && v === parentNode) {
            continue;
          }

          if (edgeId) edgeStates[edgeId] = 'evaluating';

          steps.push({
            stepIndex: steps.length,
            cppLine: 6,
            description: `Inspect edge (${u} -> ${v}). Target node ${v} state is ${State[states[v]]}.`,
            phase: 'Edge Check',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...initVisited },
            activeNodeId: u,
            activeEdgeId: edgeId,
            variables: { u, v, 'state[v]': State[states[v]] },
            dataStructure: {
              type: 'stack',
              title: 'Active Stack',
              items: nodeIds.filter(id => states[id] === State.VISITING).map(id => ({ label: id, status: 'active' }))
            }
          });

          if (states[v] === State.VISITING) {
            // Cycle detected!
            cycleFound = true;
            if (edgeId) edgeStates[edgeId] = 'cycle';
            nodeStates[u] = 'cycle';
            nodeStates[v] = 'cycle';

            steps.push({
              stepIndex: steps.length,
              cppLine: 7,
              description: `BACK-EDGE FOUND! Edge (${u} -> ${v}) points back to an ancestor already in the call stack! CYCLE CONFIRMED.`,
              phase: 'Cycle Detected',
              nodeStates: { ...nodeStates },
              edgeStates: { ...edgeStates },
              visited: { ...initVisited },
              activeNodeId: u,
              activeEdgeId: edgeId,
              cycleDetected: true,
              dataStructure: {
                type: 'stack',
                title: 'CYCLE TRIGGER',
                items: [{ label: `Back-edge (${u}, ${v})`, value: 'Cycle Created' }]
              }
            });
            return true;
          }

          if (states[v] === State.UNVISITED) {
            if (edgeId) edgeStates[edgeId] = 'tree';
            if (dfsCycle(v, u)) return true;
          }
        }

        states[u] = State.VISITED;
        nodeStates[u] = 'visited';

        steps.push({
          stepIndex: steps.length,
          cppLine: 15,
          description: `Finished exploring subtree for ${u}. Set state[${u}] = VISITED and pop from recursion stack.`,
          phase: 'Pop Stack',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...initVisited },
          activeNodeId: u,
          dataStructure: {
            type: 'stack',
            title: 'Call Stack',
            items: nodeIds.filter(id => states[id] === State.VISITING).map(id => ({ label: id, status: 'active' }))
          }
        });

        return false;
      };

      for (const id of nodeIds) {
        if (states[id] === State.UNVISITED) {
          if (dfsCycle(id, null)) break;
        }
      }

      steps.push({
        stepIndex: steps.length,
        cppLine: 16,
        description: cycleFound
          ? `Cycle detection finished: The graph CONTAINS at least one cycle.`
          : `Cycle detection finished: No cycles found. The graph is strictly acyclic!`,
        phase: 'Complete',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...initVisited },
        cycleDetected: cycleFound,
        dataStructure: {
          type: 'stack',
          title: 'Result',
          items: [{ label: 'Has Cycle', value: String(cycleFound) }]
        }
      });
      break;
    }

    case 'kosaraju': {
      // 1. void fillOrder(...)
      // 4. st.push(u);
      // 7. void dfsRev(...)
      // 13. vector<vector<int>> kosarajuSCC(...)
      // 17. // Phase 1: Forward DFS fill finish times
      // 20. // Phase 2: Transpose graph
      // 25. // Phase 3: Pop stack and extract SCCs
      const vis1: Record<string, boolean> = { ...initVisited };
      const finishStack: string[] = [];
      const nodeStates = { ...initNodeStates };
      const edgeStates = { ...initEdgeStates };
      const sccList: string[][] = [];

      steps.push({
        stepIndex: 0,
        cppLine: 17,
        description: `Kosaraju Phase 1: Run DFS on original graph to record finish-time order onto a stack.`,
        phase: 'Phase 1: Forward DFS',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...vis1 },
        dataStructure: {
          type: 'stack',
          title: 'Finish Time Stack',
          items: []
        }
      });

      const fillOrder = (u: string) => {
        vis1[u] = true;
        nodeStates[u] = 'testing';

        const neighbors = adj[u] || [];
        for (const neighbor of neighbors) {
          const v = neighbor.target;
          if (!vis1[v]) fillOrder(v);
        }

        finishStack.push(u);
        nodeStates[u] = 'visited';

        steps.push({
          stepIndex: steps.length,
          cppLine: 4,
          description: `Vertex ${u} finished exploring. Push ${u} onto finish time stack: [${finishStack.join(', ')}].`,
          phase: 'Phase 1: Finish Node',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...vis1 },
          activeNodeId: u,
          dataStructure: {
            type: 'stack',
            title: 'Finish Time Stack',
            items: [...finishStack].reverse().map(id => ({ label: id, status: 'queued' }))
          }
        });
      };

      for (const id of nodeIds) {
        if (!vis1[id]) fillOrder(id);
      }

      // Phase 2: Transpose graph
      steps.push({
        stepIndex: steps.length,
        cppLine: 20,
        description: `Kosaraju Phase 2: Compute graph transpose G^T (reversing direction of all edges).`,
        phase: 'Phase 2: Graph Transpose',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...vis1 },
        dataStructure: {
          type: 'stack',
          title: 'Stack Ready for Phase 3',
          items: [...finishStack].reverse().map(id => ({ label: id, status: 'queued' }))
        }
      });

      // Transposed adjacency list
      const revAdj: Record<string, string[]> = {};
      nodeIds.forEach(id => { revAdj[id] = []; });
      for (const edge of graph.edges) {
        revAdj[edge.target].push(edge.source);
      }

      // Phase 3: Pop from stack and run DFS on reversed graph
      const vis2: Record<string, boolean> = {};
      nodeIds.forEach(id => { vis2[id] = false; });

      steps.push({
        stepIndex: steps.length,
        cppLine: 25,
        description: `Kosaraju Phase 3: Pop vertices one-by-one from stack and run DFS on G^T to carve out Strongly Connected Components.`,
        phase: 'Phase 3: Extract SCCs',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...vis2 },
        dataStructure: {
          type: 'components',
          title: 'SCC Components Found',
          items: []
        }
      });

      const dfsRev = (u: string, scc: string[]) => {
        vis2[u] = true;
        scc.push(u);
        nodeStates[u] = 'path';

        for (const v of revAdj[u] || []) {
          if (!vis2[v]) {
            dfsRev(v, scc);
          }
        }
      };

      while (finishStack.length > 0) {
        const u = finishStack.pop()!;
        if (!vis2[u]) {
          const currentSCC: string[] = [];
          dfsRev(u, currentSCC);
          sccList.push(currentSCC);

          steps.push({
            stepIndex: steps.length,
            cppLine: 30,
            description: `Identified Strongly Connected Component #${sccList.length}: { ${currentSCC.join(', ')} }.`,
            phase: 'SCC Identified',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...vis2 },
            sccList: [...sccList],
            dataStructure: {
              type: 'components',
              title: `SCC Partition (${sccList.length} total)`,
              items: sccList.map((comp, idx) => ({ label: `SCC #${idx + 1}`, value: `{ ${comp.join(', ')} }` }))
            }
          });
        }
      }

      steps.push({
        stepIndex: steps.length,
        cppLine: 35,
        description: `Kosaraju's algorithm complete! Graph partitioned into ${sccList.length} strongly connected components.`,
        phase: 'Complete',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...vis2 },
        sccList: [...sccList],
        dataStructure: {
          type: 'components',
          title: 'Final SCCs',
          items: sccList.map((comp, idx) => ({ label: `SCC #${idx + 1}`, value: `{ ${comp.join(', ')} }` }))
        }
      });
      break;
    }

    case 'flood-fill': {
      // 1. void floodFill(...)
      // 2. int oldColor = grid[sr][sc];
      // 8. grid[sr][sc] = newColor; q.push({sr, sc});
      // 13. while (!q.empty()) {
      // 14. auto [r, c] = q.front(); q.pop();
      // 17. for (int i = 0; i < 4; ++i) {
      // 19. if (valid && grid[nr][nc] == oldColor) {
      // 20. grid[nr][nc] = newColor; q.push({nr, nc});
      const nodeStates = { ...initNodeStates };
      const edgeStates = { ...initEdgeStates };
      const rows = 6;
      const cols = 8;
      // Default grid if not passed: 0 = background, 1 = obstacle/wall, 2 = target color
      const defaultGrid: number[][] = [
        [0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 2, 2, 2, 0],
        [0, 1, 1, 0, 2, 2, 2, 0],
        [0, 0, 0, 0, 2, 2, 0, 0],
        [0, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
      ];

      const currentGrid = gridData ? gridData.grid.map(row => [...row]) : defaultGrid.map(row => [...row]);
      const startR = gridData ? gridData.startCell[0] : 1;
      const startC = gridData ? gridData.startCell[1] : 4;
      const targetColor = currentGrid[startR][startC];
      const replacementColor = 3; // New fill color (emerald/indigo)

      const q: [number, number][] = [];
      const visitedCells: [number, number][] = [];

      steps.push({
        stepIndex: 0,
        cppLine: 2,
        description: `Read seed cell (${startR}, ${startC}): oldColor = ${targetColor}, replacement color = ${replacementColor}.`,
        phase: 'Initialization',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...initVisited },
        gridState: {
          grid: currentGrid.map(row => [...row]),
          activeCell: [startR, startC],
          visitedCells: [],
          targetColor,
          replacementColor
        },
        dataStructure: {
          type: 'grid',
          title: 'Cell Queue',
          items: [{ label: `(${startR}, ${startC})`, status: 'queued' }]
        }
      });

      if (targetColor !== replacementColor) {
        currentGrid[startR][startC] = replacementColor;
        q.push([startR, startC]);
        visitedCells.push([startR, startC]);

        const dx = [-1, 1, 0, 0];
        const dy = [0, 0, -1, 1];
        const dirNames = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

        while (q.length > 0) {
          const [r, c] = q.shift()!;

          steps.push({
            stepIndex: steps.length,
            cppLine: 14,
            description: `Pop front cell (${r}, ${c}). Expanding 4-directional neighbors.`,
            phase: 'Expand Cell',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...initVisited },
            gridState: {
              grid: currentGrid.map(row => [...row]),
              activeCell: [r, c],
              visitedCells: [...visitedCells],
              targetColor,
              replacementColor
            },
            dataStructure: {
              type: 'grid',
              title: 'Queue',
              items: q.map(([cr, cc]) => ({ label: `(${cr}, ${cc})`, status: 'queued' }))
            }
          });

          for (let i = 0; i < 4; i++) {
            const nr = r + dx[i];
            const nc = c + dy[i];

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && currentGrid[nr][nc] === targetColor) {
              currentGrid[nr][nc] = replacementColor;
              q.push([nr, nc]);
              visitedCells.push([nr, nc]);

              steps.push({
                stepIndex: steps.length,
                cppLine: 20,
                description: `Neighbor ${dirNames[i]} (${nr}, ${nc}) matches target color ${targetColor}. Paint new color and enqueue.`,
                phase: 'Paint Cell',
                nodeStates: { ...nodeStates },
                edgeStates: { ...edgeStates },
                visited: { ...initVisited },
                gridState: {
                  grid: currentGrid.map(row => [...row]),
                  activeCell: [nr, nc],
                  visitedCells: [...visitedCells],
                  targetColor,
                  replacementColor
                },
                dataStructure: {
                  type: 'grid',
                  title: 'Queue',
                  items: q.map(([cr, cc]) => ({ label: `(${cr}, ${cc})`, status: 'queued' }))
                }
              });
            }
          }
        }
      }

      steps.push({
        stepIndex: steps.length,
        cppLine: 23,
        description: `Flood Fill completed. All ${visitedCells.length} connected cells with color ${targetColor} repainted.`,
        phase: 'Complete',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...initVisited },
        gridState: {
          grid: currentGrid.map(row => [...row]),
          visitedCells: [...visitedCells],
          targetColor,
          replacementColor
        },
        dataStructure: {
          type: 'grid',
          title: 'Done',
          items: [{ label: 'Cells Painted', value: visitedCells.length }]
        }
      });
      break;
    }

    case 'rotten-oranges': {
      // LeetCode 994: Rotting Oranges (Multi-Source BFS)
      // 1: int orangesRotting(vector<vector<int>>& grid)
      // 7: for (int r = 0; r < rows; ++r) ... collect rotten (2) into q, count fresh (1)
      // 14: if (freshCount == 0) return 0;
      // 19: while (!q.empty() && freshCount > 0)
      // 22: auto [r, c] = q.front(); q.pop();
      // 28: grid[nr][nc] = 2; freshCount--; q.push({nr, nc});
      // 34: return freshCount == 0 ? minutes : -1;
      const nodeStates = { ...initNodeStates };
      const edgeStates = { ...initEdgeStates };
      const defaultRottenGrid: number[][] = [
        [2, 1, 1, 0, 1, 1, 1, 2],
        [1, 1, 0, 0, 1, 1, 1, 1],
        [0, 1, 1, 1, 1, 0, 1, 1],
        [1, 1, 1, 1, 0, 0, 1, 0],
        [1, 0, 1, 1, 1, 1, 1, 1],
        [0, 1, 1, 1, 2, 1, 1, 0]
      ];

      const currentGrid = gridData ? gridData.grid.map(row => [...row]) : defaultRottenGrid.map(row => [...row]);
      const rows = currentGrid.length;
      const cols = currentGrid[0].length;

      // Queue entries: [r, c, minute]
      const q: [number, number, number][] = [];
      let freshCount = 0;
      let initialRottenCount = 0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (currentGrid[r][c] === 2) {
            q.push([r, c, 0]);
            initialRottenCount++;
          } else if (currentGrid[r][c] === 1) {
            freshCount++;
          }
        }
      }

      // Step 0: Scan grid and initialize queue with all rotten oranges
      steps.push({
        stepIndex: 0,
        cppLine: 7,
        description: `Scan grid: Found ${initialRottenCount} initial rotten orange(s) [t=0] and ${freshCount} fresh orange(s). Enqueueing all sources into Multi-Source BFS Queue.`,
        phase: 'Collect Sources',
        nodeStates: { ...nodeStates },
        edgeStates: { ...edgeStates },
        visited: { ...initVisited },
        variables: {
          'Initial Rotten': initialRottenCount,
          'Fresh Oranges': freshCount,
          'Minutes': 0
        },
        gridState: {
          grid: currentGrid.map(row => [...row]),
          minutesElapsed: 0,
          freshRemaining: freshCount,
          rottenCount: initialRottenCount,
          isRottenOranges: true
        },
        dataStructure: {
          type: 'queue',
          title: 'Rotten Orange Queue (r, c, min)',
          items: q.map(([qr, qc, qm]) => ({
            label: `(${qr}, ${qc})`,
            value: `${qm}m`,
            badge: 'source',
            status: 'queued'
          }))
        }
      });

      if (freshCount === 0) {
        steps.push({
          stepIndex: steps.length,
          cppLine: 14,
          description: 'No fresh oranges exist initially. 0 minutes required.',
          phase: 'Complete',
          nodeStates: { ...nodeStates },
          edgeStates: { ...edgeStates },
          visited: { ...initVisited },
          variables: { 'Minutes': 0, 'Fresh Remaining': 0 },
          gridState: {
            grid: currentGrid.map(row => [...row]),
            minutesElapsed: 0,
            freshRemaining: 0,
            isRottenOranges: true
          },
          dataStructure: {
            type: 'queue',
            title: 'Queue Empty',
            items: []
          }
        });
      } else {
        const dx = [-1, 1, 0, 0];
        const dy = [0, 0, -1, 1];
        const dirLabels = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        let maxMinutes = 0;

        while (q.length > 0 && freshCount > 0) {
          const [r, c, minute] = q.shift()!;
          maxMinutes = Math.max(maxMinutes, minute);

          steps.push({
            stepIndex: steps.length,
            cppLine: 22,
            description: `Minute ${minute}: Pop rotten orange at (${r}, ${c}). Checking 4-way adjacent neighbors for fresh oranges.`,
            phase: `Minute ${minute} Spread`,
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...initVisited },
            variables: {
              'Active Source': `(${r}, ${c})`,
              'Minute': minute,
              'Fresh Remaining': freshCount
            },
            gridState: {
              grid: currentGrid.map(row => [...row]),
              activeCell: [r, c],
              minutesElapsed: minute,
              freshRemaining: freshCount,
              isRottenOranges: true
            },
            dataStructure: {
              type: 'queue',
              title: 'Rotten Orange Queue (r, c, min)',
              items: q.map(([qr, qc, qm]) => ({
                label: `(${qr}, ${qc})`,
                value: `${qm}m`,
                status: 'queued'
              }))
            }
          });

          for (let i = 0; i < 4; i++) {
            const nr = r + dx[i];
            const nc = c + dy[i];

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && currentGrid[nr][nc] === 1) {
              currentGrid[nr][nc] = 2; // Rots adjacent fresh orange
              freshCount--;
              const nextMinute = minute + 1;
              q.push([nr, nc, nextMinute]);
              maxMinutes = Math.max(maxMinutes, nextMinute);

              steps.push({
                stepIndex: steps.length,
                cppLine: 28,
                description: `Adjacent ${dirLabels[i]} cell (${nr}, ${nc}) was fresh (1) -> Now ROTTEN (2) at minute ${nextMinute}! Fresh remaining: ${freshCount}.`,
                phase: 'Contagion',
                nodeStates: { ...nodeStates },
                edgeStates: { ...edgeStates },
                visited: { ...initVisited },
                variables: {
                  'Infected Cell': `(${nr}, ${nc})`,
                  'Spread Minute': nextMinute,
                  'Fresh Remaining': freshCount
                },
                gridState: {
                  grid: currentGrid.map(row => [...row]),
                  activeCell: [nr, nc],
                  minutesElapsed: nextMinute,
                  freshRemaining: freshCount,
                  isRottenOranges: true
                },
                dataStructure: {
                  type: 'queue',
                  title: 'Rotten Orange Queue (r, c, min)',
                  items: q.map(([qr, qc, qm]) => ({
                    label: `(${qr}, ${qc})`,
                    value: `${qm}m`,
                    status: 'queued'
                  }))
                }
              });
            }
          }
        }

        // Final result step
        if (freshCount === 0) {
          steps.push({
            stepIndex: steps.length,
            cppLine: 34,
            description: `Success! All fresh oranges have rotted. Minimum time required: ${maxMinutes} minute${maxMinutes === 1 ? '' : 's'}.`,
            phase: 'Complete',
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...initVisited },
            variables: { 'Result': `${maxMinutes} mins`, 'Fresh Remaining': 0 },
            gridState: {
              grid: currentGrid.map(row => [...row]),
              minutesElapsed: maxMinutes,
              freshRemaining: 0,
              isRottenOranges: true
            },
            dataStructure: {
              type: 'queue',
              title: 'All Fresh Oranges Rotted',
              items: [{ label: 'Total Minutes', value: `${maxMinutes}m`, badge: 'Done' }]
            }
          });
        } else {
          steps.push({
            stepIndex: steps.length,
            cppLine: 34,
            description: `Impossible! Queue empty, but ${freshCount} fresh orange(s) are trapped/unreachable behind empty spaces. Returns -1.`,
            phase: 'Failed (-1)',
            cycleDetected: true,
            nodeStates: { ...nodeStates },
            edgeStates: { ...edgeStates },
            visited: { ...initVisited },
            variables: { 'Result': -1, 'Fresh Remaining': freshCount },
            gridState: {
              grid: currentGrid.map(row => [...row]),
              minutesElapsed: maxMinutes,
              freshRemaining: freshCount,
              isRottenOranges: true,
              impossible: true
            },
            dataStructure: {
              type: 'queue',
              title: 'Unreachable (-1)',
              items: [{ label: 'Unreachable Fresh', value: freshCount, badge: 'ERROR' }]
            }
          });
        }
      }
      break;
    }

    case 'cycle-undirected': {
      return generateCycleUndirectedSteps(graph, startNodeId, initVisited, initNodeStates, initEdgeStates);
    }

    case 'cycle-directed': {
      return generateCycleDirectedSteps(graph, startNodeId, initVisited, initNodeStates, initEdgeStates);
    }

    case 'circle-of-strings': {
      return generateCircleOfStringsSteps(graph, initVisited, initNodeStates, initEdgeStates);
    }

    case 'critical-connections': {
      return generateCriticalConnectionsSteps(graph, initVisited, initNodeStates, initEdgeStates);
    }

    case 'articulation-points': {
      return generateArticulationPointsSteps(graph, initVisited, initNodeStates, initEdgeStates);
    }

    case 'network-connected': {
      return generateMakeConnectedSteps(graph, initVisited, initNodeStates, initEdgeStates);
    }

    case 'eulerian-circuit': {
      return generateEulerianCircuitSteps(graph, startNodeId, initVisited, initNodeStates, initEdgeStates);
    }

    case 'cheapest-flights': {
      return generateCheapestFlightsSteps(graph, startNodeId, targetNodeId || graph.nodes[graph.nodes.length - 1]?.id || 'LAX', 1, initVisited, initNodeStates, initEdgeStates);
    }

    case 'covid-spread': {
      return generateCovidSpreadSteps(graph, startNodeId, initVisited, initNodeStates, initEdgeStates);
    }

    case 'course-schedule': {
      return generateCourseScheduleSteps(graph, initVisited, initNodeStates, initEdgeStates);
    }

    case 'course-schedule-2': {
      return generateCourseSchedule2Steps(graph, initVisited, initNodeStates, initEdgeStates);
    }

    case 'word-ladder': {
      return generateWordLadderSteps(
        graph,
        startNodeId,
        targetNodeId || 'cog',
        initVisited,
        initNodeStates,
        initEdgeStates
      );
    }

    case 'word-search': {
      const defaultBoard = [
        ['A', 'B', 'C', 'E'],
        ['S', 'F', 'C', 'S'],
        ['A', 'D', 'E', 'E']
      ];
      const board = wordSearchData?.board || defaultBoard;
      const targetWord = wordSearchData?.targetWord || 'ABCCED';
      return generateWordSearchSteps(board, targetWord);
    }
  }

  // Ensure total steps index count is uniform
  steps.forEach((s, idx) => {
    s.stepIndex = idx;
    s.totalSteps = steps.length;
  });

  return steps;
}
